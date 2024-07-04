import { db } from '@/db/db'
import { producthunt } from '@/db/schema/ph'
import { desc, eq } from 'drizzle-orm'
import { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const phs = await db.query.producthunt.findMany({
    where: eq(producthunt.webp, true),
    orderBy: [desc(producthunt.added_at)]
  });
  return [
    {
      url: "https://huntscreens.com",
      lastModified: new Date()
    },
    ...phs.map((ph) => ({
      url: `https://huntscreens.com/p/${ph.id}`,
      lastModified: ph.added_at?.toISOString(),
    }))
  ]
}