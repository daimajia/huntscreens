import { db } from "@/db/db";
import { allProducts } from "@/db/schema";
import { sql } from "drizzle-orm";

export const getTopicProducts = async (topic: string, page: number, pageSize: number) => {
  let t = decodeURIComponent(topic);
  const [products, countResult] = await Promise.all([
    db.select()
      .from(allProducts)
      .where(sql`${t} = ANY(SELECT jsonb_array_elements(categories->'topics')->>'slug')`)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ count: sql`count(*)` })
      .from(allProducts)
      .where(sql`${t} = ANY(SELECT jsonb_array_elements(categories->'topics')->>'slug')`)
  ]);
  const totalCount = Number(countResult[0].count);
  return {
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize)
  }
}

export const getCategoryProducts = async (mainslug: string, page: number, pageSize: number, subSlug?: string) => {
  let main = decodeURIComponent(mainslug);
  let query = sql`
      categories->'maincategory'->>'slug' = ${main}
  `;
  if (subSlug) {
  let sub = decodeURIComponent(subSlug);
  query =  sql`
    categories->'maincategory'->>'slug' = ${main} and categories->'subcategory'->>'slug' = ${sub}
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