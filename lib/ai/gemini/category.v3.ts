import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { locales } from "@/i18n/types";
import { defaultSafetySettings } from "./config";
import { Category, AIProductInfoForCategorization } from "../types";
import mainCategories from "@/i18n/custom/categories.json";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

type CategoryV3Result = Category & {
  isAIProduct: boolean;
}

type PredefinedCategory = {
  maincategory: {
    [key: string]: string;
  };
  slug: string;
  emoji: string;
}

const predefined_categories = (mainCategories as PredefinedCategory[]).map(category => category.maincategory['en']);

async function categorizeProductV3(product: AIProductInfoForCategorization): Promise<CategoryV3Result> {
  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      maincategory: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          slug: { type: SchemaType.STRING },
          translations: {
            type: SchemaType.OBJECT,
            properties: {
              ...Object.fromEntries(locales.map(lang => [lang, { type: SchemaType.STRING }])),
            },
            required: [...locales]
          }
        },
        required: ["name", "slug", "translations"]
      },
      subcategory: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          slug: { type: SchemaType.STRING },
          translations: {
            type: SchemaType.OBJECT,
            properties: {
              ...Object.fromEntries(locales.map(lang => [lang, { type: SchemaType.STRING }])),
            },
            required: [...locales]
          }
        },
        required: ["name", "slug", "translations"]
      },
      topics: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING },
            slug: { type: SchemaType.STRING },
            translations: {
              type: SchemaType.OBJECT,
              properties: {
                ...Object.fromEntries(locales.map(lang => [lang, { type: SchemaType.STRING }])),
              },
              required: [...locales]
            }
          },
          required: ["name", "slug", "translations"]
        },
        minItems: 1,
        maxItems: 3
      },
      isAIProduct: { type: SchemaType.BOOLEAN }
    },
    required: ["maincategory", "subcategory", "topics", "isAIProduct"]
  };

  const prompt = `
    Analyze this product and provide the most relevant categories for a website product listing:

    Name: ${product.name}
    Tagline: ${product.tagline}
    Description: ${product.description}
    Link: ${product.link}
    Screenshot: ${product.screenshot}

    Guidelines:
    1. Provide a main category, a subcategory, and up to 3 topics for the product.
    2. The main category should be chosen from this list if possible: ${predefined_categories.join(', ')}.
    3. If none fit, create a new appropriate main category.
    4. The subcategory should be a more specific classification under the main category.
    5. Topics should be distinct, non-overlapping aspects or features of the product.
    6. Use concise, common, and SEO-friendly terms that users are likely to search for or click on.
    7. For each category and topic, provide:
       - The name in English
       - A slug (lowercase, hyphenated version of the English name)
       - Translations for all required languages: ${locales.join(', ')}
    8. Consider the user's perspective: what categories and topics would help them find this product?
    9. Determine if this is an AI product based on its description and features.
    10. Try to use AI terms, like Text to Video, Audio to Text, Image to Image Instead of Text-Based Video Editing, Text-Based Image Editing, etc.
    Return the categories, topics, and isAIProduct flag in valid JSON format as specified.
  `;

  const result = await genAI.getGenerativeModel({
    model: "gemini-1.5-flash", 
    generationConfig: {
      responseSchema: schema,
      responseMimeType: "application/json",
    }, 
    safetySettings: defaultSafetySettings
  }).generateContent(prompt);

  const response = result.response;
  
  const data = JSON.parse(response.text());

  if (data.maincategory && data.subcategory && data.topics && typeof data.isAIProduct === 'boolean') {
    return data as CategoryV3Result;
  } else {
    throw new Error("Failed to generate categories, topics, and AI product flag from AI response");
  }
}
/**
 * @deprecated the return is not reliable
 * @param url 
 * @returns 
 */
async function categorizeUrlV3(url: string): Promise<CategoryV3Result> {
  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      maincategory: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          slug: { type: SchemaType.STRING },
          translations: {
            type: SchemaType.OBJECT,
            properties: {
              ...Object.fromEntries(locales.map(lang => [lang, { type: SchemaType.STRING }])),
            },
            required: [...locales]
          }
        },
        required: ["name", "slug", "translations"]
      },
      subcategory: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          slug: { type: SchemaType.STRING },
          translations: {
            type: SchemaType.OBJECT,
            properties: {
              ...Object.fromEntries(locales.map(lang => [lang, { type: SchemaType.STRING }])),
            },
            required: [...locales]
          }
        },
        required: ["name", "slug", "translations"]
      },
      topics: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING },
            slug: { type: SchemaType.STRING },
            translations: {
              type: SchemaType.OBJECT,
              properties: {
                ...Object.fromEntries(locales.map(lang => [lang, { type: SchemaType.STRING }])),
              },
              required: [...locales]
            }
          },
          required: ["name", "slug", "translations"]
        },
        minItems: 1,
        maxItems: 3
      },
      isAIProduct: { type: SchemaType.BOOLEAN }
    },
    required: ["maincategory", "subcategory", "topics", "isAIProduct"]
  };

  const prompt = `
    Analyze the website at this URL and provide the most relevant categories for a website product listing:

    URL: ${url}

    Guidelines:
    1. Visit the provided URL and analyze the content of the website.
    2. Provide a main category, a subcategory, and up to 3 topics for the website or product it represents.
    3. The main category should be chosen from this list if possible: ${predefined_categories.join(', ')}.
    4. If none fit, create a new appropriate main category.
    5. The subcategory should be a more specific classification under the main category.
    6. Topics should be distinct, non-overlapping aspects or features of the website or product.
    7. Use concise, common, and SEO-friendly terms that users are likely to search for or click on.
    8. For each category and topic, provide:
       - The name in English
       - A slug (lowercase, hyphenated version of the English name)
       - Translations for all required languages: ${locales.join(', ')}
    9. Consider the user's perspective: what categories and topics would help them find this website or product?
    10. Determine if this is an AI-related website or product based on its content and features.
    11. Try to use AI terms, like Text to Video, Audio to Text, Image to Image Instead of Text-Based Video Editing, Text-Based Image Editing, etc., if applicable.
    Return the categories, topics, and isAIProduct flag in valid JSON format as specified.
  `;

  const result = await genAI.getGenerativeModel({
    model: "gemini-1.5-flash", 
    generationConfig: {
      responseSchema: schema,
      responseMimeType: "application/json",
    }, 
    safetySettings: defaultSafetySettings
  }).generateContent(prompt);

  const response = result.response;
  
  const data = JSON.parse(response.text());

  if (data.maincategory && data.subcategory && data.topics && typeof data.isAIProduct === 'boolean') {
    return data as CategoryV3Result;
  } else {
    throw new Error("Failed to generate categories, topics, and AI product flag from AI response");
  }
}

export { categorizeProductV3, categorizeUrlV3 };
