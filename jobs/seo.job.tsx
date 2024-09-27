import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { products, visibleProducts } from "@/db/schema";
import { locales } from "@/i18n/types";
import { generateSEOContent } from "@/lib/ai/gemini/seo.generator";

const seoConcurrencyLimit = client.defineConcurrencyLimit({
  id: `seo-limit`,
  limit: 3,
});

client.defineJob({
  id: "generate-seo-for-product",
  name: "Generate SEO for Product",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "generate.seo.for.product",
    schema: z.object({
      uuid: z.string()
    })
  }),
  concurrencyLimit: seoConcurrencyLimit,
  run: async (payload, io, ctx) => {
    const { uuid } = payload;

    const results = await db.select().from(visibleProducts).where(eq(visibleProducts.uuid, uuid));

    if (!results || results.length === 0) {
      await io.logger.error(`Product not found for ${uuid}`);
      return { success: false, error: "Product not found" };
    }

    const product = results[0];

    try {
      let updatedSeo = { ...product.seo } || {};
      let hasChanges = false;

      for (const locale of locales) {
        if (!updatedSeo[locale]) {
          const seoContent = await generateSEOContent(product.name, product.tagline || "", product.description || "", locale);
          updatedSeo[locale] = seoContent;
          hasChanges = true;
        }
      }

      if (hasChanges) {
        await db.update(products).set({
          seo: updatedSeo
        }).where(eq(products.uuid, uuid));
      }

      return { 
        success: true, 
        uuid,
      };
    } catch (error) {
      await io.logger.error(`Error generating SEO content for ${uuid}: ${error}`);
      return { success: false, error: String(error) };
    }
  }
});
