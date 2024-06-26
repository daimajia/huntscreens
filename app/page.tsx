import { db } from '@/db/db';
import { Producthunt, producthunt } from '@/db/schema/ph';
import MiniScreenshotCard from './components/screenshot.card';
import { count, desc, eq, gte } from 'drizzle-orm';
import { cache } from 'react';
import Header from './components/header';
import { startOfToday } from 'date-fns';
import SubscribeButton from './components/subscribe.button';

export const revalidate = 60;

const getPHPosts = cache(async () => {
  const data = await db.query.producthunt.findMany({
    where: eq(producthunt.s3, true),
    orderBy: [desc(producthunt.added_at)],
    limit: 30
  })
  return data as Producthunt[];
});

const getTodayCount = cache(async () => {
  const cnt = await db.select({ count: count() }).from(producthunt).where(gte(producthunt.featuredAt, startOfToday().toUTCString()))
  return cnt[0].count;
});

export default async function Home() {
  const phs = await getPHPosts();
  const todayCount = await getTodayCount();

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-between p-5 gap-10">
        <div className=' w-full flex flex-col gap-4 px-5'>
          <div className='flex flex-col'>
            <h1 className='text-2xl font-bold tracking-tight lg:text-4xl'>
              The best way to explore the ProductHunt!
            </h1>
            <h2 className=' text-gray-500'>Screenshot every new product, browse the Producthunt with ease.</h2>
          </div>
          <div className='flex flex-row gap-4 items-center'>
            <SubscribeButton />
            <span className=' text-gray-500'>
              {todayCount} added today
            </span>
          </div>
        </div>
        <div className='grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 w-full'>
          {phs.map((ph) => <>
            <MiniScreenshotCard key={ph.id} producthunt={ph} />
          </>)}
        </div>
      </main>
    </>
  )
}
