import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, locales } from './i18n/routing';

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localeDetection: true
});

export default function middleware(req: NextRequest) {
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};