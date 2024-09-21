import MiniCard from "@/components/category/mini.card";
import query_favorites from "@/lib/api/favorites";
import { getLocale, getTranslations } from "next-intl/server";
import { SupportedLangs } from "@/i18n/types";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function MyFavorites({ searchParams }: { searchParams: { page?: string } }) {
  const t = await getTranslations("Categories");
  const locale = await getLocale() as SupportedLangs;
  const page = parseInt(searchParams.page || '1');
  const pageSize = 30;
  const { favorites, totalCount } = await query_favorites({ page, pageSize });
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-w-full max-h-full">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-2 md:gap-0">
          <h1 className="text-2xl font-bold">
            My Favorites
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('TotalProducts', { count: totalCount })}，{t('PageInfo', { current: page, total: totalPages })}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 py-5">
          {favorites.map((item) => (
            <MiniCard key={item.product.uuid} product={item.product} locale={locale} />
          ))}
        </div>

        <div className="flex justify-center mt-8 gap-4">
          {page > 1 && (
            <Link href={`/favorites?page=${page - 1}`}>
              <Button variant="outline" className="flex gap-2">
                <ArrowLeftIcon className="w-4 h-4" />
                {t('PreviousPage')}
              </Button>
            </Link>
          )}

          {page < totalPages && (
            <Link href={`/favorites?page=${page + 1}`}>
              <Button variant="outline" className="flex gap-2">
                {t('NextPage')}
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}