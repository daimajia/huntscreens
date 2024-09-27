import MiniCardLoading from "@/components/ui-custom/skeleton/minicard.loading";
import { Suspense } from "react";
import { getTopicProducts } from "@/lib/api/query.category";
import MiniCard from "@/components/category/mini.card";
import { getLocale, getTranslations } from "next-intl/server";
import { locales, SupportedLangs } from "@/i18n/types";
import Footer from "@/components/layout/footer";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Metadata } from "next";
import { queryTopicsItemCount, queryTopicTranslation } from "@/lib/api/query.topics";
import { getCachedSEOFromPath } from "@/lib/seo/cache";

export async function generateMetadata({ params, searchParams }: {
  params: { topic: string },
  searchParams: { page?: string }
}): Promise<Metadata> {
  const locale = await getLocale() as SupportedLangs;
  const topic = params.topic;
  const counts = await queryTopicsItemCount([topic]);
  const count = counts.results?.[0]?.count || 0;
  if(count === 0) {
    return {
      title: "Topic Not Found",
      description: "The topic you are looking for does not exist.",
      keywords: [],
      openGraph: {
        locale: locale
      }
    }
  }
  const seoContent = await getCachedSEOFromPath(locale, topic, true);
  const alternateLanguages: Record<string, string> = {};
  locales.forEach(lang => {
    alternateLanguages[lang] = `/${lang}/topic/${topic}?page=${searchParams.page || '1'}`;
  });
  return {
    metadataBase: new URL("https://huntscreens.com"),
    title: seoContent.title,
    description: seoContent.description,
    keywords: seoContent.keywords.join(','),
    openGraph: {
      locale: locale
    },
    alternates: {
      canonical: `${locale}/topic/${topic}`,
      languages: alternateLanguages,
    },
  };
}

export default async function TopicPage({ params, searchParams }: { params: { topic: string }, searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const topicDetail = await queryTopicTranslation(params.topic);
  const { products, totalCount, totalPages, topic: topicName } = await getTopicProducts(topicDetail?.name || params.topic, page, 30);
  const t = await getTranslations("Categories");
  const locale = await getLocale() as SupportedLangs;
  const topicLocal = topicDetail?.translations[locale] || topicDetail?.name || params.topic;
  const nextlink = `/topic/${params.topic}?page=${page + 1}`;
  const prevlink = `/topic/${params.topic}?page=${page - 1}`;

  return <>
    {products.length === 0 ?
      <div className="p-4 text-center h-full">
        <h2 className="text-2xl font-bold mb-4">{t('NoProducts.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{t('NoProducts.description')}</p>
        <Link href="/" className="inline-block px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300">
          {t('NoProducts.backToHome')}
        </Link>
      </div> : <>
        <Suspense fallback={<MiniCardLoading />}>
          <div className="min-w-full max-h-full">
            <div className="max-w-6xl mx-auto p-4">
              <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-2 md:gap-0">
                <h1 className="text-2xl font-bold">
                  {t('Topic.relatedProducts', { topic: topicLocal })}
                </h1>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 py-5">
                {
                  products.map(product => (
                    <MiniCard key={product.id} locale={locale} product={product} />
                  ))
                }
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

                {page < totalPages && totalPages > 1 && products.length === 30 && (
                  <Link href={nextlink}>
                    <Button variant="outline" className="flex gap-2">
                      {t('NextPage')}
                      <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="p-4">
              <Footer />
            </div>
          </div>
        </Suspense>
      </>}
  </>
}