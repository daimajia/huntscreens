import { db } from "@/db/db";
import { allProducts } from "@/db/schema";
import { sql } from "drizzle-orm";

export const getCategoryProducts = async (mainslug: string, page: number, pageSize: number, subSlug?: string) => {
  let query = sql`
      categories->'maincategory'->>'slug' = ${mainslug}
  `;
  if (subSlug) {
  query =  sql`
    categories->'maincategory'->>'slug' = ${mainslug} and categories->'subcategory'->>'slug' = ${subSlug}
    `
  }
  if(mainslug === 'just-launched') {
    query = sql`
    launch_date > now() - interval '1 week'
    `
  }
  const [products, countResult] = await Promise.all([
    db.select()
      .from(allProducts)
      .where(query)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ count: sql`count(*)` })
      .from(allProducts)
      .where(query)
  ]);
  const totalCount = Number(countResult[0].count);
  return {
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize)
  }
}