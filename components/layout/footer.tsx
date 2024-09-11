/* eslint-disable @next/next/no-img-element */
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Home");
  return (
    <footer className="bg-white rounded-lg dark:bg-gray-900 mt-10">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className=" flex flex-col gap-2">
            <a href="/" className="flex items-center mb-4 sm:mb-0">
              <picture>
                <img src="/logo.png" alt="HuntScreens Logo" className="h-10 block dark:hidden" />
                <img src="/dark-logo.png" alt="HuntScreens Logo" className="h-10 hidden dark:block" />
              </picture>
            </a>
            <span className=" text-gray-500 dark:text-gray-400">
                {t('description')}
            </span>
            <div className="mt-5">
              <a href="https://www.producthunt.com/posts/huntscreens?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-huntscreens" target="_blank" rel="noopener noreferrer">
                <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=478742&theme=light" alt="HuntScreens - Visually&#0032;Discover&#0032;Latest&#0032;Products&#0032;and&#0032;Startups&#0046; | Product Hunt" style={{ width: '250px', height: '54px' }} width="250" height="54" />
              </a>
            </div>
          </div>
          <div className="flex gap-20">
            <ul className="flex flex-col items-start mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400 gap-5">
              <li>
                <a rel="noopener" href="/" className="hover:underline mb-2">ProductHunt</a>
              </li>
              <li>
                <a rel="noopener" href="/indiehackers" className="hover:underline mb-2">IndieHackers</a>
              </li>
              <li>
                <a rel="noopener" href="/startup/yc" className="hover:underline">Y Combinator</a>
              </li>
            </ul>
            <ul className="flex flex-col items-start mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400 gap-5">
              <li>
                <a rel="noopener" href="https://www.producthunt.com/products/huntscreens" target="_blank" className="hover:underline mb-2">About</a>
              </li>
              <li>
                <a rel="noopener" href="https://github.com/daimajia/huntscreens" target="_blank" className="hover:underline">Open Source</a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-5000 sm:text-center dark:text-gray-400">
          © {new Date().getFullYear()} <a href="https://huntscreens.com" className="hover:underline">HuntScreens</a>. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}