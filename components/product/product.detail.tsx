/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Product } from "@/db/schema";
import { ProductTypes } from "@/types/product.types";
import { BreadcrumbItem, SiteBreadcrumbGenerator } from "@/components/ui-custom/breadcrumb";
import AIIntro from "./ai.intro";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import SimilarProducts from "./similar.products";
import Logo from "@/components/logo";
import WeeklyTop from "./common/weekly.top";
import ImageLoader from "@/components/ui-custom/ImageLoader";
import { SupportedLangs } from "@/i18n/types";
import { getLocale, getTranslations } from "next-intl/server";
import { Tag } from "lucide-react";
import { TranslationContent } from "@/db/schema/types";
import AddFavoriteBtn from "./add.favorite.btn";
import { is_favorite } from "@/lib/api/favorites";

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/#{1,6}\s?/g, '') // Headers
    .replace(/`{3}[\s\S]*?`{3}/g, '') // Code blocks
    .replace(/`(.+?)`/g, '$1') // Inline code
    .replace(/(?:^|\n)>[^\n]*/g, '') // Blockquotes
    .replace(/(?:^|\n)[-*+]\s/g, '') // List items
    .replace(/\n+/g, ' ') // Replace multiple newlines with a single space
    .trim();
}

async function getBreadcrumbCategoryItems(
  product: Product,
  currentLang: SupportedLangs,
  t: (key: string) => string
): Promise<BreadcrumbItem[]> {
  let breadcrumbItems: BreadcrumbItem[] = [
    { name: t('Home'), href: "/" },
    { name: t('AllCategories'), href: "/category/just-launched" }
  ];

  try {
    if (product && product.categories?.maincategory) {
      breadcrumbItems.push({ name: product.categories.maincategory.translations[currentLang], href: `/category/${product.categories.maincategory.slug}` });
      if (product.categories?.subcategory) {
        breadcrumbItems.push({ name: product.categories.subcategory.translations[currentLang], href: `/category/${product.categories.maincategory.slug}/${product.categories.subcategory.slug}` });
      }
    }
  } catch (e) {
    console.error(e);
  }

  return breadcrumbItems;
}

export default async function ProductDetailPage<T extends ProductTypes>(props: {
  productType: T,
  product: Product,
  lang?: SupportedLangs
}) {
  const t = await getTranslations('Showcase');
  const locale = await getLocale() as SupportedLangs;
  const currentLang = props.lang || locale;
  const product = props.product;
  const thumbnail = product.thumb_url;
  const isFavorite = await is_favorite(product.uuid);
  let intro = product.intros?.[locale];
  
  if (product.intros?.en?.includes('Brief description')) {
    intro = undefined;
  }

  const translatedContent: TranslationContent | undefined = product.translations?.[currentLang];
  const breadcrumbItems = await getBreadcrumbCategoryItems(product, currentLang, t);
  const seo = product.seo?.[currentLang];
  const tagline = seo?.tagline || translatedContent?.tagline || product.tagline || "";

  return (
    <div className="bg-gray-100 dark:bg-black">
      <div className="flex-col max-w-7xl mx-auto gap-5">
        <div className="flex flex-row gap-5 px-5 md:px-10 pt-5 md:pt-10">
          <SiteBreadcrumbGenerator items={breadcrumbItems} />
        </div>

        <div className="flex md:flex-row w-full flex-col gap-10 p-5 md:p-10">
          <div className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-5 bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <div className="flex flex-row gap-5">
                <div className="w-20">
                  <Logo name={product.name || ""} url={thumbnail || ""} className="w-20 h-20" />
                </div>

                <div className="flex flex-col w-full justify-between">
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex flex-row items-center justify-between gap-4">
                      <h1 className="text-3xl md:text-5xl font-bold break-words flex flex-col gap-2">
                        <Link href={product.website || ""} className="hover:underline" target="_blank" rel="nofollow">
                          {product.name}
                        </Link>
                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          {tagline}
                        </span>
                      </h1>
                      <div className="flex flex-row gap-2">
                        <AddFavoriteBtn initIsFavorite={isFavorite} itemId={product.uuid} itemType={product.itemType} />
                        <Link href={product.website || ""} target="_blank" rel="nofollow">
                          <Button variant={"outline"} className="hidden md:flex bg-[#f05f22] hover:bg-[#ff5e00] text-white hover:text-white">
                            {t('VisitWebsite')}
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {product.seo?.[locale]?.description || product.description || ""}
                </p>
              </div>

              <div className="flex w-full flex-row flex-wrap justify-end gap-3">
                {product.categories?.topics?.map((topic) => (
                  <Link key={topic.slug} href={`/topic/${topic.slug}`} title={`${topic.translations[currentLang]}`}>
                    <Badge
                      className="rounded-full texts py-1 px-3 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer flex items-center gap-2"
                      variant="secondary"
                    >
                      <Tag className="w-4 h-4 mr-1" />
                      <span>{topic.translations[currentLang]}</span>
                    </Badge>
                  </Link>
                ))}


              </div>
            </div>

            <div className="md:hidden">
              <div className="flex flex-row gap-2">
                <AddFavoriteBtn initIsFavorite={isFavorite} itemId={product.uuid} itemType={product.itemType} />
                <Link href={product.website || ""} target="_blank" className="w-full" prefetch={false} rel="nofollow">
                  <Button variant={"outline"} className="w-full flex md:hidden bg-[#f05f22] hover:bg-[#ff5e00] text-white hover:text-white">
                    {t('VisitWebsite')}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <ImageLoader imgClassName="w-full object-cover object-top border rounded-lg" alt={`${product.name} screenshot`} src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product?.uuid}.webp`} />
            </div>

            {intro && (
              <div className="bg-white dark:bg-gray-800 border rounded-lg p-5 w-full">
                <AIIntro markdown={intro} />
              </div>
            )}

          </div>

          <div className="w-full md:w-[400px] gap-5 flex flex-col">
            <SimilarProducts product={product} />
            <WeeklyTop />
          </div>
        </div>
      </div>
    </div>
  );
}