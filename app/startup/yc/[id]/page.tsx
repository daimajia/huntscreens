import ProductDetailPage from "@/app/components/product.detail";
import { cookies } from "next/headers";
import type { Metadata, ResolvingMetadata } from 'next';
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { producthunt } from "@/db/schema/ph";
import { notFound } from "next/navigation";
import Header from "@/app/components/header";
import query_yc from "@/lib/api/query.yc";
import { StartupSortBy } from "@/app/(cats)/startup/yc/components/startup.list";

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
    title: `${product?.name} - ${product?.tagline}`,
    description: product?.description,
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
  const data = await query_yc(params.id, sort as StartupSortBy);
  if (!data.product) {
    return notFound();
  }
  return <>
    <Header />
    {data && data.product && <ProductDetailPage productType="yc" product={data.product} next={data.next} prev={data.prev} />}
  </>
}