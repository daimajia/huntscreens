import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'zh', 'es', 'ar', 'hi', 'pt', 'ja', 'ru', 'id', 'tr'] as const;
export const localeNames: Record<SupportedLangs, string> = {
  en: 'English',
  zh: 'Simplified Chinese',
  es: 'Spanish',
  ar: 'Arabic',
  hi: 'Hindi',
  pt: 'Portuguese',
  ja: 'Japanese',
  ru: 'Russian',
  id: 'Indonesian',
  tr: 'Turkish'
};

export type SupportedLangs = (typeof locales)[number];

export const defaultLocale: SupportedLangs = 'en';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: locales,
  // Used when no locale matches
  defaultLocale: defaultLocale
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation(routing);