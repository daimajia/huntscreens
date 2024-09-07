import { cookies } from "next/headers";
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from "next/navigation";
import query_yc from "@/lib/api/query.yc";
import { YCSortBy } from "@/types/yc.types";
import ProductDetailPage from "@/components/product/product.detail";
import { SupportedLangs } from "@/i18n/types";
import { generateUniversalMetadata } from "@/lib/seo/metadata";
type Props = {
  params: { id: number, locale: SupportedLangs }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return generateUniversalMetadata(params.id, "yc", params.locale);
}

export default async function YCPage({ params }: Props) {
  const sort = cookies().get('yc.sort')?.value || 'time';
  const data = await query_yc(params.id, sort as YCSortBy, "All");
  if (!data.product) {
    return notFound();
  }
  return <>
    {data && data.product && <ProductDetailPage productType="yc" product={data.product} next={data.next} prev={data.prev} />}
  </>
}