import { Metadata } from 'next';
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { locales, SupportedLangs } from "@/i18n/types";
import { SEOContent } from '@/db/schema/types';
import { generateSEOContent } from '../ai/gemini/seo.generator';
import redis from '@/db/redis';
import { Product, products } from '@/db/schema';
import { queryShowcaseBySlug } from '../api/query.showcase';

export async function generateShowcaseMetadataBySlug(slug: string, locale: SupportedLangs): Promise<Metadata> {
  const product = await queryShowcaseBySlug(slug);
  if(!product){
    return {};
  }
  
  const productUrl = `https://huntscreens.com/${locale}/products/${slug}`;

  const alternateLanguages: Record<string, string> = {};
  locales.forEach(lang => {
    alternateLanguages[lang] = `https://huntscreens.com/${lang}/products/${slug}`;
  });

  const resizedImageUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/cdn-cgi/image/width=1200,height=630,fit=crop,gravity=0x0,format=webp/${product.uuid}.webp`;
  const seoContent = await getAISEOContent(product, locale);
  return {
    metadataBase: new URL("https://huntscreens.com"),
    title: seoContent.title || product.name,
    description: seoContent.description || product.description,
    keywords: seoContent.keywords,
    publisher: "huntscreens.com",
    authors: [{ name: 'HuntScreens' }],
    robots: 'index, follow',
    openGraph: {
      title: seoContent.title || product.name,
      description: seoContent.description || product.description || "",
      images: resizedImageUrl,
      url: productUrl,
      type: 'website'
    },
    twitter: {
      title: seoContent.title || product.name,
      description: seoContent.description || product.description || "",
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

export async function getAISEOContent(product: Product, locale: SupportedLangs): Promise<SEOContent> {

  if (!product) {
    throw new Error(`Product not found`);
  }

  if (product.seo && product.seo[locale]) {
    return product.seo[locale] as SEOContent;
  }

  const redisKey = `seo:generate_v2:${product.uuid}`;
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
    console.warn(`Max SEO generation attempts reached for ${product.itemType} with id ${product.id} in ${locale}. Using default SEO content.`);
    const failedGenerationKey = `seo:failed_generation_v2:${locale}`;
    await redis.sadd(failedGenerationKey, `${product.itemType}:${product.id}`);
    return defaultSEOContent;
  }

  try {
    const seoContent = await generateSEOContent(product.name || '', tagline || '', description || '', locale);
    
    await db.update(products).set({
      seo: {
        ...product.seo,
        [locale]: seoContent
      }
    }).where(
      eq(products.uuid, product.uuid)
    );

    return seoContent;
  } catch (error) {
    console.error(`Error generating SEO content: ${error}`);
    await redis.incr(redisKey);
    return defaultSEOContent;
  }
}