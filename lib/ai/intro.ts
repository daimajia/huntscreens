import { generateText } from 'ai';
import { openai } from "@ai-sdk/openai";
import { url2text } from "../utils/url";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { defaultSafetySettings } from "./gemini/config";
import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function generate(prompt: string) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
  });
  return text;
}

async function getIntroFromScreenshot(imageUri: string, product_name: string, website: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          markdown: { type: SchemaType.STRING }
        },
        required: ["markdown"]
      }
    },
    safetySettings: defaultSafetySettings
  });

  let websiteMarkdown = "";
  try {
    websiteMarkdown = await fetch(`https://r.jina.ai/${website}`).then(r => r.text());
  } catch (e) {
    console.error(`Error fetching website markdown for ${website}: ${e}`);
  }

  const prompt = `
This is a screenshot of a product's website. This product named: ${product_name}. Based on this screenshot, generate an SEO-friendly website introduction. It may include the following topics: Introduction, Key features, Use cases.  Provide information or execute requested tasks directly. Provide your response in standard Markdown format, no links, social network links or copyright information.

${websiteMarkdown.length > 0 ? `Website Raw :
${websiteMarkdown}` : ""}

Sample output:

## [product name]

### [Short description]

### Key Features
- [one]
- [two]
- [three]
- [...]

### Use Cases
- [one]
- [two]
- [three]
- [...]


### Benefits
- [one]
- [two]
- [three]
- [...]

### How It Works
[Brief explanation of how the product works]

### Target Audience
[Description of who the product is designed for]

### FAQ
Q: [Common question 1]
A: [Answer 1]

Q: [Common question 2]
A: [Answer 2]

Q: [Common question 3]
A: [Answer 3]
`;

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

    // Log token usage
    console.log('Token usage:', {
      promptTokenCount: result.response?.usageMetadata?.promptTokenCount,
      totalTokenCount: result.response?.usageMetadata?.totalTokenCount,
    });

    const { markdown } = JSON.parse(response.text());
    return markdown;
  } catch (error) {
    console.error('Intro generation error:', error);
    throw error;
  }
}

async function getURLAiIntro(url: string) {
  const prompt = `This is a text part of a product's website. Based on this text description, generate an SEO-friendly website introduction. It may include the following topics:  Introduction, Key features, Use cases, Pricing, Teams. When answering, omit all polite phrases and pleasantries. Provide information or execute requested tasks directly. Provide your response in standard Markdown format, no links, social network links or copyright information.
  
  Sample output:

  # [product name] [tagline]

  ## [introduction one linear]

  ## Key Features
  - [one]
  - [two]
  - [three]
  - [...]

  ## Use Cases
  - [one]
  - [two]
  - [three]
  - [...]

  # Pricing
  [pricing descriptions]

  # Teams
  [about product teams]
  `;
  const rawText = await url2text(url);
  const aiintro = await generate(`${prompt} """ ${rawText} """`);
  return {
    prompt: `${prompt} """ ${rawText} """`,
    aiintro: aiintro
  }
}

export { getIntroFromScreenshot, getURLAiIntro };