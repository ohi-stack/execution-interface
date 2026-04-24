import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getEnv } from '@/lib/env';

const env = getEnv();

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let match = 0;
  for (let i = 0; i < a.length; i += 1) {
    match |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return match === 0;
}

export function middleware(req: NextRequest) {
  const isAdminPath =
    req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin');

  if (!isAdminPath) {
    return NextResponse.next();
  }

  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';

  if (!token || !safeEqual(token, env.ADMIN_API_TOKEN)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
