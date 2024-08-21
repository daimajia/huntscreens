import { eventTrigger, intervalTrigger, invokeTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { fetchPHPosts, fetchVoteCount } from "@/lib/producthunt";
import { producthunt } from "@/db/schema/ph";
import { db } from "@/db/db";
import { v4 as uuidv4 } from 'uuid';
import { removeUrlParams } from "@/lib/utils/url";
import { z } from 'zod';
import { eq, gte } from "drizzle-orm";
import { subDays } from "date-fns";
import { getScreenshotOneParams, getUsage, screenshotConcurrencyLimit, ScreenshotResponse } from "@/lib/screenshotone";

const producthuntConcurrencyLimit = client.defineConcurrencyLimit({
  id: `ph-limit`,
  limit: 1, 
});

const updateVoteData = client.defineJob({
  id: "update vote data",
  name: "Update Vote and Comment data",
  version: "0.0.1",
  trigger: invokeTrigger({
    schema: z.object({
      id: z.number()
    })
  }),
  concurrencyLimit: producthuntConcurrencyLimit,
  run: async (payload, io, ctx) =>  {
    const data = await fetchVoteCount(payload.id);
    await db.update(producthunt)
          .set({votesCount: data.votesCount, commentCount: data.commentsCount})
          .where(eq(producthunt.id, payload.id));
    return {
      id: payload.id,
      data: data
    }
  }
});

client.defineJob({
  id: "schedule vote data",
  name: "schedule update vote and comment data",
  version: "0.0.1",
  trigger: intervalTrigger({
    seconds: 7200,
  }),
  run: async () => {
    const posts = await db.query.producthunt.findMany({
      where: gte(producthunt.featuredAt, subDays(new Date(), 2).toUTCString()),
      limit: 100
    })
    for(const post of posts) {
      await updateVoteData.invoke("update-vote-" + post.id, {
        id: post.id
      })
    }
  } 
})

client.defineJob({
  id: "take ph screenshot",
  name: "take ph screenshot",
  version: "0.0.3",
  trigger: eventTrigger({
    name: "take.screenshot",
    schema: z.object({
      url: z.string().url(),
      uuid: z.string()
    })
  }),
  concurrencyLimit: screenshotConcurrencyLimit,
  run: async (payload, io, ctx) => {
    const screenshotoneUsage = await getUsage();
    await io.logger.info('Screenshotone Usage', {screenshotoneUsage});
    if(screenshotoneUsage.available === 0) {
      throw Error("no screenshotone quota");
    }

    const result = await io.waitForRequest<ScreenshotResponse>(
      `call-screenshotone-${payload.uuid}`,
      async (url) => {
        await fetch(`https://api.screenshotone.com/take`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(getScreenshotOneParams(payload.url, payload.uuid, url)),
        })
      },
      {
        timeoutInSeconds: 300
      }
    );
    if(result.store.location) {
      await io.logger.info('Screenshot successfully:', { payload });
      await db.update(producthunt).set({webp: true}).where(eq(producthunt.uuid, payload.uuid));
      
      await io.sendEvent(`create embedding for ${payload.url}`, {
        name: "create.embedding.by.type",
        payload: {
          productType: "ph",
          uuid: payload.uuid,
        }
      });

    }else{
      await io.logger.error('got screenshot error', result);
    }
    return {
      payload: payload,
      result: result.store
    };
  }
});

client.defineJob({
  id: "fetch-ph-newest",
  name: "fetch ph newest",
  version: "0.0.4",
  trigger: intervalTrigger({
    seconds: 600
  }),
  run: async (payload, io, ctx) => {
    await io.logger.info('start fetch ph newest');
    const edges = await fetchPHPosts();
    for(const element of edges){
      const product = await db.query.producthunt.findFirst({
        where: eq(producthunt.id, element.node.id)
      })
      if(!product) {
        console.log(element.node.website);
        element.node.uuid = uuidv4();
        
        if(element.node.website) {
          try{
            const resp = await fetch(element.node.website);
            element.node.website = removeUrlParams(resp.url, 'ref');
          }catch(e){
            await io.logger.error('website has issues, can not fetch the real url, skipping', element.node);
            continue;
          }
        }
        
        element.node.tags = element.node.topics?.nodes.flatMap(topic => topic.name) || [];
        element.node.thumb_url = element.node.thumbnail?.url || "";

        const inserted = await db.insert(producthunt).values(element.node).onConflictDoNothing().returning();
        
        await io.sendEvent("add intro" + inserted[0].uuid, {
          name: "run.ai.intro",
          payload: {
            url: inserted[0].website,
            uuid: inserted[0].uuid,
            type: "ph"
          }
        })

        if(element.node.website){
          await io.sendEvent("screenshot-"  + element.node.uuid, {
            name: "take.screenshot",
            payload: {
              url: element.node.website,
              uuid: element.node.uuid
            }
          })
        }
      }
    }
  }
});