import { TranslationContent } from "@/db/schema/types";
import { localeNames, SupportedLangs } from "@/i18n/types";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { defaultSafetySettings } from "./gemini/config";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface TranslationOptions {
  json: Record<string, string>;
  targetLanguages: SupportedLangs[];
}

async function translateByGemini({ json: text, targetLanguages }: TranslationOptions): Promise<Record<SupportedLangs, TranslationContent>> {
  const textKeys = Object.keys(text);
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" , generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: Object.fromEntries(
        targetLanguages.map(lang => [
          lang,
          {
            type: SchemaType.OBJECT,
            properties: Object.fromEntries(
              textKeys.map(key => [key, { type: SchemaType.STRING }])
            ),
            required: textKeys
          }
        ])
      ),
      required: targetLanguages,
    }
  }, 
  safetySettings: defaultSafetySettings
});

  const languageList = targetLanguages.map(lang => `${localeNames[lang]}(${lang})`).join(', ');
  const prompt = `Translate the following JSON text into these languages: ${languageList}

  Instructions:
  - Ensure the translation is natural and fluent.
  - If a value is empty, return an empty string.

  Before returning the result, please double-check:
  1. All translations are complete and accurate.
  2. Empty values remain empty.

  Here is the JSON text to translate:
  
  ${JSON.stringify(text, null, 2)}
  
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

export { translateByGemini };
