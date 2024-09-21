import Image from 'next/image';
import Header from '@/components/layout/header';
import SubscribeButton from '@/components/ui-custom/subscribe.button';
import underline from "/public/underline.svg";
import { getCurrentUser } from '@/lib/user';
import LoomFlowsWidget from '@/components/thirdparties/loomflow';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

export default async function Home({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser();
  const t = await getTranslations("Home");
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-between p-5 gap-10 max-w-[1380px] mx-auto">
        <div className=' w-full flex flex-col gap-4 px-5 md:mt-5'>
          <div className='flex flex-col justify-center items-center'>
            <h1 className=' relative text-center lg:leading-[3.5rem] font-bold text-slate-800 dark:text-gray-100 text-2xl md:mt-3 md:text-5xl leading-10'>
            <span className='relative inline-block'>{t("slogan.visual")}<Image alt="" className='w-28 md:w-52' src={underline} /></span>{t("slogan.discover")} 
            <br /> 
            <span className='bg-clip-text text-transparent bg-gradient-to-br from-amber-500 to-pink-500 dark:selection:bg-blue-300 dark:selection:text-white'>
              {t("slogan.productsandstartups")}
            </span>
          
            </h1>
            <h3>
            </h3>
            <h2 className='mt-1 text-neutral-500 dark:text-neutral-300 md:text-lg xl:text-xl'>{t('description')}</h2>
            <div className='flex flex-row gap-4 items-center mt-8'>
              <SubscribeButton subscribed={user?.subscribed} isLogin={user !== null} />
            </div>
          </div>

        </div>
        {children}
      </main>
      <LoomFlowsWidget accessToken="c1bacc70-40ad-4c40-97ac-295e6ac630f2" />
    </>
  )
}