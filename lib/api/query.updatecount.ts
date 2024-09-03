import { db } from "@/db/db";
import { indiehackers, producthunt, taaft, yc } from "@/db/schema";
import { startOfDay, subDays } from "date-fns";
import { count, gt } from "drizzle-orm";

export type UpdateCount = {
  YC: number,
  PH: number,
  TAAFT: number,
  Indiehackers: number
}

export default async function getUpdateCounts() {
  const yesterday = startOfDay(subDays(new Date(), 1));
  const queries = [
    db.select({ PH: count() }).from(producthunt).where(gt(producthunt.added_at, yesterday)),
    db.select({ YC: count() }).from(yc).where(gt(yc.launched_at, yesterday.toISOString())),
    db.select({ Indiehackers: count() }).from(indiehackers).where(gt(indiehackers.added_at, yesterday)),
    db.select({ TAAFT: count() }).from(taaft).where(gt(taaft.added_at, yesterday.toISOString()))
  ];

  const results = await Promise.all(queries);
  const updateCount: UpdateCount = results.reduce((acc, curr) => ({...acc, ...curr[0]}), {} as UpdateCount);
  return updateCount;
}