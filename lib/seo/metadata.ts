import { Metadata } from 'next';
import { db } from "@/db/db";
import { allProducts } from "@/db/schema/all";
import { eq, and } from "drizzle-orm";
import { ProductTypes, urlMapper } from "@/types/product.types";
import { locales, SupportedLangs } from "@/i18n/routing";

export async function generateUniversalMetadata(
  id: number,
  productType: ProductTypes,
  locale: SupportedLangs
): Promise<Metadata> {
  const product = await db.select().from(allProducts).where(
    and(
      eq(allProducts.id, id),
      eq(allProducts.item_type, productType)
    )
  ).limit(1).then(rows => rows[0]);

  if (!product) {
    return {};
  }

  const productUrl = urlMapper[productType](product.id!, locale);
  const translations = product.translations?.[locale];
  const description = translations?.description || product.description;
  const tagline = translations?.tagline || product.tagline;

  const alternateLanguages: Record<string, string> = {};
  locales.forEach(lang => {
    alternateLanguages[lang] = `${urlMapper[productType](product.id!, lang)}`;
  });

  const resizedImageUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/cdn-cgi/image/width=1200,height=630,fit=crop,gravity=0x0,format=webp/${product.uuid}.webp`;

  return {
    metadataBase: new URL("https://huntscreens.com"),
    title: `${product.name}: ${tagline} | HuntScreens`,
    description: `${description} - HuntScreens`,
    publisher: "huntscreens.com",
    authors: [{ name: 'HuntScreens' }],
    robots: 'index, follow',
    openGraph: {
      title: `${product.name}`,
      description: `${description}`,
      images: resizedImageUrl,
      url: `https://huntscreens.com${productUrl}`,
      type: 'website'
    },
    twitter: {
      title: `${product.name} - from huntscreens.com`,
      description: `${tagline}`,
      images: {
        url: resizedImageUrl,
        alt: `${product.name} screenshot`
      },
      card: 'summary_large_image',
      site: '@daimajia'
    },
    alternates: {
      canonical: `${productUrl}`,
      languages: alternateLanguages,
    },
    other: {
      'og:locale': locale,
    }
  };
}
