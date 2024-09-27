import { generateSEOFromPath } from '@/lib/ai/gemini/seo.generator';
import { SupportedLangs } from '@/i18n/types';
import { PathSegment, SEOContent } from '@/db/schema/types';
import { db } from '../../db/db';
import { eq, and } from 'drizzle-orm';
import { seo } from '../../db/schema/seo';

const SEO_CACHE_VERSION = 1;

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
  let slug;
  let pathSegments: PathSegment[] = [];
  const isTopic = typeof subCategoryOrIsTopic === 'boolean' ? subCategoryOrIsTopic : false;
  const type = isTopic ? 'topic' : 'category';
  
  if(isTopic) {
    slug = mainCategory;
    pathSegments = [{ slug_type: 'maincategory', slug: mainCategory }];
  } else {
    slug = `${mainCategory}/${subCategoryOrIsTopic as string}`;
    pathSegments = [
      { slug_type: 'maincategory', slug: mainCategory },
      { slug_type: 'subcategory', slug: subCategoryOrIsTopic as string }
    ];
  }

  try {

    const seoContent = await db.select().from(seo).where(and(
      eq(seo.slug, slug),
      eq(seo.language, locale),
      eq(seo.type, type)
    ));
    
    if(seoContent.length > 0) {
      console.log('SEO content found in cache');
      return {
        title: seoContent[0].title,
        description: seoContent[0].description,
        keywords: seoContent[0].keywords
      } as SEOContent;
    }


    const { title, description, keywords } = await generateSEOFromPath(pathSegments, locale);
    await db.insert(seo).values({
      title,
      description,
      keywords,
      slug,
      type,
      language: locale
    });

    return {
      title,
      description,
      keywords
    } as SEOContent;
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
