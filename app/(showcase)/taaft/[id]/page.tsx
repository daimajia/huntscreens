import type { Metadata, ResolvingMetadata } from 'next';
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { taaft } from "@/db/schema";
import ProductDetailPage from "@/components/product/product.detail";
import Header from "@/components/layout/header";

type Props = {
  params: { id: number }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await db.query.taaft.findFirst({
    where: eq(taaft.id, params.id)
  });
  return {
    metadataBase: new URL("https://huntscreens.com"),
    title: `${product?.name} | HuntScreens`,
    description: `${product?.name}: ${product?.description} - ${product?.tagline} - HuntScreens`,
    publisher: "huntscreens.com",
    openGraph: {
      title: `${product?.name}`,
      description: `${product?.tagline} - ${product?.description}`,
      publishedTime: `${product?.added_at}`,
      images: `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product?.uuid}.webp`
    },
    twitter: {
      title: `${product?.name} - from huntscreens.com`,
      description: `${product?.tagline}`,
      images: {
        url: `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product?.uuid}.webp`,
        alt: `${product?.name} screenshot`
      }
    }
  }
}


export default async function TaaftPage({ params }: Props) {
  const data = await db.query.taaft.findFirst({
    where: eq(taaft.id, params.id)
  });
  if (!data) {
    return notFound();
  }
  return <>
    <Header />
    {data && <ProductDetailPage productType="taaft" product={data} next={null} prev={null} />}
  </>
}