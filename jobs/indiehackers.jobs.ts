import { intervalTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { db } from "@/db/db";
import { and, eq } from "drizzle-orm";
import { getIndiehackersProducts } from "@/lib/indiehackers";
import { products } from "@/db/schema";
import { IndieHackersMetadata } from "@/db/schema/types";
import { unifyUrl } from "@/lib/utils/url";
import { getAvailableSlug } from "@/lib/utils/slug";

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
        await io.logger.error(`product has no id, website or name, skipping ${new Date().toISOString()}`, product);
        continue;
      }

      const productExist = await db.query.products.findFirst({
        where: and(
          eq(products.id, product.id),
          eq(products.itemType, 'indiehackers')
        )
      });

      if(productExist) {
        await io.logger.info(`product already exists ${productExist.id}`);
        continue;
      }

      product.website = unifyUrl(product.website);

      const websiteExist = await db.query.products.findFirst({
        where: eq(products.website, product.website)
      });

      if(websiteExist) {
        await io.logger.info(`product already exists ${websiteExist.id}`);
        continue;
      }

      const inserted = await db.insert(products).values({
        ...product,
        slug: await getAvailableSlug(product.name) || "",
        metadata: {
          revenue: (product.metadata as IndieHackersMetadata)?.revenue || 0,
          followers: (product.metadata as IndieHackersMetadata)?.followers || 0
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