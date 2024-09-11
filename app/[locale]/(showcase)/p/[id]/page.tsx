import queryProduct from "@/lib/api/query.product";
import { cookies } from "next/headers";
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/product/product.detail";
import { SupportedLangs } from "@/i18n/types";
import { generateUniversalMetadata } from "@/lib/seo/metadata";

type Props = {
  params: { id: string, locale: SupportedLangs }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (isNaN(Number(params.id)) || !Number.isInteger(Number(params.id))) {
    return notFound();
  }
  return generateUniversalMetadata(Number(params.id), "ph", params.locale);
}


export default async function ProductDetail({ params }: Props) {
  if (isNaN(Number(params.id)) || !Number.isInteger(Number(params.id))) {
    return notFound();
  }
  const sort = cookies().get('sort')?.value || 'time';
  const topic = cookies().get('topic')?.value || 'All';
  const data = await queryProduct(Number(params.id), sort === "time" ? "time" : "vote", topic);
  if (!data.product) {
    return notFound();
  }
  return <>
    {data && data.product && <ProductDetailPage productType="ph" product={data.product} next={data.next} prev={data.prev} />}
  </>
}