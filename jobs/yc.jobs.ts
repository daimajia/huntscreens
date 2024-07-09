import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { z } from "zod";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { yc } from "@/db/schema";
import { getScreenshotOneParams, screenshotConcurrencyLimit, ScreenshotResponse } from "@/lib/screenshotone";


client.defineJob({
  id: "take YC screenshot",
  name: "take YC screenshot",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "screenshot.yc",
    schema: z.object({
      id: z.number()
    })
  }),
  concurrencyLimit: screenshotConcurrencyLimit,
  run: async (payload, io, ctx)=>{
    const company = await db.query.yc.findFirst({
      where: eq(yc.id, payload.id)
    });
    if(company && company.status !== "Inactive" && company.webp === false){
      const result = await io.waitForRequest<ScreenshotResponse>(
        `call-yc-screenshot`,
        async (webhook_url) => {
          await fetch(`https://api.screenshotone.com/take`, {
            method: 'post',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(getScreenshotOneParams(company.website, company.uuid, webhook_url))
          })
        },
        {
          timeoutInSeconds: 300
        }
      )
      if(result.store.location) {
        await db.update(yc).set({webp: true}).where(eq(yc.id, payload.id));
        return {
          payload: payload,
          result: result.store
        }
      }else{
        throw Error(`screenshot failed, ${result}`);
      }
    }
  }
})