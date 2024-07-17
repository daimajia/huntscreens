import { ProductDetailData, SortBy } from "@/app/types/api.types";
import { db } from "@/db/db";
import { Producthunt, producthunt, sortedphs } from "@/db/schema/ph";
import { arrayContains, eq, inArray, sql } from "drizzle-orm";

export default async function queryProduct(id: number, sort: SortBy, topic: string): Promise<ProductDetailData<Producthunt>> {
  let setupLagLead = db.select({
    row_no: sortedphs.row_no,
    id: sortedphs.id,
    prev: sql`lag(row_no, 1) over (order by date (added_at) desc, "votesCount" desc)`.mapWith(Number).as('prev'),
    next: sql`lead(row_no, 1) over (order by date (added_at) desc, "votesCount" desc)`.mapWith(Number).as('next'),
  }).from(sortedphs)

  if(sort === 'vote') {
    setupLagLead = db.select({
      row_no: sortedphs.row_no,
      id: sortedphs.id,
      votesCount: sortedphs.votesCount,
      prev: sql`lag(row_no, 1) over (order by "votesCount" desc)`.mapWith(Number).as('prev'),
      next: sql`lead(row_no, 1) over (order by "votesCount" desc)`.mapWith(Number).as('next'),
    }).from(sortedphs);
  }

  const lagleadsub = db.$with("lagleadsub").as(
    topic === "All" ? setupLagLead : setupLagLead.where(arrayContains(sortedphs.tags, [topic]))
  )

  const result = await db.with(lagleadsub).select().from(lagleadsub).where(eq(lagleadsub.id, id));

  if(result.length === 0){
    return {
      product: null,
      next: null,
      prev: null
    }
  }
  
  const prevRowNo = result[0].prev || 0;
  const nextRowNo = result[0].next || 0;

  const hasPrevData = prevRowNo !== 0;
  const hasNextData = nextRowNo !== 0;

  const prevAndNext = await db.select().from(sortedphs).where(inArray(sortedphs.row_no, [prevRowNo, nextRowNo]));
  const prevAndNextIndexed:  {[id:number] : {id: number}} = {};
  prevAndNext.forEach((p) => prevAndNextIndexed[p.row_no] = p);
  const prevId = hasPrevData ? prevAndNextIndexed[prevRowNo].id : 0;
  const nextId = hasNextData ? prevAndNextIndexed[nextRowNo].id : 0;

  const datapack = await db.select().from(producthunt).where(inArray(producthunt.id, [prevId, id, nextId]))

  let indexedData: {[id:number] : Producthunt} = {};
  datapack.forEach((p) => indexedData[p.id] = p)
  
  return {
    product: indexedData[id] || null,
    prev: indexedData[prevId] || null,
    next: indexedData[nextId] || null
  }
}