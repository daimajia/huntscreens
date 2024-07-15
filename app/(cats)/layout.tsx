import { db } from '@/db/db';
import { producthunt } from '@/db/schema/ph';
import { subHours } from 'date-fns';
import { count, gte } from 'drizzle-orm';
import { cache } from 'react';
import Header from '../components/header';
import SubscribeButton from '../components/subscribe.button';
import Link from 'next/link';

export const revalidate = 0;

const getTodayCount = cache(async () => {
  const cnt = await db.select({ count: count() }).from(producthunt).where(gte(producthunt.featuredAt, subHours(new Date(), 24).toUTCString()));
  return cnt[0].count;
});

export default async function Home({
  children,
}: {
  children: React.ReactNode
}) {
  const todayCount = await getTodayCount();
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-between p-5 gap-10">
        <div className=' w-full flex flex-col gap-4 px-5 '>
          <div className='flex flex-col'>
            <h1 className='text-2xl font-bold tracking-tight lg:text-3xl md:mt-3'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-pink-500'>
                The best way to explore <Link href="/">ProductHunt</Link> and <Link href='/startup/yc'>Y Combinator</Link>.
              </span>
            </h1>
            <h2 className='mt-2'>Instantly discover new products and YC Startups visually!</h2>
          </div>
          <div className='flex flex-row gap-4 items-center'>
            <SubscribeButton />

            <div className='grow'>
              <span className=' text-gray-500'>
                {todayCount} added today
              </span>
            </div>
          </div>
        </div>

        {children}
      </main>
    </>
  )
}
