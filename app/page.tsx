import { db } from '@/db/db';
import { Producthunt, producthunt } from '@/db/schema/ph';
import Image from 'next/image'
import ScreenshotCard from './components/screen.cards';

async function getPHPost() {
  const data = await db.select().from(producthunt).limit(5);
  return data as Producthunt[];
}

export default async function Home() {
  const phs = await getPHPost();
  return (
    <main className="flex  flex-col items-center justify-between p-10">
      <div className='flex flex-col w-full gap-10'>
        {phs.map((ph) => <>
          <ScreenshotCard producthunt={ph}></ScreenshotCard>
        </>)}
        {/* <ScreenshotCard />
        <ScreenshotCard />
        <ScreenshotCard /> */}
      </div>
    </main>
  )
}
