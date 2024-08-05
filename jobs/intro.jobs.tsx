import { db } from "@/db/db";

import redis from "@/db/redis";
import { intro, producthunt } from "@/db/schema";
import { getWebsiteDescription } from "@/lib/ai/claude";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import assert from "assert";
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
  version: "0.0.1",
  trigger: eventTrigger({
    name: "run.all.intro"
  }),
  run: async (payload, io, ctx) => {
    const phs = await db.query.producthunt.findMany({
      where: eq(producthunt.webp, true),
      orderBy: desc(producthunt.added_at)
    });

    for (const item of phs) {
      const exist = await db.query.intro.findFirst({
        where: eq(intro.uuid, item.uuid!)
      });
      if (exist) continue;

      await io.logger.info(item.website + "");
      await io.sendEvent(item.uuid + " run all intro", {
        name: "run.ai.intro",
        payload: {
          url: item.website,
          uuid: item.uuid,
          type: "ph"
        }
      })
      await io.wait(item.uuid!, 5 * 60);
    }
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
        const ret = await getWebsiteDescription(payload.url);
        assert(ret.data.content[0].type === "text");
        const desc = ret.data.content[0].text;
        const deleted = blackKeywords.some(keyword => (desc as string).includes(keyword))
        await db.insert(intro).values({
          website: payload.url,
          uuid: payload.uuid,
          description: desc,
          type: payload.type,
          version: "0.0.1",
          deleted: deleted
        })
        await redis.set(`AI:Success:${payload.url}`, JSON.stringify(ret));
        return ret;
      } catch (e) {
        await redis.set(`AI:Error:${payload.url}`, (e as Error).message);
        throw (e);
      }

    }
  }
});