"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, usePathname } from "@/i18n/routing";
import { SupportedLangs } from "@/i18n/types";
import { useLocale } from "next-intl";
import categoriesData from '@/i18n/custom/categories.json';

type CategoryListProps = {
  onClick?: () => void;
}

export default function CategoryList({ onClick }: CategoryListProps) {
  const locale = useLocale() as SupportedLangs;
  const pathname = usePathname();
  return (
    <ScrollArea className="flex-grow overflow-y-auto no-scrollbar px-4">
      <div className="pb-10 flex flex-col">
        {categoriesData.map((category, index) => {
          const isActive = pathname.includes(`/category/${category.slug}`);
          return (
            <Link href={`/category/${category.slug}`} key={index} onClick={onClick}>
              <div className={`flex items-center justify-between py-2 pl-2 rounded-md transition-colors duration-200 ${isActive ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}>
                <div className="flex items-center">
                  <h3>
                    <span className="mr-3 text-lg">{category.emoji}</span>
                    <span className={`text-sm ${isActive ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                      }`}>{category.maincategory[locale]}</span>
                  </h3>
                </div>
                {/* <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">23</span> */}
              </div>
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}