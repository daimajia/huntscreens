import { db } from "@/db/db";

import redis from "@/db/redis";
import { intro, visibleProducts } from "@/db/schema";
import { getIntroFromScreenshot } from "@/lib/ai/intro";
import { generateRandomString } from "@/lib/crypto/random";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { eq } from "drizzle-orm";
import { z } from "zod";

const blackKeywords = [
  'SEO-friendly',
  'I apologize',
  '[Product Name]',
  'Unfortunately',
  'Page Not Found'
];

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
        if(product.webp === false) {
          return "No screenshot found";
        }

        const markdown = await getIntroFromScreenshot(`${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product.uuid}.webp`, product.name, product.website);
        await db.insert(intro).values({
          website: product.website,
          uuid: product.uuid,
          description: markdown,
          type: product.itemType,
          version: "0.0.3",
          deleted: false
        });
        
        await io.sendEvent(payload.uuid + " run translate " + generateRandomString(5), {
          name: "translate.new.entry",
          payload: {
            uuid: payload.uuid
          }
        })
        return { aiintro: markdown };
      } catch (e) {
        await redis.set(`AI:Error:${payload.uuid}`, (e as Error).message);
        return `AI:Error:${payload.uuid} Error: ${(e as Error).message}`;
      }
    }
  }
});