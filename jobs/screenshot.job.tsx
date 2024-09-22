import { db } from "@/db/db";
import { screenshotConcurrencyLimit, getUsage, ScreenshotResponse, getScreenshotOneParams } from "@/lib/screenshotone";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { eq } from "drizzle-orm";
import { z } from "zod";
import triggerCommonJobs from "./utils";
import { products } from "@/db/schema";

client.defineJob({
  id: "take product screenshot",
  name: "take product screenshot",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "take.product.screenshot",
    schema: z.object({
      url: z.string().url(),
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
      `call-screenshotone-${payload.uuid}`,
      async (url) => {
        await fetch(`https://api.screenshotone.com/take`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(getScreenshotOneParams(payload.url, payload.uuid, url)),
        })
      },
      {
        timeoutInSeconds: 300
      }
    );
    if(result.store.location) {
      await io.logger.info('Screenshot successfully:', { payload });
      await db.update(products).set({webp: true}).where(eq(products.uuid, payload.uuid));
      
      await triggerCommonJobs(io, payload.uuid);

    }else{
      await io.logger.error('got screenshot error', result);
    }
    return {
      payload: payload,
      result: result.store
    };
  }
});