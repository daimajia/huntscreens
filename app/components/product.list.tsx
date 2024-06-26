import { db } from "@/db/db";
import { producthunt, Producthunt } from "@/db/schema/ph";
import { eq, desc } from "drizzle-orm";
import { cache, Suspense } from "react";
import MiniScreenshotCard from "./screenshot.card";

export const revalidate = 300;

const getPHPosts = cache(async (sortBy: "time" | "vote") => {
  const data = await db.query.producthunt.findMany({
    where: eq(producthunt.s3, true),
    orderBy: [sortBy === "time" ? desc(producthunt.added_at) : desc(producthunt.votesCount)],
    limit: 30
  })
  return data as Producthunt[];
});

export default async function ProductLists(props: {
  sortBy?: "time" | "vote"
}) {
  const sort = props.sortBy || "time";
  const phs = await getPHPosts(sort);
  return <>
    {phs.map((ph) => <>
      <MiniScreenshotCard key={ph.id} producthunt={ph} />
    </>)}
  </>
}