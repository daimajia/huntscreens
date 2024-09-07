import { Metadata } from 'next';
import { db } from "@/db/db";
import { allProducts } from "@/db/schema/all";
import { eq, and } from "drizzle-orm";
import { getProductTable, ProductTypes, urlMapper } from "@/types/product.types";
import { locales, SupportedLangs } from "@/i18n/types";
import { SEOContent } from '@/db/schema/types';
import { generateSEOContent } from '../ai/gemini/seo.generator';
import redis from '@/db/redis';

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
  const seoContent = await getAISEOContent(product.id!, productType, locale);
  return {
    metadataBase: new URL("https://huntscreens.com"),
    title: `${seoContent.title}`,
    description: `${seoContent.description}`,
    keywords: seoContent.keywords,
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

export async function getAISEOContent(id: number, productType: ProductTypes, locale: SupportedLangs): Promise<SEOContent> {
  const table = getProductTable(productType);
  const product = await db.select().from(table).where(
    eq(table.id, id)
  ).limit(1).then(rows => rows[0]);

  if (!product) {
    throw new Error(`Product not found: ${productType} with id ${id}`);
  }

  if (product.seo && product.seo[locale]) {
    return product.seo[locale] as SEOContent;
  }

  const redisKey = `seo:generate:${productType}:${id}:${locale}`;
  const generateCount = await redis.get(redisKey);

  const translations = product.translations?.[locale];
  const description = translations?.description || product.description;
  const tagline = translations?.tagline || product.tagline;

  const defaultSEOContent: SEOContent = {
    title: `${product.name}: ${tagline} | HuntScreens`,
    description: `${description} - HuntScreens`,
    keywords: []
  };

  if (generateCount && parseInt(generateCount) >= 3) {
    console.warn(`Max SEO generation attempts reached for ${productType} with id ${id} in ${locale}. Using default SEO content.`);
    const failedGenerationKey = `seo:failed_generation:${locale}`;
    await redis.sadd(failedGenerationKey, `${productType}:${id}`);
    return defaultSEOContent;
  }

  try {
    const seoContent = await generateSEOContent(product.name || '', tagline || '', description || '', locale);
    
    await db.update(table).set({
      seo: {
        ...product.seo,
        [locale]: seoContent
      }
    }).where(eq(table.id, id));

    return seoContent;
  } catch (error) {
    console.error(`Error generating SEO content: ${error}`);
    await redis.incr(redisKey);
    return defaultSEOContent;
  }
}