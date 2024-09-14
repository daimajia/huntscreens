import { db } from "@/db/db";
import { getProductTable, ProductModel, ProductTypes } from "@/types/product.types";
import { eq } from "drizzle-orm";

export default async function queryShowcaseById<T extends ProductTypes>(id: string, type: T): Promise<ProductModel<T> | null> {
  if(!Number.isInteger(Number(id))){
    return null;
  }
  const table = getProductTable(type);
  const product = await db.select().from(table).where(eq(table.id, Number(id)));
  if(product.length === 0){
    return null;
  }
  return product[0] as ProductModel<T>;
}
