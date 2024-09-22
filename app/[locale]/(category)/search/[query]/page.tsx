import { search } from "@/lib/api/search";
import SearchBox from "@/components/search/search.box";
import { getLocale, getTranslations } from "next-intl/server";
import MiniCard from "@/components/category/mini.card";
import { SupportedLangs } from "@/i18n/types";
import Pagination from "@/components/ui-custom/pagination";
import Footer from "@/components/layout/footer";

export default async function SearchPage({ params, searchParams }: { 
  params: { query: string }, 
  searchParams: { page?: string } 
}) {
  const query = decodeURIComponent(params.query);
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 30;

  const { results, totalCount } = await search(query, page, pageSize);
  const totalPages = Math.ceil(totalCount / pageSize);
  const locale = await getLocale();
  const t = await getTranslations("Search");

  return (
    <>
      <title>{query}</title>
      <div className="container mx-auto px-4 py-8">
        <div className="md:hidden mb-6">
          <SearchBox />
        </div>
        <h1 className="text-3xl font-bold mb-6">{t('SearchResultsFor', { query: query })}</h1>
        {results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <MiniCard key={result.id} product={result} locale={locale as SupportedLangs} />
              ))}
            </div>
            <div className="mt-8 flex justify-between">
               <Pagination currentPage={page} totalPages={totalPages} baseUrl={`/search/${query}`} />
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">{t('NoResults')}</p>
            <p className="mt-2 text-gray-500">{t('TryDifferentKeywords')}</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
