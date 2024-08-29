import { db } from "@/db/db";
import { producthunt, yc, indiehackers, taaft } from "@/db/schema";
import { SearchResult } from "@/app/search/[query]/_types/search.type";
import { sql } from "drizzle-orm";

export async function search(query: string): Promise<SearchResult[]> {
  const searchResults: SearchResult[] = await db.execute(sql`
    SELECT id, name, tagline, description, website, thumb_url, uuid, 'ph' as "itemType",
           similarity(name, ${query}) AS similarity
    FROM ${producthunt}
    WHERE (name % ${query} OR tagline % ${query} OR description % ${query})
      AND webp = true
    UNION ALL
    SELECT id, name, tagline, description, website, thumb_url, uuid, 'yc' as "itemType",
           similarity(name, ${query}) AS similarity
    FROM ${yc}
    WHERE (name % ${query} OR tagline % ${query} OR description % ${query})
      AND webp = true
    UNION ALL
    SELECT id, name, tagline, description, website, thumb_url, uuid, 'indiehackers' as "itemType",
           similarity(name, ${query}) AS similarity
    FROM ${indiehackers}
    WHERE (name % ${query} OR tagline % ${query} OR description % ${query})
      AND webp = true
    UNION ALL
    SELECT id, name, tagline, description, website, thumb_url, uuid, 'taaft' as "itemType",
           similarity(name, ${query}) AS similarity
    FROM ${taaft}
    WHERE (name % ${query} OR tagline % ${query} OR description % ${query})
      AND webp = true
    ORDER BY similarity DESC
    LIMIT 30
  `);
  return searchResults;
}