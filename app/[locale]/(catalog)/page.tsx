import { Suspense } from "react";
import Loading from "@/components/ui-custom/skeleton/list.loading";
import MiniCard from "@/components/category/mini.card";
import Categorydata from "@/i18n/custom/categories.json";
import { PredefinedCategory } from "@/lib/ai/types";
import { SupportedLangs } from "@/i18n/types";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Footer from "@/components/layout/footer";
import { getBulkCategoryProducts } from "@/lib/api/query.landing";
import { Product } from "@/db/schema";

type CategorySectionProps = {
  predefinedCategory: PredefinedCategory | undefined;
  products: Product[];
  locale: SupportedLangs;
}

const CategorySection = async ({ predefinedCategory, products, locale }: CategorySectionProps) => {
  const t = await getTranslations('Home');
  if (!predefinedCategory) return null;
  return (
    <div>
      <Link href={`/category/${predefinedCategory.slug}`}>
        <h2 className="text-3xl font-bold mb-5 inline-block hover:underline">
          <span className="relative inline-block mx-2">
            <span className="absolute inset-0 bg-orange-500/80 transform -skew-y-2" />
            <span className="relative z-10 inline-block px-5 py-1 text-white font-bold">
              {predefinedCategory.emoji} {predefinedCategory.maincategory[locale]}
            </span>
          </span>
        </h2>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <MiniCard key={product.uuid} product={product} locale={locale} isMainContent={false} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Link href={`/category/${predefinedCategory.slug}`}>
          <Button size="lg" variant="outline" className="px-20">
            {t('view-more')} <ChevronRightIcon className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div >
  )
}


export default async function IndexPage() {
  const locale = await getLocale();
  const maincategory_slugs = Categorydata.map(c => c.slug);
  const datapack = await getBulkCategoryProducts(maincategory_slugs);

  return (
    <div className='flex flex-col gap-10 w-full'>
      <Suspense fallback={<Loading />}>
        {datapack.map((ps) => (
          <CategorySection locale={locale as SupportedLangs} key={ps.products[0].uuid} predefinedCategory={Categorydata.find(c => c.slug === ps.mainslug)} products={ps.products} />
        ))}
      </Suspense>
      <Footer />
    </div>
  );
}
