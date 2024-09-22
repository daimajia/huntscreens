import { db } from "@/db/db";
import { Product, products } from "@/db/schema";
import { ProductTypes } from "@/types/product.types";
import { and, eq } from "drizzle-orm";

export default async function queryShowcaseById<T extends ProductTypes>(id: string, type: T): Promise<Product | null> {
  if(!Number.isInteger(Number(id))){
    return null;
  }
  const product = await db.select().from(products).where(
    and(
      eq(products.id, Number(id)),
      eq(products.itemType, type)
    )
  );
  if(product.length === 0){
    return null;
  }
  return product[0];
}
