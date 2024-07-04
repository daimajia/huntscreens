import { ProductDetailData, SortBy } from "@/app/types/api.types";
import { db } from "@/db/db";
import { Producthunt, producthunt, sortedProducthunts } from "@/db/schema/ph";
import { eq, inArray } from "drizzle-orm";

export default async function queryProduct(id: number, sort: SortBy): Promise<ProductDetailData> {
  const item = await db.select()
  .from(sortedProducthunts)
  .where(eq(sortedProducthunts.id, id));

  const currentRowNo = item[0].row_no;

  const related = await db.select().from(sortedProducthunts).where(
    inArray(sortedProducthunts.row_no, [currentRowNo - 1, currentRowNo, currentRowNo + 1])
  );

  const hasPrev = currentRowNo > 1;
  const hasNext = (hasPrev && related.length === 2) ? false : true;
  const pids =  related.flatMap((item) => item.id);

  const products = await db.query.producthunt.findMany({
    where: inArray(producthunt.id, pids)
  });
  let indexed: {[id:number] : Producthunt} = {};
  products.forEach((p) => indexed[p.id] = p)
  
  return {
    product: hasPrev ? indexed[pids[1]] : indexed[pids[0]],
    next: hasNext ? (hasPrev ?  indexed[pids[2]] : indexed[pids[1]]) : null,
    prev: hasPrev ? indexed[pids[0]] : null
  }
}