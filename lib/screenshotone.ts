import assert from "assert";
import * as screenshotone from "screenshotone-api-sdk";


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

