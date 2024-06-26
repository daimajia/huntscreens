import { db } from "@/db/db";
import { producthunt, Producthunt } from "@/db/schema/ph";
import { desc, eq } from "drizzle-orm";
import { cache } from "react";
import ManageScreenshotCard from "./components/screenshot.card";

export const revalidate = 100;

const getS3ErrorPosts = cache(async () => {
  const data = await db.query.producthunt.findMany({
    where: eq(producthunt.s3, false),
    orderBy: [desc(producthunt.added_at)]
  })
  return data as Producthunt[];
});

export default async function Dashboard() {
  const phs = await getS3ErrorPosts();
  return <>
    <div className="flex flex-row">
      <div className='grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 w-full'>
        {phs.map((ph) => <div className="flex flex-col gap-4">
          <ManageScreenshotCard key={ph.id} producthunt={ph} />
        </div>)}
      </div>
    </div>
  </>
}