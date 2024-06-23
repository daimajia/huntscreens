import { db } from '@/db/db';
import { Producthunt, producthunt } from '@/db/schema/ph';
import MiniScreenshotCard from './components/screenshot.card';
import { desc } from 'drizzle-orm';
import { cache } from 'react';
import Header from './components/header';

export const revalidate = 60;

const getPHPosts = cache(async () => {
  const data = await db.query.producthunt.findMany({
    orderBy: [desc(producthunt.added_at)],
    limit: 30
  })
  return data as Producthunt[];
});

export default async function Home() {
  const phs = await getPHPosts();
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-between p-5 md:p-10 gap-10">
        <div className=' w-full flex flex-row justify-between'>
          <h1 className='scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl'>
            The best way to
            <br />
            explore the ProductHunt!
          </h1>
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
