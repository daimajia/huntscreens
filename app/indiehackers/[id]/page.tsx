import ProductDetailPage from "@/app/components/product.detail";
import { cookies } from "next/headers";
import type { Metadata, ResolvingMetadata } from 'next';
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Header from "@/app/components/header";
import { indiehackers } from "@/db/schema";
import { IHSort } from "@/types/indiehackers.types";
import query_indiehacker from "@/lib/api/query.indiehacker";

type Props = {
  params: { id: number }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await db.query.indiehackers.findFirst({
    where: eq(indiehackers.id, params.id)
  });
  return {
    metadataBase: new URL("https://huntscreens.com"),
    title: `${product?.name} - ${product?.tagline}`,
    description: product?.description,
    publisher: "huntscreens.com",
    openGraph: {
      title: `${product?.name}`,
      description: `${product?.tagline} - ${product?.description}`,
      publishedTime: `${product?.added_at}`,
      images: `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product?.uuid}.webp`
    },
    keywords: product?.tags?.flatMap(item => item),
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


export default async function IndiehackersPage({ params }: Props) {
  const sort = cookies().get('ih.sort')?.value || 'time';
  const data = await query_indiehacker(params.id, sort as IHSort);
  if (!data.product) {
    return notFound();
  }
  return <>
    <Header />
    {data && data.product && <ProductDetailPage productType="indiehackers" product={data.product} next={data.next} prev={data.prev} />}
  </>
}