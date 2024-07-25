import { db } from "@/db/db";
import { indiehackers, producthunt, yc } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import RSS from "rss";

export async function GET() {
  const phs = await db.query.producthunt.findMany({
    where: eq(producthunt.webp, true),
    orderBy: [desc(producthunt.added_at)],
    limit: 50
  });
  const ycs = await db.query.yc.findMany({
    where: eq(yc.webp, true),
    orderBy: [desc(yc.launched_at)],
    limit: 50
  });
  const ids = await db.query.indiehackers.findMany({
    where: eq(yc.webp, true),
    orderBy: [desc(indiehackers.added_at)],
    limit: 20
  });
  const feed = new RSS({
    title: "HuntScreens",
    description: "VisuallyDiscover Latest Products and Startups",
    generator: "RSS for Node and Next.js",
    feed_url: "https://huntscreens.com/feed.xml",
    site_url: "https://huntscreens.com",
    webMaster: "daimajia@gmail.com (daimajia)",
    language: "en-US",
    pubDate: new Date().toUTCString(),
    ttl: 60
  })
  
  phs.map((item) => feed.item({
    title: item.name || "",
    description: item.description || "",
    url: `https://huntscreens.com/p/${item.id}`,
    categories: item.tags || [],
    date: item.added_at || new Date()
  }))
  ycs.map((yc) => feed.item({
    title: yc.name || "",
    description: yc.description || "",
    url: `https://huntscreens.com/startup/yc/${yc.id}`,
    categories: yc.tags || [],
    date: yc.launched_at || new Date()
  }));
  ids.map((ih) => feed.item({
    title: ih.name || "",
    description: ih.description || "",
    url: `https://huntscreens.com/indiehackers/${ih.id}`,
    categories: ih.tags || [],
    date: ih.added_at || new Date(),
    
  }))
  return new Response(feed.xml({indent: true}), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    }
  });
}