import { db } from '@/db/db';
import { Producthunt, producthunt } from '@/db/schema/ph';
import MiniScreenshotCard from './components/screenshot.card';

async function getPHPost() {
  const data = (await db.select().from(producthunt).limit(5));
  return data as Producthunt[];
}

export default async function Home() {
  const phs = await getPHPost();
  return (
    <main className="flex  flex-col items-center justify-between p-5 md:p-10">
      {/* <div className='border border-red-500'>
        The best way to hunt new products
      </div> */}
      <div className='grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 gap-5 w-full'>
        {phs.map((ph) => <>
          <MiniScreenshotCard producthunt={ph} />
        </>)}
      </div>
    </main>
  )
}
