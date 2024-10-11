import { locales } from '@/i18n/types';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemaps = locales.flatMap(lang => [
      {
        url: `https://huntscreens.com/sitemaps/${lang}`,
        lastModified: new Date()
      }
    ]);

  const homepages = locales.map(lang => ({
    url: `https://huntscreens.com/${lang}`,
    lastModified: new Date()
  }));

  return [
    {
      url: "https://huntscreens.com",
      lastModified: new Date()
    },
    ...homepages,
    ...sitemaps
  ];
}