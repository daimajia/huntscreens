import parse from "node-html-parser";

type PuppeteerResp = {
  error: boolean,
  source: string | null
}

export function removeUrlParams(url: string, params: string[] | string): string {
  const urlObject = new URL(url);
  const paramsArray = Array.isArray(params) ? params : [params];
  paramsArray.forEach(param => {
    urlObject.searchParams.delete(param);
  });
  return urlObject.toString();
}

export function addUtmParams(url: string, params: { [key: string]: string }): string {
  const urlObj = new URL(url);
  
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.append(key, value);
  });

  return urlObj.toString();
}

export async function getPuppeteerRenderSource(url: string) {
  const resp = await fetch(`${process.env.PUPPETEER}?url=${url}`, {next: {revalidate: 3000}});
  const json = await resp.json() as PuppeteerResp;
  if(!json.error && json.source){
    return json.source;
  }else{
    throw new Error("Puppeteer got error");
  }
}

export async function url2text(url: string) {
  const source = await getPuppeteerRenderSource(url);
  const root = parse(source);
  root.querySelectorAll('script, style').forEach(el => el.remove());
  const text = root.textContent;
  if(text && text.length > 50) {
    return text;
  }else{
    throw new Error("soruce text length is less than 50")
  }
}