import { db } from "@/db/db";
import { Product, products } from "@/db/schema";
import { sql } from "drizzle-orm";
import { IndexDataPack } from "./query.types";
import { visibleProducts } from "@/db/schema/views/visible.products";
import { findSimilarProductsByText } from "../ai/embeding2";

export const revalidate = 3600;

export const getTopicProducts = async (topic: string, page: number, pageSize: number) => {
  const matches = await findSimilarProductsByText(topic.replace("-", " "), pageSize, page, 0.1);
  const products = matches.map((match) => match.payload as Product);
  
  const totalCount = Number(300);
  return {
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    topic
  }
}

interface CategoryQuery {
  mainslug: string;
  subSlug?: string;
}

export async function getCategoryItemCount(queries: CategoryQuery[]): Promise<Record<string, number>> {
  if (queries.length > 3) {
    throw new Error("Maximum of 3 queries allowed");
  }

  const queryPromises = queries.map(async ({ mainslug, subSlug }) => {
    let main = decodeURIComponent(mainslug);
    let query = sql`categories->'maincategory' @> ${`{"slug": "${main}"}`}`;

    if (subSlug) {
      let sub = decodeURIComponent(subSlug);
      query = sql`categories->'maincategory' @> ${`{"slug": "${main}"}`} and categories->'subcategory' @> ${`{"slug": "${sub}"}`}`;
    }

    const countResult = await db.select({ count: sql`count(*)` })
      .from(products)
      .where(query);

    const key = subSlug ? `${mainslug}/${subSlug}` : mainslug;
    return { key, count: Number(countResult[0].count) };
  });

  const results = await Promise.all(queryPromises);

  return results.reduce((acc, { key, count }) => {
    acc[key] = count;
    return acc;
  }, {} as Record<string, number>);
}

export async function getCategoryProducts(mainslug: string, page: number, pageSize: number, subSlug?: string): Promise<IndexDataPack> {
  let main = decodeURIComponent(mainslug);
  let query = sql`
      categories->'maincategory' @> ${`{"slug": "${main}"}`}
  `;
  if (subSlug) {
  let sub = decodeURIComponent(subSlug);
  query =  sql`
    categories->'maincategory' @> ${`{"slug": "${main}"}`} and categories->'subcategory' @> ${`{"slug": "${sub}"}`}
    `
  }
  if(mainslug === 'just-launched') {
    query = sql`
    launched_at > now() - interval '1 week'
    `
  }
  const [allProducts, countResult] = await Promise.all([
    db.select()
      .from(visibleProducts)
      .where(query)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ count: sql`count(*)` })
      .from(visibleProducts)
      .where(query)
  ]);
  const totalCount = Number(countResult[0].count);
  return {
    products: allProducts,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    mainslug,
    subSlug
  }
}