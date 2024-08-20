import { eventTrigger, intervalTrigger, invokeTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { z } from "zod";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { yc } from "@/db/schema";
import { getScreenshotOneParams, screenshotConcurrencyLimit, ScreenshotResponse } from "@/lib/screenshotone";
import { fethcYCLatestCompanies } from "@/lib/yc";

client.defineJob({
  id: "Schedule YC Latest Portfolio",
  name: "Schedule YC Latest Portfolio",
  version: "0.0.2",
  trigger: intervalTrigger({
    seconds: 600
  }),
  run: async (payload, io, ctx) => {
    const ycCompanies = await fethcYCLatestCompanies();
    for(const company of ycCompanies){
      const exist = await db.query.yc.findFirst({
        where: eq(yc.objectID, company.objectID!)
      });
      if(!exist) {
        const inserted = await db.insert(yc).values(company).returning();

        await io.sendEvent("add intro" + inserted[0].uuid, {
          name: "run.ai.intro",
          payload: {
            url: inserted[0].website,
            uuid: inserted[0].uuid,
            type: "yc"
          }
        })

        await io.sendEvent(`take ${company.website} screenshot`, {
          name: "screenshot.yc",
          payload: {
            id: inserted[0].id
          }
        })

        await io.sendEvent("create embedding" + inserted[0].uuid, {
          name: "create.embedding",
          payload: {
            itemId: inserted[0].uuid,
            itemType: "yc",
            website: inserted[0].website,
            name: inserted[0].name,
            description: inserted[0].description || inserted[0].tagline || inserted[0].name
          }
        })

      }
    }
  }
});

client.defineJob({
  id: "Trigger YC screenshot events",
  name: "Trigger yc screenshot events",
  version: "0.0.1",
  trigger: invokeTrigger({
    schema: z.object({
      from_id: z.number(),
      end_id: z.number(),
    })
  }),
  run: async(payload, io, ctx) => {
    for(let i = payload.from_id; i <= payload.end_id; i++) {
      await io.sendEvent(`screenshot-yc-id-${i}`, {
        name: "screenshot.yc",
        payload: {
          id: i
        }
      })
    }
  }
})

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