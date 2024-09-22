import { db } from "@/db/db";
import { visibleProducts } from "@/db/schema/views/visible.products";
import RSS from "rss";

export const revalidate = 600;

export async function GET() {
  const products = await db.select().from(visibleProducts).limit(20);
  
  const feed = new RSS({
    title: "HuntScreens",
    description: "VisuallyDiscover Latest Products and Startups",
    generator: "RSS for Node and Next.js",
    feed_url: "https://huntscreens.com/rss.xml",
    site_url: "https://huntscreens.com",
    webMaster: "daimajia@gmail.com (daimajia)",
    language: "en-US",
    pubDate: new Date().toUTCString(),
    ttl: 60
  })

  products.map((item) => feed.item({
    title: item.name || "",
    description: item.description || "",
    enclosure: {
      url: `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${item.uuid}.webp`,
      type: "image/webp"
    },
    url: `https://huntscreens.com/en/p/${item.id}`,
    date: item.added_at || new Date()
  }));
  
  return new Response(feed.xml({indent: true}), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    }
  });
}