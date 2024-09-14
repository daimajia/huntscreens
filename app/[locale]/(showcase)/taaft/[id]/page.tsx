import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/product/product.detail";
import { generateUniversalMetadata } from '@/lib/seo/metadata';
import { SupportedLangs } from '@/i18n/types';
import queryShowcaseById from "@/lib/api/query.showcase";

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
  return generateUniversalMetadata(Number(params.id), "taaft", params.locale);
}


export default async function TaaftPage({ params }: Props) {
  const product = await queryShowcaseById(params.id, "taaft");

  if(!product){
    return notFound();
  }

  return <>
    <ProductDetailPage productType="taaft" product={product} />
  </>
}