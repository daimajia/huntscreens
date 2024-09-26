import { db } from "@/db/db";

import redis from "@/db/redis";
import { products, visibleProducts } from "@/db/schema";
import { getIntroFromProduct } from "@/lib/ai/intro";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { eq } from "drizzle-orm";
import { z } from "zod";

const aiConcurrencyLimit = client.defineConcurrencyLimit({
  id: `ai-limit`,
  limit: 3,
});

export const addIntroJob = client.defineJob({
  id: "add AI introduction",
  name: "add AI introduction",
  version: "0.0.2",
  trigger: eventTrigger({
    name: "run.ai.intro",
    schema: z.object({
      uuid: z.string(),
    })
  }),
  concurrencyLimit: aiConcurrencyLimit,
  run: async (payload, io, ctx) => {
    const wasError = await redis.get(`AI:Error:${payload.uuid}`);
    if (wasError) {
      return "Already Error:" + wasError;
    } else {
      try {
        const product = await db.select().from(visibleProducts).where(eq(visibleProducts.uuid, payload.uuid)).then(rows => rows[0]);

        if(!product) {
          return "Product not found";
        }

        const markdowns = await getIntroFromProduct(product);

        await db.update(products).set({
          intros: markdowns
        }).where(eq(products.uuid, product.uuid));
        
        return { aiintro: markdowns };
      } catch (e) {
        await redis.set(`AI:Error:${payload.uuid}`, (e as Error).message);
        return `AI:Error:${payload.uuid} Error: ${(e as Error).message}`;
      }
    }
  }
});