import Header from "@/app/components/header";
import SearchCard from "./_components/search.card";
import { search } from "@/lib/api/search";
import SearchBox from "@/app/components/search.box";

export default async function SearchPage({ params }: { params: { query: string } }) {
  const query = decodeURIComponent(params.query);
  const searchResults = await search(query);

  return (
    <>
      <title>{query}</title>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="md:hidden mb-6">
          <SearchBox />
        </div>
        <h1 className="text-3xl font-bold mb-6">Search Results for &quot;{query}&quot;</h1>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((result) => (
              <SearchCard key={result.id} result={result} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">No results found.</p>
            <p className="mt-2 text-gray-500">Try searching with different keywords.</p>
          </div>
        )}
      </div>
    </>
  );
}
