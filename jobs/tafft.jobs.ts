import { db } from "@/db/db";
import { taaft } from "@/db/schema";
import { getScreenshotOneParams, getUsage, screenshotConcurrencyLimit, ScreenshotResponse } from "@/lib/screenshotone";
import { fetchTAAFTLatest, fetchTAAFTProductDetails } from "@/lib/theresanaiforthat";
import { client } from "@/trigger";
import { eventTrigger, intervalTrigger } from "@trigger.dev/sdk";
import { eq } from "drizzle-orm";
import { z } from "zod";

const chromeRunLimitation = client.defineConcurrencyLimit({
  id: `chrome-limit`,
  limit: 1,
});


client.defineJob({
  id: "take taaft screenshot",
  name: "take taaft screenshot",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "take.taaft.screenshot",
    schema: z.object({
      website: z.string(),
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
      "call-screenshotone-" + payload.uuid,
      async (url) => {
        await fetch(`https://api.screenshotone.com/take`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(getScreenshotOneParams(payload.website, payload.uuid, url)),
        })
      },
      {
        timeoutInSeconds: 300
      }
    )
    if(result.store.location) {
      await io.logger.info('Screenshot successfully:', { payload });
      await db.update(taaft).set({webp: true}).where(eq(taaft.uuid, payload.uuid));
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
  id: "fetch taaft product detail",
  name: "fetch taaft product detail",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "taaft.detail",
    schema: z.object({
      taaft_url: z.string()
    })
  }),
  concurrencyLimit:chromeRunLimitation,
  run: async (payload, io, ctx)=> {
    const product = await fetchTAAFTProductDetails(payload.taaft_url);
    const exist = await db.query.taaft.findFirst({
      where: eq(taaft.website, product.website)
    })
    if(exist) return "already exists";
    const inserted = await db.insert(taaft).values(product).returning();
    const uuid = inserted[0].uuid;


    await io.sendEvent("add intro" + inserted[0].uuid, {
      name: "run.ai.intro",
      payload: {
        url: inserted[0].website,
        uuid: inserted[0].uuid,
        type: "taaft"
      }
    })

    await io.sendEvent(uuid, {
      name: "take.taaft.screenshot",
      payload: {
        website: product.website,
        uuid: uuid
      }
    });

    await io.wait("avoid Cloudflare block", 60);
    return {
      uuid: uuid,
      website: product.website
    }
  }
});

client.defineJob({
  id: "fetch taaft latest products",
  name:"fetch taaft products",
  version: "0.0.1",
  trigger: intervalTrigger({
    seconds: 21600
  }),
  run: async (payload, io, ctx) => {
    await io.runTask("fetch-taaft-task", async () => {
      const latest = await fetchTAAFTLatest();
      for(const product of latest){
        const exist = await db.query.taaft.findFirst({
          where: eq(taaft.website, product.product_link)
        });
        if(!exist) {
          await io.sendEvent(product.taaft_link, {
            name: "taaft.detail",
            payload: {
              taaft_url: product.taaft_link
            }
          })
        }
      }
      return latest;
    })
  }
})