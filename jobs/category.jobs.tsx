import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { categorizeProductV3 } from "@/lib/ai/gemini/category.v3";
import { AIProductInfoForCategorization } from "@/lib/ai/types";
import { products } from "@/db/schema";

const categoryConcurrencyLimit = client.defineConcurrencyLimit({
  id: `category-limit`,
  limit: 5,
});

client.defineJob({
  id: "generate-category-for-product",
  name: "Generate Category for Product",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "generate.category.for.product",
    schema: z.object({
      uuid: z.string()
    })
  }),
  concurrencyLimit: categoryConcurrencyLimit,
  run: async (payload, io, ctx) => {
    const { uuid } = payload;

    const item = await db.select().from(products).where(eq(products.uuid, uuid)).limit(1);

    if (!item || item.length === 0) {
      await io.logger.error(`Item not found for ${uuid}`);
      return { success: false, error: "Item not found" };
    }

    const entry = item[0];

    const productInfo: AIProductInfoForCategorization = {
      name: entry.name || "",
      tagline: entry.tagline || "",
      description: entry.description || "",
      link: entry.website || "",
      screenshot: `https://shot.huntscreens.com/${entry.uuid}.webp`
    };

    try {
      const categoryResult = await categorizeProductV3(productInfo);

      await db.update(products).set({
        categories: {
          maincategory: categoryResult.maincategory,
          subcategory: categoryResult.subcategory,
          topics: categoryResult.topics
        },
        isai: categoryResult.isAIProduct
      }).where(eq(products.uuid, uuid));

      await io.logger.info(`Successfully categorized ${uuid}`);
      return { 
        success: true, 
        uuid, 
        categories: {
          maincategory: categoryResult.maincategory,
          subcategory: categoryResult.subcategory,
          topics: categoryResult.topics
        },
        isAIProduct: categoryResult.isAIProduct
      };
    } catch (error) {
      await io.logger.error(`Error categorizing ${uuid}: ${error}`);
      return { success: false, error: String(error) };
    }
  }
});
