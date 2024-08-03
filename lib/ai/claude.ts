import Anthropic from "@anthropic-ai/sdk";
import parse from "node-html-parser";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

async function message(text: string) {
  const msg = anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 4096,
    messages: [{ role: "user", content: text }],
  }).asResponse();
  
  const resp = await msg;
  const json = await resp.json();
  return {
    prompt : text,
    data: json,
    headers: resp.headers
  };
}

export async function getWebsiteDescription(url: string) {
  const prompt = `This is a text description of a product's website. Based on this text description, generate an SEO-friendly website introduction. It may include the following topics:  Introduction, Key features, Use cases, Pricing, Teams. When answering, omit all polite phrases and pleasantries. Provide information or execute requested tasks directly. Provide your response in standard Markdown format.`;
  const resp = await fetch(url);
  const source = await resp.text();
  const root = parse(source);
  root.querySelectorAll('script, style').forEach(el => el.remove());
  const body = root.querySelector("body");
  const text = body?.textContent;
  return await message(`${prompt} """ ${text} """`);
}