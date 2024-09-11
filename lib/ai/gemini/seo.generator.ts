import { localeNames, SupportedLangs } from "@/i18n/types";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { defaultSafetySettings } from "./config";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface SEOContent {
  title: string;
  description: string;
  keywords: string[];
}

async function generateSEOContent(name: string, tagline: string, description: string, locale: SupportedLangs): Promise<SEOContent> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        description: { type: SchemaType.STRING },
        keywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
      },
      required: ["title", "description", "keywords"]
    }
  },
  safetySettings: defaultSafetySettings
  });

  const prompt = `Generate SEO-friendly content based on the following product information:
  Name: ${name}
  Tagline: ${tagline}
  Description: ${description}

  Please provide:
  1. A concise and engaging title (max 60 characters)
  2. A compelling meta description (max 160 characters)
  3. A list of relevant keywords (max 20 keywords, total no more than 100 characters)
  4. Output the the Content in ${localeNames[locale]}(${locale}).

  Ensure the content is optimized for search engines while accurately representing the product.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return JSON.parse(response.text()) as SEOContent;
  } catch (error) {
    console.error('SEO content generation error:', error);
    throw error;
  }
}

async function generateSEOFromURL(url: string, locale: SupportedLangs): Promise<SEOContent> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        description: { type: SchemaType.STRING },
        keywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
      },
      required: ["title", "description", "keywords"]
    }
  },
  safetySettings: defaultSafetySettings
  });

  const prompt = `Analyze the content of the following URL: ${url}

  Based on the page content, generate SEO-friendly elements:
  1. A concise and engaging title (max 60 characters)
  2. A compelling meta description (max 160 characters)
  3. A list of relevant keywords (max 20 keywords, total no more than 100 characters)

  If the page contains AI-related content, include some practical AI keywords.
  Output the content in ${localeNames[locale]}(${locale}).

  Ensure the generated content accurately represents the page while being optimized for search engines.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return JSON.parse(response.text()) as SEOContent;
  } catch (error) {
    console.error('SEO content generation error:', error);
    throw error;
  }
}

export { generateSEOContent, generateSEOFromURL };
