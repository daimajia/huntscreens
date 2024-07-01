import ProductDetailPage from "@/app/components/product.detail";
import queryProduct from "@/lib/api/query.product";
import { cookies } from "next/headers";

export default async function ProductDetail({ params }: { params: { id: number } }) {
  const sort = cookies().get('sort')?.value || 'time';
  const data = await queryProduct(params.id, sort === "time" ? "time" : "vote");
  return <>
    {data && data.product && <ProductDetailPage product={data.product} next={data.next} prev={data.prev} />}
    {(!data || !data.product) && <>Not exist</>}
  </>
}