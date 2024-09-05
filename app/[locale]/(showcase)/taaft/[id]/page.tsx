import type { Metadata, ResolvingMetadata } from 'next';
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { taaft } from "@/db/schema";
import ProductDetailPage from "@/components/product/product.detail";
import { generateUniversalMetadata } from '@/lib/seo/metadata';
import { SupportedLangs } from '@/i18n/routing';

type Props = {
  params: { id: number, locale: SupportedLangs }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return generateUniversalMetadata(params.id, "taaft", params.locale);
}


export default async function TaaftPage({ params }: Props) {
  const data = await db.query.taaft.findFirst({
    where: eq(taaft.id, params.id)
  });
  if (!data) {
    return notFound();
  }
  return <>
    {data && <ProductDetailPage productType="taaft" product={data} next={null} prev={null} />}
  </>
}