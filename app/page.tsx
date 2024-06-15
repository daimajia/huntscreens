import { db } from '@/db/db';
import { Producthunt, producthunt } from '@/db/schema/ph';
import MiniScreenshotCard from './components/screenshot.card';
import { desc } from 'drizzle-orm';

async function getPHPost() {
  const data = await db.query.producthunt.findMany({
    orderBy: [desc(producthunt.featuredAt)],
    limit: 30
  });
  return data as Producthunt[];
}

export default async function Home() {
  const phs = await getPHPost();
  return (
    <main className="flex  flex-col items-center justify-between p-5 md:p-10 gap-10">
      <div className=' w-full'>
        <h1 className=' font-semibold text-4xl leading-10 tracking-tight'>
          The best way to browse the ProductHunt!
        </h1>
      </div>
      <div className='grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 gap-10 w-full'>
        {phs.map((ph) => <>
          <MiniScreenshotCard key={ph.uuid} producthunt={ph} />
        </>)}
      </div>
    </main>
  )
}
