import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { roleRank, type Role } from '@/data/platform';

const PUBLIC_API_PATHS = new Set([
  '/api/health', '/api/ready', '/api/readiness', '/api/manifest', '/api/version', '/api/tools', '/api/stats',
  '/api/sync/status', '/api/webhooks/wordpress', '/api/webhooks/plugin', '/api/integrations', '/api/auth/login',
]);

function withAppHeaders(response: NextResponse) {
  response.headers.set('x-ino-surface', 'ino-platform-sync-node');
  response.headers.set('strict-transport-security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-frame-options', 'DENY');
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  return response;
}
function sessionRole(req: NextRequest): Role | null { const token=req.cookies.get('omos_session')?.value; if(!token) return null; try { const [payload]=token.split('.'); const session=JSON.parse(Buffer.from(payload,'base64url').toString()) as {role:Role;expiresAt:number}; return session.expiresAt>Date.now()?session.role:null } catch { return null } }
function redirectLogin(req: NextRequest){return NextResponse.redirect(new URL('/login', req.url));}
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (process.env.NODE_ENV === 'production' && req.nextUrl.protocol !== 'https:') return withAppHeaders(NextResponse.redirect(new URL(`https://${req.headers.get('host')}${path}`, req.url)));
  if (path.startsWith('/dashboard')) { const role=sessionRole(req); if(!role || roleRank[role]<roleRank.member) return withAppHeaders(redirectLogin(req)); }
  if (path.startsWith('/admin')) { const role=sessionRole(req); if(!role || roleRank[role]<roleRank.operator) return withAppHeaders(NextResponse.redirect(new URL('/login?required=operator', req.url))); }
  if (PUBLIC_API_PATHS.has(path) || path.startsWith('/api/jobs/') || !path.startsWith('/api/')) return withAppHeaders(NextResponse.next());
  return withAppHeaders(NextResponse.json({ error: 'api_route_not_public', surface: 'ino-platform-sync-node' }, { status: 404 }));
}
export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };
