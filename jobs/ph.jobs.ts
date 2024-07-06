import { eventTrigger, intervalTrigger, invokeTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { fetchPHPosts, fetchVoteCount } from "@/lib/producthunt";
import { producthunt } from "@/db/schema/ph";
import { db } from "@/db/db";
import { v4 as uuidv4 } from 'uuid';
import { prettyURL } from "@/lib/utils/url";
import { z } from 'zod';
import { desc, eq, gte } from "drizzle-orm";
import { subDays } from "date-fns";
import { getUsage } from "@/lib/screenshotone";

type ScreenshotResponse = {
  store: {
    location: string;
  }
}

const screenshotConcurrencyLimit = client.defineConcurrencyLimit({
  id: `screenshotone-limit`,
  limit: 40,
});

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
    posts.forEach(async (post) => {
      await updateVoteData.invoke("update-vote-" + post.id, {
        id: post.id
      })
    });
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
          body: JSON.stringify({
            access_key: process.env.SCREENSHOTONE_ACCESS_KEY,
            url: payload.url,
            store: "true",
            storage_path: payload.uuid,
            response_type: "json",
            async: "true",
            webhook_url: url,
            storage_return_location: "true",
            full_page: "true",
            viewport_width: 1920,
            viewport_height: 1080,
            device_scale_factor: 1,
            format: "webp",
            image_quality: 100,
            block_banners_by_heuristics: "true",
            delay: 5,
            block_ads: "true",
            block_chats: "true",
            block_cookie_banners: "true",
            cache: "true",
            cache_ttl: 2592000
          }),
        })
      },
      {
        timeoutInSeconds: 300
      }
    );
    if(result.store.location) {
      await io.logger.info('Screenshot successfully:', { payload });
      await db.update(producthunt).set({webp: true}).where(eq(producthunt.uuid, payload.uuid));
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
  id: "refresh-all-imgs",
  name: "refresh images",
  version: "0.0.3",
  trigger: invokeTrigger(),
  run: async (payload, io, ctx) => {
    const res = await db.query.producthunt.findMany({
      where: eq(producthunt.webp, false),
      limit: 20,
      orderBy: desc(producthunt.added_at)
    });
    res.forEach(async (item) => {
      await io.sendEvent(`refreshing-imgs-${item.uuid}`, {
        name: "take.screenshot",
        payload: {
          url: item.website || "",
          uuid: item.uuid || ""
        }
      });
    })
  }
});

client.defineJob({
  id: "fetch-ph-newest",
  name: "fetch ph newest",
  version: "0.0.3",
  trigger: intervalTrigger({
    seconds: 7200
  }),
  run: async (payload, io, ctx) => {
    await io.logger.info('start fetch ph newest');
    const edges = await fetchPHPosts();
    edges.forEach(async element => {

      const product = await db.query.producthunt.findFirst({
        where: eq(producthunt.id, element.node.id)
      })
      if(!product) {
        console.log(element.node.website);
        element.node.uuid = uuidv4();
        
        if(element.node.website) {
          const resp = await fetch(element.node.website);
          element.node.website = prettyURL(resp.url);
        }
        
        element.node.tags = element.node.topics?.nodes.flatMap(topic => topic.name) || [];

        await db.insert(producthunt).values(element.node).onConflictDoNothing();

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
    });
  }
});