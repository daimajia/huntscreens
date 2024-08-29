import { db } from "@/db/db";
import { producthunt, yc, indiehackers, taaft } from "@/db/schema";
import { SearchResult } from "@/app/search/[query]/_types/search.type";
import { sql } from "drizzle-orm";

export async function search(query: string): Promise<SearchResult[]> {
  const sanitizedQuery = sanitizeQuery(query);
  
  const searchResults: SearchResult[] = await db.execute(sql`
    SELECT id, name, tagline, description, website, thumb_url, uuid, 'ph' as "itemType",
           GREATEST(similarity(name, ${sanitizedQuery}), similarity(tagline, ${sanitizedQuery})) AS similarity
    FROM ${producthunt}
    WHERE (name % ${sanitizedQuery} OR tagline % ${sanitizedQuery} OR description % ${sanitizedQuery})
      AND webp = true
    UNION ALL
    SELECT id, name, tagline, description, website, thumb_url, uuid, 'yc' as "itemType",
           GREATEST(similarity(name, ${sanitizedQuery}), similarity(tagline, ${sanitizedQuery})) AS similarity
    FROM ${yc}
    WHERE (name % ${sanitizedQuery} OR tagline % ${sanitizedQuery} OR description % ${sanitizedQuery})
      AND webp = true
    UNION ALL
    SELECT id, name, tagline, description, website, thumb_url, uuid, 'indiehackers' as "itemType",
           GREATEST(similarity(name, ${sanitizedQuery}), similarity(tagline, ${sanitizedQuery})) AS similarity
    FROM ${indiehackers}
    WHERE (name % ${sanitizedQuery} OR tagline % ${sanitizedQuery} OR description % ${sanitizedQuery})
      AND webp = true
    UNION ALL
    SELECT id, name, tagline, description, website, thumb_url, uuid, 'taaft' as "itemType",
           GREATEST(similarity(name, ${sanitizedQuery}), similarity(tagline, ${sanitizedQuery})) AS similarity
    FROM ${taaft}
    WHERE (name % ${sanitizedQuery} OR tagline % ${sanitizedQuery} OR description % ${sanitizedQuery})
      AND webp = true
    ORDER BY similarity DESC
    LIMIT 50
  `);
  return searchResults;
}

function sanitizeQuery(query: string): string {
  return query.replace(/[^\w\s]/gi, '').replace(/\b(SELECT|FROM|WHERE|UNION|ORDER|BY|LIMIT)\b/gi, '');
}