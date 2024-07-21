import { db } from "@/db/db";
import { indiehackers, producthunt, yc } from "@/db/schema";
import { startOfDay, subDays } from "date-fns";
import { count, gt } from "drizzle-orm";

type UpdateCount = {
  YC: number,
  PH: number,
  TAAFT?: number,
  Indiehackers: number
}

export default async function getUpdateCounts() {
  const yesterday = startOfDay(subDays(new Date(), 1));
  const ph = db.select({
    PH: count()
  }).from(producthunt).where(gt(producthunt.added_at, yesterday));
  const yc2 = db.select({
    YC: count()
  }).from(yc).where(gt(yc.launched_at, yesterday.toISOString()));
  const indiehackersCnt = db.select({
    Indiehackers: count()
  }).from(indiehackers).where(gt(indiehackers.added_at, yesterday));
  const results = await Promise.all([ph, yc2, indiehackersCnt]);
  const updateCount: UpdateCount = results.reduce((acc, curr) => ({...acc, ...curr[0]}), {} as UpdateCount);
  return updateCount;
}