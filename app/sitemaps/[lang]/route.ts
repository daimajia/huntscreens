import { db } from '@/db/db';
import { locales, SupportedLangs } from '@/i18n/types';
import { productTypes } from '@/types/product.types';
import { visibleProducts } from '@/db/schema/views/visible.products';
import { desc } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { lang: SupportedLangs } }
) {
  const { lang } = params;
  if (!locales.includes(lang)) {
    return new Response('Not found', { status: 404 });
  }

  const items = await db.select({
    slug: visibleProducts.slug,
    launch_date: visibleProducts.launched_at
  })
  .from(visibleProducts);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${items.map(item => `
    <url>
      <loc>https://huntscreens.com/${lang}/products/${item.slug}</loc>
      <lastmod>${item.launch_date || new Date().toISOString()}</lastmod>
      ${locales.map(locale => `
        <xhtml:link 
           rel="alternate" 
           hreflang="${locale}" 
           href="https://huntscreens.com/${locale}/products/${item.slug}"
        />`).join('')}
    </url>
  `).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    },
  });
}

export async function generateStaticParams() {
  return productTypes.flatMap(category => 
    locales.map(lang => ({
      category,
      lang
    }))
  );
}