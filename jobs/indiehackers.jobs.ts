import { intervalTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { db } from "@/db/db";
import { and, eq } from "drizzle-orm";
import { getIndiehackersProducts } from "@/lib/indiehackers";
import { products } from "@/db/schema";
import { IndieHackersMetadata } from "@/db/schema/types";
import slugify from "slugify";

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

      if(!product.id || !product.website || !product.name) {
        await io.logger.error('product has no id, website or name, skipping', product);
        continue;
      }

      const productExist = await db.query.products.findFirst({
        where: and(
          eq(products.id, product.id),
          eq(products.itemType, 'indiehackers')
        )
      });

      if(productExist) {
        await io.logger.info('product already exists', productExist);
        continue;
      }

      const websiteExist = await db.query.products.findFirst({
        where: eq(products.website, product.website)
      });

      if(websiteExist) {
        await io.logger.info('product already exists', websiteExist);
        continue;
      }

      const inserted = await db.insert(products).values({
        id: product.id,
        name: product.name,
        tagline: product.tagline || "",
        slug: slugify(product.name),
        description: product.description || "",
        website: product.website,
        itemType: "indiehackers",
        thumb_url: product.thumb_url || "",
        launched_at: product.added_at || new Date(),
        metadata: {
          revenue: product.revenue,
          followers: product.followers
        } as IndieHackersMetadata
      }).returning();

      await io.sendEvent(`take ${product.website} screenshot`, {
          name: "take.product.screenshot",
          payload: {
          uuid: inserted[0].uuid,
          website: inserted[0].website
        }
      })
    }
  }
});