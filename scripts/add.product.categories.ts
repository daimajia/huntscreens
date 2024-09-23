import { db } from "@/db/db";
import { eq, sql } from "drizzle-orm";
import { categorizeProductV3 } from "@/lib/ai/gemini/category.v3";
import { AIProductInfoForCategorization } from "@/lib/ai/types";
import redis from "@/db/redis";
import pLimit from 'p-limit';
import { visibleProducts } from "@/db/schema/views/visible.products";
import { products } from "@/db/schema";

const MAX_FAILURES = 15;
const REDIS_KEY_PREFIX = "categorization_failure:";
const CONCURRENCY_LIMIT = 10;

async function categorizeAndUpdateProduct() {
  const items = await db.select().from(visibleProducts).where(
    eq(visibleProducts.categories, sql`'{}'::jsonb`)
  )
  const limit = pLimit(10);
  let consecutiveFailures = 0;

  const updateTasks = items.map(item => limit(async () => {
    console.log(`Processing ${item.itemType} item: ${item.name}`);

    if (isDataCorrectAndComplete(item.categories)) {
      console.log(`Skipping ${item.itemType} item: ${item.name} - Data already correct and complete`);
      return;
    }

    const productInfo: AIProductInfoForCategorization = {
      name: item.name,
      tagline: item.tagline || " ",
      description: item.description || " ",
      link: item.website,
      screenshot: `https://shot.huntscreens.com/${item.uuid}.webp`
    };

    try {
      const result = await categorizeProductV3(productInfo);

      await db.update(products).set({
        categories: {
          maincategory: result.maincategory,
          subcategory: result.subcategory,
          topics: result.topics
        },
        isai: result.isAIProduct
      }).where(eq(products.uuid, item.uuid));
      
      console.log(`Updated ${item.itemType} item categories and AI flag: ${item.name}`);
      consecutiveFailures = 0;
    } catch (error) {
      console.error(`Failed to categorize ${item.itemType} item: ${item.name}. Error: ${error}`);
      await redis.set(`${REDIS_KEY_PREFIX}${item.itemType}:${item.uuid}`, JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        productInfo,
        timestamp: Date.now()
      }));
      consecutiveFailures++;

      if (consecutiveFailures >= MAX_FAILURES) {
        console.error(`Reached ${MAX_FAILURES} consecutive failures. Stopping the process.`);
        throw new Error(`Max consecutive failures reached for ${item.itemType}`);
      }
    }
  }));

  try {
    await Promise.all(updateTasks);
  } catch (error) {
    console.error(`Error in categorizeAndUpdateProduct:`, error);
  }
}

function isDataCorrectAndComplete(item: any): boolean {
  return (
    item.maincategory &&
    item.subcategory &&
    Array.isArray(item.topics) &&
    item.topics.length > 0
  );
}

async function categorizeAllProducts() {
  console.log("Starting categorization process...");

  try {
    await categorizeAndUpdateProduct();
    console.log("Categorization process completed!");
  } catch (error) {
    console.error("An error occurred during the categorization process:", error);
  }
}

if (require.main === module) {
  categorizeAllProducts().catch(console.error);
}
