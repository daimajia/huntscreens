import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
 
export default getRequestConfig(async ({locale}) => {
  if (!routing.locales.includes(locale as any)) notFound();
  try {
    return {
      messages: (await import(`./messages/${locale}.json`)).default
    };
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    throw error;
  }
});