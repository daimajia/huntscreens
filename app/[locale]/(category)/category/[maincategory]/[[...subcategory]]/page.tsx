/* eslint-disable @next/next/no-img-element */
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { SupportedLangs } from "@/i18n/types";
import { getCategoryProducts } from "@/lib/api/query.category";
import { JustLaunchedProduct, urlMapper } from "@/types/product.types";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

const MiniCard = ({ product, locale }: { product: JustLaunchedProduct, locale?: SupportedLangs }) => {
  const tagline = product.translations[locale ?? "en"]?.tagline ?? product.tagline;
  return (
    <Link href={urlMapper[product.item_type](product.id)} className="block">
      <div className="flex flex-col bg-white border border-gray-200 hover:border-gray-500/40 dark:hover:border-white/50 dark:border-gray-700 h-full dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="relative h-48">
          <img
            className="w-full object-cover object-center h-48"
            src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/cdn-cgi/image/width=800,height=500,fit=cover,gravity=0x0,format=webp/${product.uuid}.webp`}
            alt={product.name}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
          <img
            className="absolute bottom-3 left-3 w-10 h-10 rounded-full border-1 bg-white border-white shadow-md"
            src={product.thumb_url}
            alt={`${product.name} logo`}
            loading="lazy"
          />
        </div>
        <div className="p-4 flex flex-col h-full">
          <h3 className="font-bold text-base dark:text-gray-100 truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1 mb-3">{tagline}</p>
          <div className="mt-auto flex justify-end">
            {product.categories?.topics?.[0] && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                {product.categories.topics[0].translations[locale ?? "en"]}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default async function MainCategoryPage({ params, searchParams }: {
  params: { maincategory: string, subcategory: string[] },
  searchParams: { page?: string }
}) {
  const t = await getTranslations("Categories");
  const mainCategory = params.maincategory;
  const subCategories = params.subcategory?.length > 0 ? params.subcategory[0] : undefined;
  const page = parseInt(searchParams.page || '1');
  const { products, totalCount, totalPages } = await getCategoryProducts(mainCategory, page, 30, subCategories);
  const categoryData = products.length > 0 ? products[0].categories : undefined;
  const locale = await getLocale() as SupportedLangs;
  const nextlink = subCategories ? `/category/${mainCategory}/${subCategories}?page=${page + 1}` : `/category/${mainCategory}?page=${page + 1}`;
  const prevlink = subCategories ? `/category/${mainCategory}/${subCategories}?page=${page - 1}` : `/category/${mainCategory}?page=${page - 1}`;

  return <div className="min-w-full max-h-full">
    {
      products.length > 0 ? (
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex flex-row justify-between items-center">
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
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3 py-5">
            {products.map((product) => (
              <MiniCard key={product.uuid} product={product as unknown as JustLaunchedProduct} locale={locale} />
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
    <div className="p-4">
      <Footer />
    </div>
  </div>
}