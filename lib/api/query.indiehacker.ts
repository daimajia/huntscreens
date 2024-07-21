import { db } from "@/db/db";
import { IndieHackers, indiehackers, sorted_indiehackers_by_addedat, sorted_indiehackers_by_revenue } from "@/db/schema";
import { IHSort } from "@/types/indiehackers.types";
import { eq, inArray } from "drizzle-orm";

export default async function query_indiehacker(id: number, ihsort: IHSort) {
  const view = ihsort === "time" ? sorted_indiehackers_by_addedat : sorted_indiehackers_by_revenue;
  const product = await db.select().from(view).where(eq(view.id, id));

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

  const results = await db.select().from(indiehackers).where(inArray(indiehackers.id, [currentId, prevId, nextId]));
  let indexedData: {[id:number] : IndieHackers} = {};
  results.forEach((p) => indexedData[p.id] = p)
  
  return {
    product: indexedData[id] || null,
    prev: indexedData[prevId] || null,
    next: indexedData[nextId] || null
  }
}