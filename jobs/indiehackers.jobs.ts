import { eventTrigger, intervalTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { z } from "zod";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { indiehackers } from "@/db/schema";
import { getScreenshotOneParams, screenshotConcurrencyLimit, ScreenshotResponse } from "@/lib/screenshotone";
import { getIndiehackersProducts } from "@/lib/indiehackers";

client.defineJob({
  id: "Schedule Indiehackers Latest products",
  name: "Schedule Indiehackers Latest products",
  version: "0.0.2",
  trigger: intervalTrigger({
    seconds: 600
  }),
  run: async (payload, io, ctx) => {
    const ids = await getIndiehackersProducts();
    for(const product of ids){
      const exist = await db.query.indiehackers.findFirst({
        where: eq(indiehackers.objectId, product.objectId!)
      });
      if(!exist) {
        const inserted = await db.insert(indiehackers).values(product).returning();

        await io.sendEvent("add intro" + inserted[0].uuid, {
          name: "run.ai.intro",
          payload: {
            url: inserted[0].website,
            uuid: inserted[0].uuid,
            type: "indiehackers"
          }
        })

        await io.sendEvent(`take ${product.website} screenshot`, {
          name: "screenshot.indiehackers",
          payload: {
            uuid: inserted[0].uuid,
            website: inserted[0].website
          }
        })
      }
    }
  }
});

client.defineJob({
  id: "take Indiehackers screenshot",
  name: "take Indiehackers screenshot",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "screenshot.indiehackers",
    schema: z.object({
      uuid: z.string(),
      website: z.string()
    })
  }),
  concurrencyLimit: screenshotConcurrencyLimit,
  run: async (payload, io, ctx)=>{
    const result = await io.waitForRequest<ScreenshotResponse>(
      `call-indiehackers-screenshot`,
      async (webhook_url) => {
        await fetch(`https://api.screenshotone.com/take`, {
          method: 'post',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(getScreenshotOneParams(payload.website, payload.uuid, webhook_url))
        })
      },
      {
        timeoutInSeconds: 300
      }
    )
    if(result.store.location) {
      await db.update(indiehackers).set({webp: true}).where(eq(indiehackers.uuid, payload.uuid));

      await io.sendEvent(`create embedding for ${payload.website}`, {
        name: "create.embedding.by.type",
        payload: {
          productType: "indiehackers",
          uuid: payload.uuid,
        }
      });

      return {
        payload: payload,
        result: result.store
      }
    }else{
      throw Error(`screenshot failed, ${result}`);
    }
  }
})