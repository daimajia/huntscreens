import { db } from "@/db/db";
import { Producthunt, producthunt } from "@/db/schema";
import { gt } from "drizzle-orm";
import Logo from "@/components/logo";
import Link from "next/link";
import { ThumbsUpIcon } from "lucide-react";
import redis from "@/db/redis";
import { urlMapper } from "@/types/product.types";
import { getTranslations } from "next-intl/server";
import { SupportedLangs } from "@/i18n/routing";
import { useLocale } from "next-intl";

const WeeklyTopCard = ({ product }: { product: Producthunt }) => {
  const locale = useLocale() as SupportedLangs;
  return <>
    <Link href={urlMapper["ph"](product.id, locale)}>
      <div className="flex flex-col gap-5 bg-white dark:bg-gray-800 p-5 rounded-lg border hover:shadow-md transition-shadow">
        <div className="flex flex-row gap-5 items-center w-full">
          <div className="w-10 h-10">
            <Logo name={product.name || ""} url={product.thumb_url || ""} />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold hover:underline">{product.name}</h3>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUpIcon size={16} />
                <span>{product.votesCount}</span>
              </div>
            </div>
            <div className="w-full">
              <p className="text-sm text-muted-foreground line-clamp-2 hover:line-clamp-none transition-all duration-300 ease-in-out">
                {product.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  </>
}

async function getWeeklyTop() {
  const cached = await redis.get("weekly_top");
  if (cached) {
    return JSON.parse(cached) as Producthunt[];
  }
  const weeklyTops = await db.query.producthunt.findMany({
    orderBy: (producthunt, { desc }) => [desc(producthunt.votesCount)],
    limit: 10,
    where: gt(producthunt.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  });
  await redis.set("weekly_top", JSON.stringify(weeklyTops), "EX", 60 * 60 * 24 * 1);
  return weeklyTops as Producthunt[];
}

export default async function WeeklyTop() {
  const weeklyTops = await getWeeklyTop();
  const t = await getTranslations('Showcase');
  return <div>
    <h1 className="text-2xl font-bold mb-5">{t("WeeklyTop")}</h1>
    <ul className="flex flex-col gap-5">
      {weeklyTops.map((weeklyTop) => (
        <li key={weeklyTop.id}>
          <WeeklyTopCard product={weeklyTop} />
        </li>
      ))}
    </ul>
  </div>;
}