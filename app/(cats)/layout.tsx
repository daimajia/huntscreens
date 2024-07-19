import Header from '../components/header';
import SubscribeButton from '../components/subscribe.button';
import Link from 'next/link';

export default async function Home({
  children,
}: {
  children: React.ReactNode
}) {
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
          </div>
        </div>

        {children}
      </main>
    </>
  )
}
