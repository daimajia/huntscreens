import { generateText } from 'ai';
import { openai } from "@ai-sdk/openai";
import { addUtmParams, url2text } from "../utils/url";

async function generate(prompt: string) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
  });
  return text;
}

export async function getURLAiIntro(url: string) {
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
  const rawText = await url2text(addUtmParams(url, {
    ref: "huntscreens.com"
  }));
  const aiintro = await generate(`${prompt} """ ${rawText} """`);
  return {
    prompt: `${prompt} """ ${rawText} """`,
    aiintro: aiintro
  }
}