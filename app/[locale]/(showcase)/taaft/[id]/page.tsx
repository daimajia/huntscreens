import type { Metadata, ResolvingMetadata } from 'next';
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { taaft } from "@/db/schema";
import ProductDetailPage from "@/components/product/product.detail";
import { generateUniversalMetadata } from '@/lib/seo/metadata';
import { SupportedLangs } from '@/i18n/types';

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
  if (!Number.isInteger(Number(params.id))) {
    return notFound();
  }
  const data = await db.query.taaft.findFirst({
    where: eq(taaft.id, Number(params.id))
  });
  if (!data) {
    return notFound();
  }
  return <>
    {data && <ProductDetailPage productType="taaft" product={data} next={null} prev={null} />}
  </>
}