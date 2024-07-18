import { db } from "@/db/db";
import { sortedyc, yc, YC } from "@/db/schema";
import { YCSortBy } from "@/types/yc.types";
import { sql, eq, inArray } from "drizzle-orm";

export default async function query_yc(id: number, sort: YCSortBy) {
  let setupLagLead = db.select({
    row_no: sortedyc.row_no,
    id: sortedyc.id,
    prev: sql`lag(row_no, 1) over (order by row_no)`.mapWith(Number).as('prev'),
    next: sql`lead(row_no, 1) over (order by row_no)`.mapWith(Number).as('next'),
  }).from(sortedyc)

  if(sort === 'teamsize') {
    setupLagLead = db.select({
      row_no: sortedyc.row_no,
      id: sortedyc.id,
      prev: sql`lag(row_no, 1) over (order by "team_size" desc)`.mapWith(Number).as('prev'),
      next: sql`lead(row_no, 1) over (order by "team_size" desc)`.mapWith(Number).as('next'),
    }).from(sortedyc);
  }

  const lagleadsub = db.$with("lagleadsub").as(
    setupLagLead
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

  const prevAndNext = await db.select().from(sortedyc).where(inArray(sortedyc.row_no, [prevRowNo, nextRowNo]));
  const prevAndNextIndexed:  {[id:number] : {id: number}} = {};
  prevAndNext.forEach((p) => prevAndNextIndexed[p.row_no] = p);
  const prevId = hasPrevData ? prevAndNextIndexed[prevRowNo].id : 0;
  const nextId = hasNextData ? prevAndNextIndexed[nextRowNo].id : 0;

  const datapack = await db.select().from(yc).where(inArray(yc.id, [prevId, id, nextId]))

  let indexedData: {[id:number] : YC} = {};
  datapack.forEach((p) => indexedData[p.id] = p)
  
  return {
    product: indexedData[id] || null,
    prev: indexedData[prevId] || null,
    next: indexedData[nextId] || null
  }
}