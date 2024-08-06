import { ProductTypes } from "@/app/types/product.types";
import { db } from "@/db/db";

import redis from "@/db/redis";
import { IndieHackers, indiehackers, intro, Producthunt, producthunt, YC, yc } from "@/db/schema";
import { getURLAiIntro } from "@/lib/ai/intro";
import { generateRandomString } from "@/lib/crypto/random";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { desc, eq } from "drizzle-orm";
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
  limit: 1,
});



client.defineJob({
  id: "run all ai intro",
  name: "run all ai intro",
  version: "0.0.2",
  trigger: eventTrigger({
    name: "run.all.intro"
  }),
  run: async (payload, io, ctx) => {

    async function iterateRun(products: Producthunt[] | YC[] | IndieHackers[], productType: ProductTypes) {
      for (const item of products) {
        const wasError = await redis.get(`AI:Error:${payload.url}`);

        if(wasError) continue;

        const exist = await db.query.intro.findFirst({
          where: eq(intro.uuid, item.uuid!)
        });

        if (exist) continue;

        await io.logger.info(item.website + "");
        await io.sendEvent(item.uuid + " run all intro " + generateRandomString(5), {
          name: "run.ai.intro",
          payload: {
            url: item.website,
            uuid: item.uuid,
            type: productType
          }
        })
        await io.wait(item.uuid!, 20);
      }
    };

    const phs = await db.query.producthunt.findMany({
      where: eq(producthunt.webp, true),
      orderBy: desc(producthunt.added_at)
    });

    await iterateRun(phs, "ph");

    const ycs = await db.query.yc.findMany({
      where: eq(yc.webp, true),
      orderBy: desc(yc.launched_at)
    });

    await iterateRun(ycs, "yc");

    const ihs = await db.query.indiehackers.findMany({
      where: eq(indiehackers.webp, true),
      orderBy: desc(indiehackers.added_at)
    });

    await iterateRun(ihs, "indiehackers");
  }
})

export const addIntroJob = client.defineJob({
  id: "add AI introduction",
  name: "add AI introduction",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "run.ai.intro",
    schema: z.object({
      url: z.string().url(),
      uuid: z.string(),
      type: z.string()
    })
  }),
  concurrencyLimit: aiConcurrencyLimit,
  run: async (payload, io, ctx) => {
    const wasError = await redis.get(`AI:Error:${payload.url}`);
    if (wasError) {
      return "Already Error:" + wasError;
    } else {
      try {
        const { aiintro, prompt } = await getURLAiIntro(payload.url);
        const deleted = blackKeywords.some(keyword => aiintro.includes(keyword))
        await db.insert(intro).values({
          website: payload.url,
          uuid: payload.uuid,
          description: aiintro,
          type: payload.type,
          version: "0.0.2",
          deleted: deleted
        })
        await redis.set(`AI:Success:${payload.url}`, `{aiintro: ${aiintro}, prompt: ${prompt}}`);
        return { aiintro: aiintro, prompt: prompt };
      } catch (e) {
        await redis.set(`AI:Error:${payload.url}`, (e as Error).message);
        return `AI:Error:${payload.url} Error: ${(e as Error).message}`;
      }
    }
  }
});