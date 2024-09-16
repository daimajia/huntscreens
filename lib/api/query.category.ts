import { db } from "@/db/db";
import { allProducts } from "@/db/schema";
import { SupportedLangs } from "@/i18n/types";
import { sql } from "drizzle-orm";
import { cache } from "react";
import { IndexDataPack } from "./query.types";
import { JustLaunchedProduct } from "@/types/product.types";

interface SubCategory {
  slug: string;
  translations: Record<SupportedLangs, string>[];
}

export const revalidate = 3600;

export const getSubCategories = cache(async (maincategorySlug: string): Promise<SubCategory[]> => {
  const result = await db.execute(sql<{
    slug: string;
    translations: Record<SupportedLangs, string>[];
  }>`
    SELECT
      cats->'subcategory'->>'slug' as slug,
      JSON_AGG(cats->'subcategory'->'translations') as translations
    FROM (
      SELECT categories as cats
      FROM just_launched_products
      WHERE categories -> 'maincategory' ->> 'slug' = ${maincategorySlug}
    ) as subquery
    GROUP BY cats->'subcategory'->>'slug'
  `);
  const ret = result.map(row => {
    return {
      slug: row.slug as string,
      translations: row.translations as Record<SupportedLangs, string>[]
    }
  });
  return ret;
})

export const getTopicProducts = async (topic: string, page: number, pageSize: number) => {
  let t = decodeURIComponent(topic);
  const [products, countResult] = await Promise.all([
    db.select()
      .from(allProducts)
      .where(sql`categories->'topics' @> ${`[{"slug": "${topic}"}]`}`)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ count: sql`count(*)` })
      .from(allProducts)
      .where(sql`categories->'topics' @> ${`[{"slug": "${topic}"}]`}`)
  ]);
  const totalCount = Number(countResult[0].count);
  return {
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize)
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
      .from(allProducts)
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
    products: products as unknown as JustLaunchedProduct[],
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    mainslug,
    subSlug
  }
}