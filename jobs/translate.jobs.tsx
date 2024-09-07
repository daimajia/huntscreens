import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";
import { db } from "@/db/db";
import { intro } from "@/db/schema";
import { eq } from "drizzle-orm";
import { translateByGemini } from "@/lib/ai/gemini";
import { getProductTable, productTypes } from "@/types/product.types";
import { SupportedLangs, locales } from "@/i18n/routing";
import { TranslationContent } from "@/db/schema/types";

const translationConcurrencyLimit = client.defineConcurrencyLimit({
  id: `translation-limit`,
  limit: 5,
});

client.defineJob({
  id: "translate-new-entry",
  name: "Translate New Entry",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "translate.new.entry",
    schema: z.object({
      uuid: z.string(),
      productType: z.enum(productTypes),
    })
  }),
  concurrencyLimit: translationConcurrencyLimit,
  run: async (payload, io, ctx) => {
    const { uuid, productType } = payload;

    const table = getProductTable(productType);
    const item = await db.select().from(table).where(eq(table.uuid, uuid)).limit(1);

    if (!item || item.length === 0) {
      await io.logger.error(`Item not found for ${productType} with UUID ${uuid}`);
      return { success: false, error: "Item not found" };
    }

    const entry = item[0];

    const aiIntro = await db.query.intro.findFirst({
      where: eq(intro.uuid, entry.uuid as string)
    });

    const contentToTranslate: TranslationContent = {
      tagline: entry.tagline || "",
      description: entry.description || "",
      aiintro: aiIntro?.description || "",
    };

    const existingTranslations = entry.translations || {};
    const missingLanguages = locales.filter(lang => 
      lang !== 'en' && !existingTranslations[lang]
    ) as SupportedLangs[];

    if (missingLanguages.length === 0) {
      await io.logger.info(`All translations already exist for ${productType} item ${uuid}. Skipping.`);
      return { success: true, uuid, productType, skipped: true };
    }

    const newTranslations: Partial<Record<SupportedLangs, TranslationContent>> = {};

    const estimatedTokens = JSON.stringify(contentToTranslate).length / 4;
    const maxLanguagesPerBatch = Math.floor(8192 / (estimatedTokens * 1.5));

    try {
      for (let i = 0; i < missingLanguages.length; i += maxLanguagesPerBatch) {
        const languageBatch = missingLanguages.slice(i, i + maxLanguagesPerBatch);
        await io.logger.info(`Translating batch ${i / maxLanguagesPerBatch + 1} for ${productType} item ${uuid}`);
        
        const translatedContent = await translateByGemini({ json: contentToTranslate, targetLanguages: languageBatch });
        Object.assign(newTranslations, translatedContent);
      }

      const updatedTranslations = { ...existingTranslations, ...newTranslations };

      await db.update(table).set({
        translations: updatedTranslations
      }).where(eq(table.uuid, uuid));

      await io.logger.info(`Successfully translated ${productType} item ${uuid} to ${Object.keys(newTranslations).join(', ')}`);
      return { success: true, uuid, productType, translatedLanguages: Object.keys(newTranslations) };
    } catch (error) {
      await io.logger.error(`Error translating ${productType} item ${uuid}: ${error}`);
      return { success: false, error: String(error) };
    }
  }
});