import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const middleware = createMiddleware(routing);

export default async function customMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (/^\/(p|indiehackers|startup\/yc|taaft)\//.test(pathname)) {
    const newUrl = new URL(`/en${pathname}`, request.url);    
    return NextResponse.redirect(newUrl, 301);
  }

  return middleware(request);
}

export const config = {
  matcher: ['/', '/(en|zh|es|ar|hi|pt|ja|ru|id|tr)/:path*', '/(p|indiehackers|startup/yc|taaft)/:path*']
};