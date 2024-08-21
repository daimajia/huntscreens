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

export async function getPuppeteerRenderSource(url: string) {
  const resp = await fetch(`${process.env.PUPPETEER}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url
    }),
  });
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