import { useTranslations } from "next-intl";
import Link from "next/link";

type FooterProps = {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const t = useTranslations("Home");
  return (
    <footer className={`rounded-lg mt-10 px-4 ${className}`}>
      <div className="w-full mx-auto py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 mb-8 sm:mb-0">
            <a href="/" className="flex items-center mb-4 sm:mb-0">
              <picture>
                <img src="/logo.png" alt="HuntScreens Logo" className="h-10 block dark:hidden" />
                <img src="/dark-logo.png" alt="HuntScreens Logo" className="h-10 hidden dark:block" />
              </picture>
            </a>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('description')}
            </span>
            <div className="mt-5">
              <Link href="https://www.producthunt.com/posts/huntscreens?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-huntscreens" target="_blank" rel="noopener noreferrer">
                <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=478742&theme=light" alt="HuntScreens - Visually&#0032;Discover&#0032;Latest&#0032;Products&#0032;and&#0032;Startups&#0046; | Product Hunt" style={{ width: '250px', height: '54px' }} width="250" height="54" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-20">
            <ul className="flex flex-col items-start text-sm font-medium text-gray-500 dark:text-gray-400 gap-4">
              <li>
                <a rel="noopener" href="https://www.producthunt.com/products/huntscreens" target="_blank" className="hover:underline mb-2">About</a>
              </li>
              <li>
                <a rel="noopener" href="https://github.com/daimajia/huntscreens" target="_blank" className="hover:underline">Open Source</a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-8 border-gray-200 dark:border-gray-700" />
        <span className="block text-sm text-gray-500 text-center dark:text-gray-400">
          © {new Date().getFullYear()} <a href="https://huntscreens.com" className="hover:underline">HuntScreens</a>. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}