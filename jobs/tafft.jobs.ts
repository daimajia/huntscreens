import { db } from "@/db/db";
import { products } from "@/db/schema";
import { TaaftMetadata } from "@/db/schema/types";
import { fetchTAAFTLatest, fetchTAAFTProductDetails } from "@/lib/theresanaiforthat";
import { getAvailableSlug } from "@/lib/utils/slug";
import { parseDate } from "@/lib/utils/time";
import { unifyUrl } from "@/lib/utils/url";
import { client } from "@/trigger";
import { eventTrigger, intervalTrigger } from "@trigger.dev/sdk";
import { eq } from "drizzle-orm";
import { z } from "zod";

const chromeRunLimitation = client.defineConcurrencyLimit({
  id: `chrome-limit`,
  limit: 1,
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

    product.website = unifyUrl(product.website);
    const exist = await db.query.products.findFirst({
      where: eq(products.website, product.website)
    });
    if(exist) return "already exists";
    const inserted = await db.insert(products).values({
      id: product.id,
      name: product.name,
      slug: await getAvailableSlug(product.name) || "",
      tagline: product.tagline,
      description: product.description,
      website: product.website,
      itemType: "taaft",
      thumb_url: product.thumb_url || "",
      launched_at: product.added_at ? parseDate(product.added_at) : new Date(),
      metadata: {
        savesCount: product.savesCount,
        commentsCount: product.commentsCount
      } as TaaftMetadata
    }).returning();

    const uuid = inserted[0].uuid;

    await io.sendEvent(uuid, {
      name: "take.product.screenshot",
      payload: {
        website: product.website,
        uuid: uuid
      }
    });

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
        const exist = await db.query.products.findFirst({
          where: eq(products.website, product.product_link)
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