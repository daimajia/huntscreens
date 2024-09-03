import queryProduct from "@/lib/api/query.product";
import { cookies } from "next/headers";
import type { Metadata, ResolvingMetadata } from 'next';
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { producthunt } from "@/db/schema/ph";
import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/product/product.detail";
import Header from "@/components/layout/header";

type Props = {
  params: { id: number }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await db.query.producthunt.findFirst({
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
      publishedTime: `${product?.featuredAt}`,
      images: `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product?.uuid}.webp`
    },
    keywords: product?.topics?.nodes.flatMap(item => item.name),
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


export default async function ProductDetail({ params }: Props) {
  const sort = cookies().get('sort')?.value || 'time';
  const topic = cookies().get('topic')?.value || 'All';
  const data = await queryProduct(params.id, sort === "time" ? "time" : "vote", topic);
  if (!data.product) {
    return notFound();
  }
  return <>
    <Header />
    {data && data.product && <ProductDetailPage productType="ph" product={data.product} next={data.next} prev={data.prev} />}
  </>
}