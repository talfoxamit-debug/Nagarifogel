import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n';
import { ADMIN_COOKIE_NAME, verifySessionCookieValue } from '@/lib/adminAuth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const authed = await verifySessionCookieValue(cookie);

    if (pathname === '/admin/login') {
      if (authed) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    if (!authed) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next internals, the API, and static files.
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
