export const locales = ['en', 'zh', 'es', 'ar', 'hi', 'pt', 'ja', 'ru', 'id', 'tr'] as const;

export type SupportedLangs = (typeof locales)[number];

export const defaultLocale: SupportedLangs = 'en';

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