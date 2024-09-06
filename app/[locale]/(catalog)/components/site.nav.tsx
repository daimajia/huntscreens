"use client";
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { UpdateCount } from '@/lib/api/query.updatecount';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SiteNav({ updateCounts }: { updateCounts: UpdateCount }) {
  const t = useTranslations("Home");
  const navItems = [
    { name: t("just-launched"), href: '/', emoji: '🚀' },
    { name: 'ProductHunt', href: '/producthunt', icon: '/phlogo.png', emoji: '😺', countKey: 'PH' },
    { name: 'IndieHackers', href: '/indiehackers', icon: '/indiehackers.jpg', emoji: '💻', countKey: 'Indiehackers' },
    { name: 'YC', href: '/startup/yc', icon: '/yc.png', emoji: '🦄', countKey: 'YC' },
    { name: 'Taaft', href: '/taaft', icon: '/taaft.png', emoji: '🚀', countKey: 'TAAFT' },
  ];
  const currentPath = usePathname();
  
  const isActiveRoute = (href: string) => {
    const pathWithoutLocale = currentPath.split('/').slice(2).join('/');
    return href === '/' ? pathWithoutLocale === '' : pathWithoutLocale.startsWith(href.slice(1));
  };

  return (
    <nav className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm overflow-x-auto hidden md:flex whitespace-nowrap border">
      <ul className="flex space-x-2">
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.href);
          const itemUpdateCount = item.countKey ? updateCounts[item.countKey as keyof UpdateCount] : 0;
          return (
            <li key={item.name} className="inline-block">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gray-200/80 dark:bg-gray-700 text-primary"
                    : "hover:bg-gray-200/80 dark:hover:bg-gray-700"
                )}
              >
                {item.icon ? (
                  <Image
                    src={item.icon}
                    alt={`${item.name} icon`}
                    width={20}
                    height={20}
                    className="mr-2 rounded-full w-5 h-5"
                  />
                ) : (
                  <span className="mr-2">{item.emoji}</span>
                )}
                <span>{item.name}</span>
                {itemUpdateCount > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                    +{itemUpdateCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
