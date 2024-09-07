"use client"
import { Button } from "@/components/ui/button";
import { usePathname, Link } from '@/i18n/routing';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales, SupportedLangs } from '@/i18n/types';
import { LanguagesIcon } from "lucide-react";

export default function LanguageDropdown() {
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <LanguagesIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale: SupportedLangs) => (
          <DropdownMenuItem key={locale} asChild>
            <Link href={pathname} locale={locale}>
              {getLanguageName(locale)}
            </Link>
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
