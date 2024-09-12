import { client } from "@/trigger";
import assert from "assert";
import * as screenshotone from "screenshotone-api-sdk";

export type ScreenshotResponse = {
  store: {
    location: string;
  }
}

export const screenshotConcurrencyLimit = client.defineConcurrencyLimit({
  id: `screenshotone-limit`,
  limit: 40,
});

export function getScreenshotOneParams(website: string, uuid: string, webhook_url: string) {
  let delay = 8;
  if(website.includes("apps.apple.com")) {
    delay = 20;
  }
  return {
    access_key: process.env.SCREENSHOTONE_ACCESS_KEY,
    url: website,
    store: "true",
    storage_path: uuid,
    response_type: "json",
    async: "true",
    webhook_url: webhook_url,
    storage_return_location: "true",
    full_page: "true",
    viewport_width: 1440,
    viewport_height: 900,
    device_scale_factor: 1,
    format: "webp",
    full_page_max_height: 10000,
    image_quality: 100,
    block_banners_by_heuristics: "true",
    delay: delay,
    block_ads: "true",
    block_chats: "true",
    block_cookie_banners: "true",
    cache: "true",
    cache_ttl: 2592000
  }
}

type ScreenshotUsage = {
  total:number,
  available:number,
  used:number,
  concurrency:{
    limit:number,
    remaining:number,
    reset:number
  }
}


export async function getUsage():Promise<ScreenshotUsage> {
  const res = await fetch('https://api.screenshotone.com/usage?access_key=' + process.env.SCREENSHOTONE_ACCESS_KEY);
  if(res.ok) {
    return res.json();
  }else{
    throw Error("error to fetch screenshotone usage api");
  }
}

export function takeScreenshot(url: string, s3_path? : string) {
  const access_key = process.env.SCREENSHOTONE_ACCESS_KEY;
  const secret_key = process.env.SCREENSHOTONE_SIGNED_KEY;
  assert(access_key && secret_key, "screenshot one key not set");

  const client = new screenshotone.Client(access_key, secret_key);
  const options = screenshotone.TakeOptions.url(url)
                  .fullPage(true)
                  .viewportWidth(1920)
                  .viewportHeight(1080)
                  .deviceScaleFactor(1)
                  .format("png")
                  .imageQuality(100)
                  .blockBannersByHeuristics(true)
                  .delay(3)
                  .blockAds(true)
                  .blockChats(true)
                  .blockCookieBanners(true)
                  .cache(true)
                  .cacheTtl(2592000);

  if(s3_path) {
    options.store(true);
    options.storagePath(s3_path);
  }
  const screenshotUrl =  client.generateSignedTakeURL(options);
  return screenshotUrl;
} 

