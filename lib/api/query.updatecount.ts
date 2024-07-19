import { db } from "@/db/db";
import { producthunt, taaft, yc } from "@/db/schema";
import { startOfDay, subDays } from "date-fns";
import { count, gt } from "drizzle-orm";

type UpdateCount = {
  YC: number,
  PH: number,
  TAAFT?: number
}

export default async function getUpdateCounts() {
  const yesterday = startOfDay(subDays(new Date(), 1));
  const ph = db.select({
    PH: count()
  }).from(producthunt).where(gt(producthunt.added_at, yesterday));
  const yc2 = db.select({
    YC: count()
  }).from(yc).where(gt(yc.launched_at, yesterday.toISOString()));
  // const taaftCnt = db.select({
  //   TAAFT: count()
  // }).from(taaft).where(gt(taaft.added_at, yesterday.toISOString()));
  const results = await Promise.all([ph, yc2]);
  const updateCount: UpdateCount = results.reduce((acc, curr) => ({...acc, ...curr[0]}), {} as UpdateCount);
  return updateCount;
}