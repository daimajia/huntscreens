import ProductDetailPage from "@/app/components/product.detail";
import { db } from "@/db/db";
import { producthunt } from "@/db/schema/ph";
import { eq } from "drizzle-orm";
import { cache } from "react";

const queryProduct = cache(async (id: number) => {
  const product = await db.query.producthunt.findFirst({
    where: eq(producthunt.id, id)
  })
  return product;
});

export default async function ProductDetail({ params }: { params: { id: number } }) {
  const product = await queryProduct(params.id);
  return <>
    {product && <ProductDetailPage product={product} />}
    {!product && <>Not exist</>}
  </>
}