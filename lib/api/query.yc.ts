import { db } from "@/db/db";
import { sorted_yc_by_launchedat, sorted_yc_by_teamsize, YC, yc, ycViewQueryByStatus } from "@/db/schema";
import { YCSortBy, YCStatus } from "@/types/yc.types";
import { eq, inArray } from "drizzle-orm";
import { QueryBuilder } from "drizzle-orm/pg-core";

export default async function query_yc(id: number, sort: YCSortBy, status: YCStatus) {
  let query;
  if(status === "All") {
    const view = sort === "time" ? sorted_yc_by_launchedat : sorted_yc_by_teamsize;
    query = db.select().from(view).where(eq(view.id, id));
  }else{
    const subQuery = ycViewQueryByStatus(new QueryBuilder(), sort, status).as('sortedYc');
    query = db.select().from(subQuery).where(eq(subQuery.id, id));
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

  const results = await db.select().from(yc).where(inArray(yc.id, [currentId, prevId, nextId]));
  let indexedData: {[id:number] : YC} = {};
  results.forEach((p) => indexedData[p.id] = p)
  
  return {
    product: indexedData[id] || null,
    prev: indexedData[prevId] || null,
    next: indexedData[nextId] || null
  }
}