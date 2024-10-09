import parse from "node-html-parser";

type PuppeteerResp = {
  error: boolean,
  source: string | null
}

export function unifyUrl(url: string): string {
  const marketingParams = [
    // UTM params
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    // common marketing and tracking params
    'ref', 'referrer', 'source', 'medium', 'campaign',
    'affiliate', 'affiliate_id', 'partner', 'partner_id',
    'fbclid', 'gclid', 'msclkid', // Facebook, Google, and Microsoft click IDs
    'mc_cid', 'mc_eid', // Mailchimp params
    'rb_clickid', // Rakuten params
    '_hsenc', '_hsmi', // HubSpot params
    'hsa_acc', 'hsa_cam', 'hsa_grp', 'hsa_ad', 'hsa_src', 'hsa_tgt', 'hsa_kw', 'hsa_mt', 'hsa_net', 'hsa_ver', // Google Ads params
    // add other marketing params
  ];
  
  return removeUrlParams(url, marketingParams);
}

export function removeUrlParams(url: string, params: string[] | string): string {
  const urlObject = new URL(url);
  const paramsArray = Array.isArray(params) ? params : [params];
  
  paramsArray.forEach(param => {
    urlObject.searchParams.delete(param);
  });
  
  urlObject.hash = '';
  
  if (urlObject.pathname === '/') {
    urlObject.pathname = '/';
  } else if (urlObject.pathname === '') {
    urlObject.pathname = '/';
  } else {
    urlObject.pathname = urlObject.pathname.replace(/\/+$/, '');
  }
  
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