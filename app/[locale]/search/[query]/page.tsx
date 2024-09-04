import SearchCard from "@/components/search/search.card";
import { search } from "@/lib/api/search";
import SearchBox from "@/components/search/search.box";
import Header from "@/components/layout/header";
import { getTranslations } from "next-intl/server";

export default async function SearchPage({ params }: { params: { query: string } }) {
  const query = decodeURIComponent(params.query);
  const searchResults = await search(query);
  const t = await getTranslations("Search");
  return (
    <>
      <title>{query}</title>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="md:hidden mb-6">
          <SearchBox />
        </div>
        <h1 className="text-3xl font-bold mb-6">{t('SearchResultsFor', { query: query })}</h1>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((result) => (
              <SearchCard key={result.id} result={result} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">{t('NoResults')}</p>
            <p className="mt-2 text-gray-500">{t('TryDifferentKeywords')}</p>
          </div>
        )}
      </div>
    </>
  );
}
