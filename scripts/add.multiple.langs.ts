import { db } from "@/db/db";
import { producthunt, yc, indiehackers, taaft, intro } from "@/db/schema";
import { eq, is } from "drizzle-orm";
import { locales, SupportedLangs } from "@/i18n/routing";
import { ProductTypes } from "@/types/product.types";
import { translateByGemini } from "@/lib/ai/gemini";
import { TranslationContent } from "@/db/schema/types";
import redis from "@/db/redis";
import pLimit from 'p-limit';

const MAX_FAILURES = 15;
const REDIS_KEY_PREFIX = "translation_failure:";
const CONCURRENCY_LIMIT = 4;

async function translateWithoutRetry(text: string, targetLanguages: SupportedLangs[]): Promise<Record<SupportedLangs, TranslationContent>> {
  const contentToTranslate = { tagline: text, description: text, aiintro: text };
  return await translateByGemini({ json: contentToTranslate, targetLanguages });
}

async function translateAndUpdateProduct(table: any, itemType: ProductTypes) {
  const items = await db.select().from(table).where(eq(table.translations, {}));
  const limit = pLimit(10); 
  let consecutiveFailures = 0;
  
  const updateTasks = items.map(item => limit(async () => {
    console.log(`Processing ${itemType} item: ${item.name}`);
    
    const aiIntro = await db.query.intro.findFirst({
      where: eq(intro.uuid, item.uuid)
    });

    const contentToTranslate = {
      tagline: item.tagline || "",
      description: item.description || "",
      aiintro: aiIntro?.description || ""
    };

    const existingTranslations = item.translations || {};
    const missingLanguages = Object.values(locales).filter(lang => 
      lang !== 'en' && !existingTranslations[lang]
    );

    if (missingLanguages.length === 0) {
      console.log(`All translations exist for ${itemType} item: ${item.name}. Skipping.`);
      return;
    }

    const newTranslations: Partial<Record<SupportedLangs, typeof contentToTranslate>> = {};

    const estimatedTokens = JSON.stringify(contentToTranslate).length / 4;
    const maxLanguagesPerBatch = Math.floor(8192 / (estimatedTokens * 1.5));

    for (let i = 0; i < missingLanguages.length; i += maxLanguagesPerBatch) {
      const languageBatch = missingLanguages.slice(i, i + maxLanguagesPerBatch);
      console.log(`Translating batch for ${itemType} item: ${item.name}`);
      try {
        const translatedContent = await translateWithoutRetry(JSON.stringify(contentToTranslate), languageBatch);
        Object.assign(newTranslations, translatedContent);
        consecutiveFailures = 0;
      } catch (error) {
        console.error(`Failed to translate batch for ${itemType} item: ${item.name}. Skipping this batch.`);
        await redis.set(`${REDIS_KEY_PREFIX}${itemType}:${item.uuid}`, JSON.stringify({
          error: error instanceof Error ? error.message : String(error),
          contentToTranslate,
          languageBatch,
          "timestamp": Date.now()
        }));
        consecutiveFailures++;
        
        if (consecutiveFailures >= MAX_FAILURES) {
          console.error(`Reached ${MAX_FAILURES} consecutive failures. Stopping the process.`);
          throw new Error(`Max consecutive failures reached for ${itemType}`);
        }
        
        continue;
      }
    }

    if (Object.keys(newTranslations).length === 0) {
      console.log(`No new translations for ${itemType} item: ${item.name}. Skipping update.`);
      return;
    }
  
    const updatedTranslations = { ...existingTranslations, ...newTranslations };

    try {
      await db.update(table).set({
        translations: updatedTranslations
      }).where(eq(table.uuid, item.uuid));
      console.log(`Updated translations for ${itemType} item: ${item.name}`);
    } catch (error) {
      console.error(`Failed to update translations for ${itemType} item: ${item.name}:`, error);
    }
  }));

  try {
    await Promise.all(updateTasks);
  } catch (error) {
    console.error(`Error in translateAndUpdateProduct for ${itemType}:`, error);
  }
}

async function translateAllProducts() {
  console.log("Starting translation process...");

  const limit = pLimit(CONCURRENCY_LIMIT);

  const tasks = [
    limit(() => translateAndUpdateProduct(producthunt, "ph")),
    limit(() => translateAndUpdateProduct(yc, "yc")),
    limit(() => translateAndUpdateProduct(indiehackers, "indiehackers")),
    limit(() => translateAndUpdateProduct(taaft, "taaft"))
  ];

  try {
    await Promise.all(tasks);
    console.log("Translation process completed!");
  } catch (error) {
    console.error("An error occurred during the translation process:", error);
  }
}

if (require.main === module) {
  translateAllProducts().catch(console.error);
}
