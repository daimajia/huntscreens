import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const middleware = createMiddleware(routing);

function detectSearchEngine(userAgent: string): string | null {
  const searchEngines = [
    { name: 'Googlebot', pattern: /Googlebot/ },
    { name: 'Bingbot', pattern: /Bingbot/ },
    { name: 'Baiduspider', pattern: /Baiduspider/ },
    { name: 'YandexBot', pattern: /YandexBot/ },
    { name: 'DuckDuckBot', pattern: /DuckDuckBot/ },
    { name: 'Slurp', pattern: /Slurp/ }, // Yahoo's bot
    { name: 'Sogou', pattern: /Sogou/ },
    { name: 'AhrefsBot', pattern: /AhrefsBot/ },
    { name: 'SemrushBot', pattern: /SemrushBot/ },
    { name: 'Naverbot', pattern: /Naverbot/ },
  ];

  for (const engine of searchEngines) {
    if (engine.pattern.test(userAgent)) {
      return engine.name;
    }
  }

  return null;
}

export default async function customMiddleware(request: NextRequest) {
  console.log(`Current request URL: ${request.url}`);

  const userAgent = request.headers.get('user-agent') || '';
  const searchEngine = detectSearchEngine(userAgent);
  if (searchEngine) {
    console.log(`Detected search engine crawler: ${searchEngine}`);
  }

  const pathname = request.nextUrl.pathname;

  if (/^\/(p|indiehackers|startup\/yc|taaft)\//.test(pathname)) {
    const newUrl = new URL(`/en${pathname}`, request.url);    
    return NextResponse.redirect(newUrl, 301);
  }

  return middleware(request);
}

export const config = {
  matcher: [
    '/', 
    '/(en|zh|es|ar|hi|pt|ja|ru|id|tr)/:path*', 
    '/(p|indiehackers|startup/yc|taaft|topic|category)/:path*',
    '/search/:path*',
    '/favorites',
    '/email/:path*'
  ]
};