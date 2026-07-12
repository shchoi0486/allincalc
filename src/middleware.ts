import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, isLocale } from '@/i18n/config';

// 영어 우선 자동 판별: 쿠키 → Accept-Language(명시적 ko 최우선일 때만 ko) → 기본 en
function detectLocale(req: NextRequest): string {
  const cookie = req.cookies.get('locale')?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const accept = req.headers.get('accept-language') || '';
  const preferred = accept.split(',')[0]?.split(';')[0]?.trim().toLowerCase() || '';
  if (preferred.startsWith('ko')) return 'ko';
  return defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const segments = pathname.split('/');
  const maybeLocale = segments[1];

  // 이미 로케일 접두사가 있으면 통과
  if (maybeLocale && isLocale(maybeLocale)) {
    return NextResponse.next();
  }

  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // api, _next, 정적 파일, 그리고 비지역화 유틸 라우트는 제외
  matcher: [
    '/((?!api|_next|settings|materials|calculations|clear-cache|cache|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
  ],
};
