import MiniCardLoading from "@/components/ui-custom/skeleton/minicard.loading";
import { Suspense } from "react";
import { getTopicProducts } from "@/lib/api/query.category";
import MiniCard from "@/components/category/mini.card";
import { JustLaunchedProduct } from "@/types/product.types";
import { getLocale, getTranslations } from "next-intl/server";
import { SupportedLangs } from "@/i18n/types";
import Footer from "@/components/layout/footer";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export default async function TopicPage({ params, searchParams }: { params: { topic: string }, searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const { products, totalCount, totalPages } = await getTopicProducts(params.topic, page, 30);
  const t = await getTranslations("Categories");
  const locale = await getLocale() as SupportedLangs;
  const topics = products.length > 0 ? products[0].categories?.topics : null;
  const topic = topics?.find(topic => topic.slug === params.topic);
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
              <div className="flex flex-row justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">
                  {t('Topic.relatedProducts', { topic: topic?.translations?.[locale] || params.topic })}
                </h1>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {t('TotalProducts', { count: totalCount })}，{t('PageInfo', { current: page, total: totalPages })}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {
                  products.map(product => (
                    <MiniCard key={product.id} locale={locale} product={product as unknown as JustLaunchedProduct} />
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

            <div className="p-4">
              <Footer />
            </div>
          </div>
        </Suspense>
      </>}
  </>
}