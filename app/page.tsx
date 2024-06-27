import Header from './components/header';
import SubscribeButton from './components/subscribe.button';
import ProductLists from './components/product.list';
import { db } from '@/db/db';
import { producthunt } from '@/db/schema/ph';
import { subHours } from 'date-fns';
import { count, gte } from 'drizzle-orm';
import { Suspense, cache } from 'react';
import SortDropdown from './components/sort.dropdown';
import Loading from './components/list.loading';

export const revalidate = 0;

const getTodayCount = cache(async () => {
  const cnt = await db.select({ count: count() }).from(producthunt).where(gte(producthunt.featuredAt, subHours(new Date(), 24).toUTCString()));
  return cnt[0].count;
});

export default async function Home({ searchParams }: {
  searchParams: { sort?: "time" | "vote" },
}) {
  const todayCount = await getTodayCount();
  const sort = searchParams.sort || "time";
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

            <div className='grow'>
              <span className=' text-gray-500'>
                {todayCount} added today
              </span>
            </div>

            <div>
              <SortDropdown selectedValue={sort} />
            </div>
          </div>
        </div>
        <Suspense fallback={<Loading />}>
          <ProductLists sortBy={sort} />
        </Suspense>
      </main>
    </>
  )
}
