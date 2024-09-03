import { cookies } from "next/headers";
import type { Metadata, ResolvingMetadata } from 'next';
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { producthunt } from "@/db/schema/ph";
import { notFound } from "next/navigation";
import query_yc from "@/lib/api/query.yc";
import { YCSortBy } from "@/types/yc.types";
import ProductDetailPage from "@/app/components/product/product.detail";
import Header from "@/app/components/layout/header";

type Props = {
  params: { id: number }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await db.query.yc.findFirst({
    where: eq(producthunt.id, params.id)
  });
  return {
    metadataBase: new URL("https://huntscreens.com"),
    title: `${product?.name} | HuntScreens`,
    description: `${product?.name}: ${product?.description} - HuntScreens`,
    publisher: "huntscreens.com",
    openGraph: {
      title: `${product?.name}`,
      description: `${product?.tagline} - ${product?.description}`,
      publishedTime: `${product?.launched_at}`,
      images: `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product?.uuid}.webp`
    },
    keywords: product?.industries?.flatMap(item => item),
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


export default async function YCPage({ params }: Props) {
  const sort = cookies().get('yc.sort')?.value || 'time';
  const data = await query_yc(params.id, sort as YCSortBy, "All");
  if (!data.product) {
    return notFound();
  }
  return <>
    <Header />
    {data && data.product && <ProductDetailPage productType="yc" product={data.product} next={data.next} prev={data.prev} />}
  </>
}