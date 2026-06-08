import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_API_PATHS = new Set(['/api/health', '/api/manifest', '/api/readiness', '/api/version']);

function roleForRequest(req: NextRequest): 'member' | 'operator' | 'admin' {
  const role = req.headers.get('x-onegodian-role') || req.cookies.get('onegodian_role')?.value || 'member';
  return role === 'admin' || role === 'operator' ? role : 'member';
}

function withAccHeaders(response: NextResponse) {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('x-onegodian-surface', 'acc');
  response.headers.set('x-acc-authority', 'interface-only');
  return response;
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const role = roleForRequest(req);

  if (PUBLIC_API_PATHS.has(path)) {
    return withAccHeaders(NextResponse.next());
  }

  if (path.startsWith('/api/') && role !== 'operator' && role !== 'admin') {
    return withAccHeaders(NextResponse.json({ error: 'operator_or_admin_required' }, { status: 403 }));
  }

  const response = NextResponse.next();
  return withAccHeaders(response);
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };
