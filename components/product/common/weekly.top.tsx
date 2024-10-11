import { db } from "@/db/db";
import { desc, sql } from "drizzle-orm";
import Logo from "@/components/logo";
import { Link } from "@/i18n/routing";
import { ThumbsUpIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SupportedLangs } from "@/i18n/types";
import { useLocale } from "next-intl";
import { ProductHuntMetadata } from "@/db/schema/types";
import redis from "@/db/redis";
import { visibleProducts } from "@/db/schema/views/visible.products";
import { Product } from "@/db/schema";

const WeeklyTopCard = ({ product }: { product: Product }) => {
  const locale = useLocale() as SupportedLangs;
  const metadata = product.metadata as ProductHuntMetadata;
  return <>
    <Link href={`/products/${product.slug}`}>
      <div className="flex flex-col gap-5 bg-white dark:bg-gray-800 p-5 rounded-lg border hover:shadow-md transition-shadow">
        <div className="flex flex-row gap-5 items-center w-full">
          <div className="w-10 h-10 ">
            <Logo name={product.name || ""} url={product.thumb_url || ""} />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold hover:underline">{product.name}</h3>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUpIcon size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">{metadata.votesCount}</span>
              </div>
            </div>
            <div className="w-full">
              <p className="text-sm text-muted-foreground line-clamp-2 hover:line-clamp-none transition-all duration-300 ease-in-out">
                {product.translations?.[locale]?.tagline || product.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  </>
}

const getWeeklyTopProducts = async (limit: number = 10) => {
  const cacheKey = 'weekly_top_v3';
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData as string) as Product[];
  }
  const weeklyTopProducts = await db
    .select()
    .from(visibleProducts)
    .where(
      sql`${visibleProducts.itemType} = 'ph' AND ${visibleProducts.added_at} >= NOW() - INTERVAL '7 days'`
    )
    .orderBy(desc(sql`(${visibleProducts.metadata}->>'votesCount')::INTEGER`))
    .limit(limit);
  await redis.setex(cacheKey, 36000, JSON.stringify(weeklyTopProducts));
  return weeklyTopProducts;
};

export default async function WeeklyTop() {
  const weeklyTops = await getWeeklyTopProducts();
  const t = await getTranslations('Showcase');
  return <div>
    <h2 className="text-2xl font-bold mb-5">{t("WeeklyTop")}</h2>
    <ul className="flex flex-col gap-5">
      {weeklyTops.map((weeklyTop) => (
        <li key={weeklyTop.id}>
          <WeeklyTopCard product={weeklyTop} />
        </li>
      ))}
    </ul>
  </div>;
  }