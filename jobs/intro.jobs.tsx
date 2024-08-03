import { db } from "@/db/db";

import redis from "@/db/redis";
import { intro } from "@/db/schema";
import { getWebsiteDescription } from "@/lib/ai/claude";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import assert from "assert";
import { z } from "zod";

const aiConcurrencyLimit = client.defineConcurrencyLimit({
  id: `ai-limit`,
  limit: 1,
});

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
        await db.insert(intro).values({
          website: payload.url,
          uuid: payload.uuid,
          description: desc,
          type: payload.type,
          version: "0.0.1"
        })
        await redis.set(`AI:Success:${payload.url}`, JSON.stringify(ret));
        return ret;
      } catch (e) {
        await redis.set(`AI:Error:${payload.url}`, (e as Error).message);
        throw(e);
      }

    }
  }
});