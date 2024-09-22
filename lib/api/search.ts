import { db } from "@/db/db";
import { Product } from "@/db/schema";
import { visibleProducts } from "@/db/schema/views/visible.products";
import { sql } from "drizzle-orm";

export async function search(query: string, page: number = 1, pageSize: number = 30): Promise<{ results: Product[], totalCount: number }> {
  const sanitizedQuery = sanitizeQuery(query);
  const offset = (page - 1) * pageSize;

  const searchQuery = sql`(
    coalesce(${visibleProducts.name}, '') || ' ' || 
    coalesce(${visibleProducts.tagline}, '') || ' ' || 
    coalesce(${visibleProducts.description}, '') || ' ' || 
    coalesce(${visibleProducts.seo}::text, '') || ' ' || 
    coalesce(${visibleProducts.categories}::text, '')
  ) ILIKE ${`%${sanitizedQuery}%`}`;

  const results = await db.select()
    .from(visibleProducts)
    .where(searchQuery)
    .limit(pageSize)
    .offset(offset);

  const [{ count }] = await db.select({ count: sql<number>`count(*)` })
    .from(visibleProducts)
    .where(searchQuery);

  return {
    results,
    totalCount: Number(count)
  };
}

function sanitizeQuery(query: string): string {
  return query.replace(/[^\w\s]/gi, '').replace(/\b(SELECT|FROM|WHERE|UNION|ORDER|BY|LIMIT)\b/gi, '');
}