import { db } from "@/db/db";

import redis from "@/db/redis";
import { intro, products } from "@/db/schema";
import { getURLAiIntro } from "@/lib/ai/intro";
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
        const allProducts = await db.select().from(products).where(eq(products.uuid, payload.uuid));
        const product = allProducts[0];

        const { aiintro, prompt } = await getURLAiIntro(product.website);
        const deleted = blackKeywords.some(keyword => aiintro.includes(keyword))
        await db.insert(intro).values({
          website: product.website,
          uuid: product.uuid,
          description: aiintro,
          type: product.itemType,
          version: "0.0.2",
          deleted: deleted
        });
        
        await io.sendEvent(payload.uuid + " run translate " + generateRandomString(5), {
          name: "translate.new.entry",
          payload: {
            uuid: payload.uuid
          }
        })
        await redis.set(`AI:Success:${payload.uuid}`, `{aiintro: ${aiintro}, prompt: ${prompt}}`);
        return { aiintro: aiintro, prompt: prompt };
      } catch (e) {
        await redis.set(`AI:Error:${payload.uuid}`, (e as Error).message);
        return `AI:Error:${payload.uuid} Error: ${(e as Error).message}`;
      }
    }
  }
});