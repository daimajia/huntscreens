import ProductDetailPage from "@/app/components/product.detail";
import { cookies } from "next/headers";
import type { Metadata, ResolvingMetadata } from 'next';
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Header from "@/app/components/header";
import { taaft } from "@/db/schema";

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