import { ProductDetailData, SortBy } from "@/app/types/api.types";
import { db } from "@/db/db";
import { producthunt } from "@/db/schema/ph";
import { eq, lt, desc, gt, asc } from "drizzle-orm";

export default async function queryProduct(id: number, sort: SortBy): Promise<ProductDetailData> {
  const product = await db.query.producthunt.findFirst({
    where: eq(producthunt.id, id)
  })
  if(!product) return {
    product: null,
    prev: null,
    next: null
  };

  const nextProduct = await db.query.producthunt.findFirst({
    where: sort === "time" ? lt(producthunt.id, product.id) : lt(producthunt.votesCount, product.votesCount || 0),
    orderBy: [sort === "time" ? desc(producthunt.id) : desc(producthunt.votesCount)],
  });
  const prevProduct = await db.query.producthunt.findFirst({
    where: sort === 'time' ? gt(producthunt.id, product.id) : gt(producthunt.votesCount, product.votesCount || 0),
    orderBy: [sort === "time" ? asc(producthunt.id) : asc(producthunt.votesCount)],
  });
  return {
    product: product,
    next: nextProduct || null,
    prev: prevProduct || null
  }
}