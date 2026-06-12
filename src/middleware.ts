import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_API_PATHS = new Set(['/api/health', '/api/manifest', '/api/readiness', '/api/version', '/api/tools', '/api/stats']);

function withAppHeaders(response: NextResponse) {
  response.headers.set('x-onegodian-surface', 'app');
  response.headers.set('x-onegodian-domain-role', 'public-member-facing-gateway');
  return response;
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (PUBLIC_API_PATHS.has(path) || !path.startsWith('/api/')) {
    return withAppHeaders(NextResponse.next());
  }

  return withAppHeaders(NextResponse.json({ error: 'api_route_not_public', surface: 'app.onegodian.com' }, { status: 404 }));
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };
