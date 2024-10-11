import { intervalTrigger, invokeTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { fetchPHPosts, fetchVoteCount } from "@/lib/producthunt";
import { db } from "@/db/db";
import { z } from "zod";
import { unifyUrl } from "@/lib/utils/url";
import { and, eq, gte } from "drizzle-orm";
import { subDays } from "date-fns";
import { products } from "@/db/schema";
import { ProductHuntMetadata } from "@/db/schema/types";
import { getAvailableSlug } from "@/lib/utils/slug";

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
    await db.update(products)
          .set({
            metadata: {
              votesCount: data.votesCount,
              commentCount: data.commentsCount,
            } as unknown as ProductHuntMetadata
          })
          .where(and(eq(products.id, payload.id), eq(products.itemType, 'ph')));
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
    const posts = await db.query.products.findMany({
      where: and(eq(products.itemType, 'ph'), gte(products.added_at, subDays(new Date(), 2)))
    })
    
    for(const post of posts) {
      if(!post.id) continue;
     
      await updateVoteData.invoke("update-vote-" + post.id , {
        id: post.id
      })
    }
  } 
})

client.defineJob({
  id: "fetch-ph-newest",
  name: "fetch ph newest",
  version: "0.0.5",
  trigger: intervalTrigger({
    seconds: 15 * 60
  }),
  run: async (payload, io, ctx) => {
    await io.logger.info('start fetch ph newest');
    const edges = await fetchPHPosts();
    for(const element of edges){
      
      if(!element.node.website || !element.node.name || element.node.name.length === 0) {
        await io.logger.error(`product has no website or name, skipping ${element.node.id}`);
        continue;
      }

      try{
        const resp = await fetch(element.node.website);
        element.node.website = unifyUrl(resp.url);
      }catch(e){
        await io.logger.error(`website has issues, can not fetch the real url, skipping ${element.node.id}`, element.node);
        continue;
      }
      
      const product = await db.query.products.findFirst({
        where: and(
          eq(products.itemType, 'ph'), 
          eq(products.id, element.node.id)
        )
      })
      if(product) {
        continue;
      }

      const websitedup = await db.query.products.findFirst({
        where: eq(products.website, element.node.website)
      })

      if(websitedup) {
        await io.logger.info(`product with website already exists ${websitedup.id}`);
        continue;
      }

      await io.logger.info(`product does not exist, inserting ${element.node.id}`);
      
      element.node.thumb_url = element.node.thumbnail?.url || "";

      const inserted = await db.insert(products).values({
        id: element.node.id,
        name: element.node.name,
        slug: await getAvailableSlug(element.node.name) || "",
        tagline: element.node.tagline || "",
        description: element.node.description || "",
        thumb_url: element.node.thumb_url,
        itemType: 'ph',
        launched_at: element.node.featuredAt ? new Date(element.node.featuredAt) : new Date(),
        website: element.node.website,
        metadata: {
          votesCount: 0,
          commentCount: 0,
          featuredAt: element.node.featuredAt ? new Date(element.node.featuredAt) : new Date()
        } as ProductHuntMetadata
      }).onConflictDoNothing().returning();
    
      await io.sendEvent("screenshot-"  + inserted[0].uuid, {
        name: "take.product.screenshot",
        payload: {
          url: element.node.website,
        uuid: inserted[0].uuid
      }
      })
    }
  }
});