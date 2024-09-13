import { db } from "@/db/db";
import { indiehackers, producthunt, taaft, yc } from "@/db/schema";
import { eq, isNull, or } from "drizzle-orm";
import { ProductTypes } from "@/types/product.types";
import { categorizeProductV3 } from "@/lib/ai/gemini/category.v3";
import { AIProductInfoForCategorization } from "@/lib/ai/types";
import redis from "@/db/redis";
import pLimit from 'p-limit';

const MAX_FAILURES = 15;
const REDIS_KEY_PREFIX = "categorization_failure:";
const CONCURRENCY_LIMIT = 10;

async function categorizeAndUpdateProduct(table: any, itemType: ProductTypes) {
  const items = await db.select().from(table).where(or(
    eq(table.categories,{}), 
    eq(table.categories, []), 
    isNull(table.categories)));
  const limit = pLimit(10);
  let consecutiveFailures = 0;

  const updateTasks = items.map(item => limit(async () => {
    console.log(`Processing ${itemType} item: ${item.name}`);

    if (isDataCorrectAndComplete(item.categories)) {
      console.log(`Skipping ${itemType} item: ${item.name} - Data already correct and complete`);
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

      await db.update(table).set({
        categories: {
          maincategory: result.maincategory,
          subcategory: result.subcategory,
          topics: result.topics
        },
        isai: result.isAIProduct
      }).where(eq(table.uuid, item.uuid));
      
      console.log(`Updated ${itemType} item categories and AI flag: ${item.name}`);
      consecutiveFailures = 0;
    } catch (error) {
      console.error(`Failed to categorize ${itemType} item: ${item.name}. Error: ${error}`);
      await redis.set(`${REDIS_KEY_PREFIX}${itemType}:${item.uuid}`, JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        productInfo,
        timestamp: Date.now()
      }));
      consecutiveFailures++;

      if (consecutiveFailures >= MAX_FAILURES) {
        console.error(`Reached ${MAX_FAILURES} consecutive failures. Stopping the process.`);
        throw new Error(`Max consecutive failures reached for ${itemType}`);
      }
    }
  }));

  try {
    await Promise.all(updateTasks);
  } catch (error) {
    console.error(`Error in categorizeAndUpdateProduct for ${itemType}:`, error);
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

  const limit = pLimit(CONCURRENCY_LIMIT);

  const tasks = [
    limit(() => categorizeAndUpdateProduct(producthunt, "ph")),
    limit(() => categorizeAndUpdateProduct(yc, "yc")),
    limit(() => categorizeAndUpdateProduct(indiehackers, "indiehackers")),
    limit(() => categorizeAndUpdateProduct(taaft, "taaft"))
  ];

  try {
    await Promise.all(tasks);
    console.log("Categorization process completed!");
  } catch (error) {
    console.error("An error occurred during the categorization process:", error);
  }
}

if (require.main === module) {
  categorizeAllProducts().catch(console.error);
}
