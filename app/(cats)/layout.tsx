import Image from 'next/image';
import Header from '../components/header';
import SubscribeButton from '../components/subscribe.button';
import underline from "/public/underline.svg";
import { getCurrentUser } from '@/lib/user';

export const revalidate = 0;

export default async function Home({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser();
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-between p-5 gap-10">
        <div className=' w-full flex flex-col gap-4 px-5 md:mt-5'>
          <div className='flex flex-col justify-center items-center'>
            <h1 className=' relative text-center lg:leading-[3.5rem] font-bold text-slate-800 dark:text-gray-100 text-2xl md:mt-3 md:text-5xl leading-10'>
              <span className='relative inline-block'>Visually<Image alt="" className='w-28 md:w-52' src={underline} /></span>Discover  Latest <br /> <span className='bg-clip-text text-transparent bg-gradient-to-br from-amber-500 to-pink-500 dark:selection:bg-blue-300 dark:selection:text-white'>Products and Startups</span>
            </h1>
            <h2 className='mt-1 text-neutral-500 dark:text-neutral-300 md:text-lg xl:text-xl'>Explore products and startups through visual snapshots</h2>
            <div className='flex flex-row gap-4 items-center mt-8'>
              <SubscribeButton subscribed={user?.subscribed} isLogin={user !== null} />
            </div>
            <div className='mt-8'>
              <a href="https://www.producthunt.com/posts/huntscreens?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-huntscreens" target="_blank" rel="noopener noreferrer">
                <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=478742&theme=light" alt="HuntScreens - Visually&#0032;Discover&#0032;Latest&#0032;Products&#0032;and&#0032;Startups&#0046; | Product Hunt" style={{width: '250px', height: '54px'}} width="250" height="54" />
              </a>
            </div>
          </div>

        </div>

        {children}
      </main>
    </>
  )
}