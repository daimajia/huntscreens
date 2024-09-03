import { ProductDetailData, SortBy } from "@/types/api.types";
import { db } from "@/db/db";
import { phViewQueryByTopic, producthunt, Producthunt, sortedphbytime, sortedphbyvote } from "@/db/schema/ph";
import { eq, inArray } from "drizzle-orm";
import { QueryBuilder } from "drizzle-orm/pg-core";

export default async function queryProduct(id: number, sort: SortBy, topic: string): Promise<ProductDetailData<Producthunt>> {
  let query;

  if(topic !== "All") {
    const subQuery = phViewQueryByTopic(new QueryBuilder(), sort, topic).as('sortedphbytopic');
    query = db.select().from(subQuery).where(eq(subQuery.id, id));
  }else{
    const view = sort === "time" ? sortedphbytime : sortedphbyvote;
    query = db.select().from(view).where(eq(view.id, id));
  }

  const product = await query;
  
  if(product.length === 0){
    return {
      product: null,
      prev: null,
      next: null
    }
  }

  const currentSortItem = product[0];
  const currentId = currentSortItem.id;
  const prevId = currentSortItem.prev;
  const nextId = currentSortItem.next;

  const results = await db.select().from(producthunt).where(inArray(producthunt.id, [currentId, prevId, nextId]));
  let indexedData: {[id:number] : Producthunt} = {};
  results.forEach((p) => indexedData[p.id] = p)
  
  return {
    product: indexedData[id] || null,
    prev: indexedData[prevId] || null,
    next: indexedData[nextId] || null
  }
}