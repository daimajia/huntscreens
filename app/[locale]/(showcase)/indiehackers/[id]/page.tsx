import { cookies } from "next/headers";
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from "next/navigation";
import { IHSort } from "@/types/indiehackers.types";
import query_indiehacker from "@/lib/api/query.indiehacker";
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
  if (!Number.isInteger(Number(params.id))) {
    return notFound();
  }
  return generateUniversalMetadata(Number(params.id), "indiehackers", params.locale);
}

export default async function IndiehackersPage({ params }: Props) {
  if (!Number.isInteger(Number(params.id))) {
    return notFound();
  }
  const sort = cookies().get('ih.sort')?.value || 'time';
  const data = await query_indiehacker(Number(params.id), sort as IHSort);
  if (!data.product) {
    return notFound();
  }
  return <>
    {data && data.product && <ProductDetailPage productType="indiehackers" product={data.product} next={data.next} prev={data.prev} />}
  </>
}