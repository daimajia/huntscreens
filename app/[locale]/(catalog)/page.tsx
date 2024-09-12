import { Suspense } from "react";
import Loading from "@/components/ui-custom/skeleton/list.loading";
import { JustLaunchedProduct } from "@/types/product.types";
import MiniCard from "@/components/category/mini.card";
import { getCategoryProducts } from "@/lib/api/query.category";
import Categorydata from "@/i18n/custom/categories.json";
import { PredefinedCategory } from "@/lib/ai/types";
import { SupportedLangs } from "@/i18n/types";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Footer from "@/components/layout/footer";
import redis from "@/db/redis";

type CategorySectionProps = {
  predefinedCategory: PredefinedCategory | undefined;
  products: JustLaunchedProduct[];
  locale: SupportedLangs;
}

type IndexDataPack = {
  products: JustLaunchedProduct[];
  totalCount: number;
  totalPages: number;
  mainslug: string;
  subSlug: string | undefined;
}

const CategorySection = async ({ predefinedCategory, products, locale }: CategorySectionProps) => {
  const t = await getTranslations('Home');
  if (!predefinedCategory) return null;
  return (
    <div>
      <Link href={`/category/${predefinedCategory.slug}`}>
        <h1 className="text-3xl font-bold mb-5 inline-block hover:underline">
          <span className="relative inline-block mx-2">
            <span className="absolute inset-0 bg-orange-500/80 transform -skew-y-2" />
            <span className="relative z-10 inline-block px-5 py-1 text-white font-bold">
              {predefinedCategory.emoji} {predefinedCategory.maincategory[locale]}
            </span>
          </span>
        </h1>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <MiniCard key={product.uuid} product={product} locale={locale} />
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

const getBulkCategoryProducts = async (maincategory_slugs: string[]): Promise<IndexDataPack[]> => {
  let products;
  try {
    let data = await redis.get('index:datapack');
    if (data) {
      return JSON.parse(data) as IndexDataPack[];
    }
  } catch (e) {
    console.error(e);
  }

  products = await Promise.all(maincategory_slugs.map(slug => {
    if (slug === 'just-launched') {
      return getCategoryProducts(slug, 1, 8);
    }
    return getCategoryProducts(slug, 1, 4);
  }));
  await redis.set('index:datapack', JSON.stringify(products), 'EX', 60 * 60 * 15);
  return products as unknown as IndexDataPack[];
}

export default async function IndexPage() {
  const locale = await getLocale();
  const maincategory_slugs = Categorydata.map(c => c.slug);
  const datapack = await getBulkCategoryProducts(maincategory_slugs);

  return (
    <div className='flex flex-col gap-10 w-full'>
      <Suspense fallback={<Loading />}>
        {datapack.map((ps) => (
          <CategorySection locale={locale as SupportedLangs} key={ps.products[0].uuid} predefinedCategory={Categorydata.find(c => c.slug === ps.mainslug)} products={ps.products as unknown as JustLaunchedProduct[]} />
        ))}
      </Suspense>
      <Footer />
    </div>
  );
}
