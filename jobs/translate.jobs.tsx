import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";
import { db } from "@/db/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { translateByGemini } from "@/lib/ai/gemini";
import { SupportedLangs, locales } from "@/i18n/types";
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
      uuid: z.string()
    })
  }),
  concurrencyLimit: translationConcurrencyLimit,
  run: async (payload, io, ctx) => {
    const { uuid } = payload;

    const item = await db.select().from(products).where(eq(products.uuid, uuid)).limit(1);

    if (!item || item.length === 0) {
      return { success: false, error: "Item not found" };
    }

    const entry = item[0];

    const contentToTranslate: TranslationContent = {
      tagline: entry.tagline || "",
      description: entry.description || "",
    };

    const existingTranslations = entry.translations || {};
    const missingLanguages = locales.filter(lang => 
      lang !== 'en' && !existingTranslations[lang]
    ) as SupportedLangs[];

    if (missingLanguages.length === 0) {
      return { success: true, uuid, skipped: true, reason: "All translations already exist" };
    }

    const newTranslations: Partial<Record<SupportedLangs, TranslationContent>> = {};

    const estimatedTokens = JSON.stringify(contentToTranslate).length / 4;
    const maxLanguagesPerBatch = Math.floor(8192 / (estimatedTokens * 1.5));

    try {
      for (let i = 0; i < missingLanguages.length; i += maxLanguagesPerBatch) {
        const languageBatch = missingLanguages.slice(i, i + maxLanguagesPerBatch);
        await io.logger.info(`Translating batch ${i / maxLanguagesPerBatch + 1} for item ${uuid}`);
        
        const translatedContent = await translateByGemini({ json: contentToTranslate, targetLanguages: languageBatch });
        Object.assign(newTranslations, translatedContent);
      }

      const updatedTranslations = { ...existingTranslations, ...newTranslations };

      await db.update(products).set({
        translations: updatedTranslations
      }).where(eq(products.uuid, uuid));
      return { success: true, uuid, translatedLanguages: Object.keys(newTranslations), reason: "Translated" };
    } catch (error) {
      return { success: false, error: String(error), reason: "Error translating" };
    }
  }
});