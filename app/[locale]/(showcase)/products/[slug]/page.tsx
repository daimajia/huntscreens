import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/product/product.detail";
import { SupportedLangs } from "@/i18n/types";
import { queryShowcaseBySlug } from "@/lib/api/query.showcase";
import { ProductTypes } from "@/types/product.types";
import { generateShowcaseMetadataBySlug } from "@/lib/seo/metadata";
import { ResolvingMetadata, Metadata } from "next";

type Props = {
  params: { slug: string, locale: SupportedLangs }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await queryShowcaseBySlug(params.slug);
  if(!product){
    return notFound();
  }
  return generateShowcaseMetadataBySlug(params.slug, params.locale);
}

export default async function ProductPage({ params }: Props) {
  const product = await queryShowcaseBySlug(params.slug);

  if(!product){
    return notFound();
  }

  return <>
    <ProductDetailPage productType={product.itemType as ProductTypes} product={product} />
  </>
}