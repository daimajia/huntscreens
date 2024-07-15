import { db } from '@/db/db'
import { yc } from '@/db/schema';
import { producthunt } from '@/db/schema/ph'
import { desc, eq } from 'drizzle-orm'
import { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const phs = await db.query.producthunt.findMany({
    where: eq(producthunt.webp, true),
    orderBy: [desc(producthunt.added_at)],
    columns: {
      id: true,
      added_at: true
    }
  });
  const ycs = await db.query.yc.findMany({
    where: eq(yc.webp, true),
    orderBy: [desc(yc.launched_at)],
    columns: {
      id: true
    }
  });
  return [
    {
      url: "https://huntscreens.com",
      lastModified: new Date()
    },
    ...phs.map((ph) => ({
      url: `https://huntscreens.com/p/${ph.id}`,
      lastModified: ph.added_at?.toISOString() || new Date(),
    })),
    ...ycs.map((yc) => ({
      url: `https://huntscreens.com/startup/yc/${yc.id}`
    }))
  ]
}