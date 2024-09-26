import { localeNames, locales, SupportedLangs } from "@/i18n/types";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { defaultSafetySettings } from "./config";
import { PathSegment, SEOContent } from "@/db/schema/types";
import { Product } from "@/db/schema";
import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function generateSEOContent(name: string, tagline: string, description: string, locale: SupportedLangs): Promise<SEOContent> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        description: { type: SchemaType.STRING },
        tagline: { type: SchemaType.STRING },
        keywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
      },
      required: ["title", "description", "keywords", "tagline"]
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
  2. A compelling meta description (max 160 characters, description text length is very important)
  3. A list of relevant keywords (max 20 keywords, total no more than 100 characters)
  4. Output the Content in ${localeNames[locale]}(${locale}).
  5. A concise and engaging tagline (max 20 words)
     The tagline should:
     - Be a direct, impactful statement without mentioning the product name
     - Highlight a key benefit or unique selling point
     - Be relevant to the product's main function or value proposition
     Example of a good tagline: "用 AI 提升团队协作效率" instead of "ProductName：用 AI 提升团队协作效率"

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

async function generateSEOFromPath(pathSegments: PathSegment[], locale: SupportedLangs): Promise<SEOContent> {
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

  const currentYear = new Date().getFullYear();
  const pathDescription = pathSegments.map(segment => `${segment.slug_type}: ${segment.slug}`).join(', ');

  const prompt = `You are generating SEO content for a cutting-edge website directory that showcases the latest AI products, practical tools, and innovative startups of ${currentYear}. The directory aims to help users discover state-of-the-art AI solutions and emerging technologies that are shaping the future.

  Generate compelling and SEO-friendly content based on the following URL path segments:
  ${pathDescription}

  Please provide:
  1. An engaging and descriptive title (max 60 characters)

  2. A captivating meta description (max 160 characters)
     Highlight the unique value proposition and include the year ${currentYear}

  3. A list of relevant keywords (max 10 keywords, total no more than 100 characters)
     Include a mix of specific and broader terms

  Consider the following guidelines:
  - Use powerful and action-oriented language to grab attention
  - Emphasize cutting-edge features and groundbreaking capabilities
  - Highlight tangible benefits for users or businesses
  - Ensure the content appeals to both tech enthusiasts and curious beginners
  - Avoid overly technical jargon while maintaining a professional tone
  - Include a mix of specific and broader terms to capture various search intents
  - Always include the year ${currentYear} in the title and, when relevant, in other elements

  Output the content in ${localeNames[locale]}(${locale}).

  Ensure the generated content is not only optimized for search engines but also irresistibly clickable, accurately representing the page's focus on cutting-edge AI products, tools, and startups of ${currentYear}.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return JSON.parse(response.text()) as SEOContent;
  } catch (error) {
    console.error('SEO content generation error:', error);
    throw error;
  }
}

export { generateSEOContent, generateSEOFromURL, generateSEOFromPath };
