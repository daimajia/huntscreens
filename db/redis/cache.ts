import { generateSEOFromPath } from '@/lib/ai/gemini/seo.generator';
import { SupportedLangs } from '@/i18n/types';
import redis from '../redis';
import { PathSegment, SEOContent } from '@/db/schema/types';

const SEO_CACHE_VERSION = 'v1.0';

export function getCachedSEOFromPath(
  locale: SupportedLangs,
  mainCategory: string,
  isTopic?: boolean
): Promise<SEOContent>;
export function getCachedSEOFromPath(
  locale: SupportedLangs,
  mainCategory: string,
  subCategory: string
): Promise<SEOContent>;

export async function getCachedSEOFromPath(
  locale: SupportedLangs,
  mainCategory: string,
  subCategoryOrIsTopic?: string | boolean
): Promise<SEOContent> {
  let cacheKey = `seo:${SEO_CACHE_VERSION}:${locale}`;
  let pathSegments: PathSegment[] = [];
  const isTopic = typeof subCategoryOrIsTopic === 'boolean' ? subCategoryOrIsTopic : false;

  if (typeof subCategoryOrIsTopic === 'string') {
    cacheKey += `:${mainCategory}:${subCategoryOrIsTopic}`;
    pathSegments = [
      { slug_type: 'maincategory', slug: mainCategory },
      { slug_type: 'subcategory', slug: subCategoryOrIsTopic }
    ];
  } else {
    cacheKey += `:${isTopic ? 'topics:' : ''}${mainCategory}`;
    pathSegments = [{ slug_type: 'maincategory', slug: mainCategory }];
  }

  try {
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      return JSON.parse(cachedResult) as SEOContent;
    }

    const seoContent = await generateSEOFromPath(pathSegments, locale);

    const expirationTime = 90 * 24 * 60 * 60;
    await redis.setex(cacheKey, expirationTime, JSON.stringify(seoContent));

    return seoContent;
  } catch (error) {
    console.error('Error in getCachedSEOFromPath:', error);
    return getDefaultSEOContent(mainCategory);
  }
}

function getDefaultSEOContent(
  mainCategory: string,
): SEOContent {
  return {
    title: "Explore " + mainCategory,
    description: "Explore " + mainCategory + " on our website.",
    keywords: [mainCategory]
  }
}
