"use client"
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales, SupportedLangs } from '@/i18n/routing';
import { GlobeIcon } from 'lucide-react';

export default function LanguageDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as SupportedLangs;

  const handleLanguageChange = (newLocale: SupportedLangs) => {
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <GlobeIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale)}
          >
            {getLanguageName(locale)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getLanguageName(locale: SupportedLangs): string {
  const languageNames: { [key in SupportedLangs]: string } = {
    en: 'English',
    zh: '中文',
    es: 'Español',
    ar: 'العربية',
    hi: 'हिन्दी',
    pt: 'Português',
    ja: '日本語',
    ru: 'Русский',
    id: 'Bahasa Indonesia',
    tr: 'Türkçe'
  };
  return languageNames[locale];
}
