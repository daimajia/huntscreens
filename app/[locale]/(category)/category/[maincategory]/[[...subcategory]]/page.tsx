/* eslint-disable @next/next/no-img-element */
import MiniCard from "@/components/category/mini.card";
import Footer from "@/components/layout/footer";
import MiniCardLoading from "@/components/ui-custom/skeleton/minicard.loading";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { locales, SupportedLangs } from "@/i18n/types";
import { getCategoryItemCount, getCategoryProducts } from "@/lib/api/query.category";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Metadata } from "next";
import { getCachedSEOFromPath } from "@/lib/seo/cache";

export async function generateMetadata({ params, searchParams }: {
  params: { maincategory: string, subcategory: string[] },
  searchParams: { page?: string }
}): Promise<Metadata> {
  const locale = await getLocale() as SupportedLangs;
  const mainCategory = params.maincategory;
  const subCategories = params.subcategory?.length > 0 ? params.subcategory[0] : undefined;

  if (mainCategory !== 'just-launched') {
    const counts = await getCategoryItemCount([{ mainslug: mainCategory, subSlug: subCategories }]);
    const count = counts[subCategories ? `${mainCategory}/${subCategories}` : mainCategory];
    if (count === 0) {
      return {
        title: "Category Not Found",
        description: "The category you are looking for does not exist.",
        keywords: [],
        openGraph: {
          locale: locale
        }
      }
    }
  }

  const seoContent = subCategories ?
    await getCachedSEOFromPath(locale, mainCategory, subCategories) :
    await getCachedSEOFromPath(locale, mainCategory);

  const alternateLanguages: Record<string, string> = {};
  locales.forEach(lang => {
    alternateLanguages[lang] = `/${lang}/category/${mainCategory}/${subCategories ? subCategories : ''}`;
  });


  return {
    metadataBase: new URL("https://huntscreens.com"),
    title: seoContent.title,
    description: seoContent.description,
    keywords: seoContent.keywords.join(','),
    openGraph: {
      locale: locale,
      title: seoContent.title,
      description: seoContent.description,
    },
    alternates: {
      canonical: `/${locale}/category/${mainCategory}/${subCategories ? subCategories : ''}`,
      languages: alternateLanguages,
    },
  };
}

export default async function MainCategoryPage({ params, searchParams }: {
  params: { maincategory: string, subcategory: string[] },
  searchParams: { page?: string }
}) {
  const t = await getTranslations("Categories");
  const locale = await getLocale() as SupportedLangs;
  const mainCategory = params.maincategory;
  const subCategories = params.subcategory?.length > 0 ? params.subcategory[0] : undefined;
  const page = parseInt(searchParams.page || '1');
  const { products, totalCount, totalPages } = await getCategoryProducts(mainCategory, page, 30, subCategories);
  const categoryData = products.length > 0 ? products[0].categories : undefined;
  const nextlink = subCategories ? `/category/${mainCategory}/${subCategories}?page=${page + 1}` : `/category/${mainCategory}?page=${page + 1}`;
  const prevlink = subCategories ? `/category/${mainCategory}/${subCategories}?page=${page - 1}` : `/category/${mainCategory}?page=${page - 1}`;

  return <Suspense fallback={<MiniCardLoading />}>

    <div className="min-w-full max-h-full">
      {
        products.length > 0 ? (
          <div className="max-w-6xl mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              {mainCategory === 'just-launched' ?
                <>
                  <h1 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="relative inline-block mx-2">
                      <span className="absolute inset-0 bg-orange-500/80 transform -skew-y-1" />
                      <span className="relative z-10 inline-block px-2 py-1 text-white font-bold">
                        {t('JustLaunched.prefix')}
                      </span>
                    </span>
                    {t('JustLaunched.suffix')}
                  </h1>
                </> :
                <>
                  <h1 className="text-2xl font-bold mb-4 flex items-center">
                    {t("LatestProducts.prefix")}
                    <span className="relative inline-block mx-2">
                      <span className="absolute inset-0 bg-orange-500/80 transform -skew-y-1"></span>
                      <span className="relative z-10 inline-block px-2 py-1 text-white font-bold">
                        {categoryData?.maincategory?.translations[locale]}
                        {subCategories ? ' / ' : ''}
                        {subCategories ? categoryData?.subcategory?.translations[locale] : ''}
                      </span>
                    </span>
                    {t("LatestProducts.suffix")}
                  </h1>
                </>
              }
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {t('TotalProducts', { count: totalCount })}，{t('PageInfo', { current: page, total: totalPages })}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 py-5">
              {products.map((product) => (
                <MiniCard key={product.uuid} product={product} locale={locale} />
              ))}
            </div>
            <div className="flex justify-center mt-8 gap-4">
              {page > 1 && (
                <Link href={prevlink}>
                  <Button variant="outline" className="flex gap-2">
                    <ArrowLeftIcon className="w-4 h-4" />
                    {t('PreviousPage')}
                  </Button>
                </Link>
              )}

              {page < totalPages && totalPages > 1 && (
                <Link href={nextlink}>
                  <Button variant="outline" className="flex gap-2">
                    {t('NextPage')}
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center h-full">
            <h2 className="text-2xl font-bold mb-4">{t('NoProducts.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{t('NoProducts.description')}</p>
            <Link href="/" className="inline-block px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300">
              {t('NoProducts.backToHome')}
            </Link>
          </div>
        )
      }
      <div>
        <Footer className="md:px-7" />
      </div>
    </div>
  </Suspense>
}