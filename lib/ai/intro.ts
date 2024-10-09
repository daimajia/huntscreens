import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { defaultSafetySettings } from "./gemini/config";
import fetch from 'node-fetch';
import { SupportedLangs, localeNames, locales } from "@/i18n/types";
import { Product } from "@/db/schema";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function getIntroFromProduct(product: Product): Promise<Record<SupportedLangs, string>> {
  const imageUri = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product.uuid}.webp`;
  return getIntroFromScreenshot(imageUri, product.name, product.website);
}

async function getIntroFromScreenshot(imageUri: string, product_name: string, website: string): Promise<Record<SupportedLangs, string>> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: Object.fromEntries(
          locales.map(locale => [
            locale,
            { type: SchemaType.STRING }
          ])
        ),
        required: locales.map(lang => lang)
      }
    },
    safetySettings: defaultSafetySettings
  });

  let websiteMarkdown = undefined;
  try {
    websiteMarkdown = await fetch(`https://r.jina.ai/${website}`).then(r => r.text());
  } catch (e) {
    console.error(`Error fetching website markdown for ${website}: ${e}`);
  }

  const languageList = locales.map(lang => `${localeNames[lang]}(${lang})`).join(', ');

  const prompt = `
Analyze the provided screenshot of ${product_name}'s website${websiteMarkdown ? " and the accompanying website content markdown" : ""}. Create a concise, SEO-optimized product introduction in the following languages: ${languageList}.

For each language, provide the following structure:

## ${product_name}

[2-3 sentences describing the product's main value proposition]

### Product Highlights
- **[Specific Feature]**: [Brief description of a key feature]
- **[Specific Feature]**: [Brief description of another key feature]
- **[Specific Feature]**: [Brief description of a third key feature]

### Use Cases
- **[Specific Use Case]**: [Brief explanation of a real-world application]
- **[Specific Use Case]**: [Brief explanation of another real-world application]
- **[Specific Use Case]**: [Brief explanation of a third real-world application]

### Target Audience
[1-2 sentences describing the main user segments]

Ensure each language version is culturally appropriate and follows SEO best practices. Keep the content factual and based on the provided information. Use specific, realistic features and use cases based on the product's actual capabilities.

Important: Make sure to place the colon (:) outside the bold (**) markdown syntax. For example:
**Fast Cleaning**: Clean your inbox in seconds, no matter how big it is.
**Personal Organization**: Declutter your inbox and save time managing your email.

${websiteMarkdown ? `Website Content Markdown:
${websiteMarkdown}` : ""}

Respond with a JSON object where each key is a language code and the value is the markdown content for that language. The markdown should not contain any links, social media handles, or other external links.`;

  try {
    const contents: any[] = [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ];

    if (imageUri) {
      const imageResponse = await fetch(imageUri);
      const imageBuffer = await imageResponse.buffer();
      contents[0].parts.push({
        inline_data: {
          mime_type: 'image/webp',
          data: imageBuffer.toString('base64')
        }
      });
    }

    const result = await model.generateContent({ contents });
    const response = result.response;

    return JSON.parse(response.text());
  } catch (error) {
    console.error('Intro generation error:', error);
    throw error;
  }
}

export { getIntroFromScreenshot, getIntroFromProduct };