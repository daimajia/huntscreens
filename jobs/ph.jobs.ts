import { intervalTrigger, invokeTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { fetchPHPosts, fetchVoteCount } from "@/lib/producthunt";
import { producthunt } from "@/db/schema/ph";
import { db } from "@/db/db";
import { v4 as uuidv4 } from 'uuid';
import { prettyURL } from "@/lib/utils/url";
import { z } from 'zod';
import { eq, gte } from "drizzle-orm";
import { subDays } from "date-fns";

type ScreenshotResponse = {
  store: {
    location: string;
  }
}

const screenshotConcurrencyLimit = client.defineConcurrencyLimit({
  id: `screenshotone-limit`,
  limit: 1, 
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

export const takeScreenshotJob = client.defineJob({
  id: "take ph screenshot",
  name: "take ph screenshot",
  version: "0.0.1",
  trigger: invokeTrigger({
    schema: z.object({
      url: z.string().url(),
      uuid: z.string()
    })
  }),
  concurrencyLimit: screenshotConcurrencyLimit,
  run: async (payload, io, ctx) => {
    console.log(payload.url, payload.uuid);
    const result = await io.waitForRequest<ScreenshotResponse>(
      `screenshotone-${payload.uuid}`,
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
            full_page_scroll: 'true',
            viewport_width: 1920,
            viewport_height: 1080,
            device_scale_factor: 1,
            format: "png",
            image_quality: 100,
            block_banners_by_heuristics: "true",
            delay: 5,
            timeout: 60,
            wait_until:'load',
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
      console.log('updating:', payload.url);
      await db.update(producthunt).set({s3: true}).where(eq(producthunt.uuid, payload.uuid));
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
  version: "0.0.2",
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

        await db.insert(producthunt).values(element.node).onConflictDoNothing();

        if(element.node.website){
          await takeScreenshotJob.invoke("screenshot-"  + element.node.uuid, {
            url: element.node.website,
            uuid: element.node.uuid
          })
        }
      }
    });
  }
});