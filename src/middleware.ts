import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const APP_ALLOWED = new Set([
  '/',
  '/dashboard',
  '/ecosystem',
  '/omos',
  '/registry',
  '/tools',
  '/members',
  '/certificates',
  '/products',
  '/media',
  '/settings',
  '/docs',
  '/api/health',
  '/api/manifest',
  '/api/tools',
  '/api/stats'
]);

const CONSOLE_ALLOWED_PREFIXES = ['/admin','/dashboard','/agents','/tasks','/workflows','/ocp','/oeg','/adapters','/approvals','/audit','/logs','/settings','/status','/api/health','/api/manifest','/api/agents','/api/tasks','/api/workflows','/api/ocp/authorize','/api/oeg/execute','/api/audit'];

function roleForRequest(req: NextRequest): 'member' | 'operator' | 'admin' {
  const role = req.headers.get('x-onegodian-role') || req.cookies.get('onegodian_role')?.value || 'member';
  return role === 'admin' || role === 'operator' ? role : 'member';
}

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  const path = req.nextUrl.pathname;
  const role = roleForRequest(req);


  if (host.startsWith('qrv.network') || host.startsWith('www.qrv.network')) {
    if (path === '/') return NextResponse.next();
    if (path === '/health.json') {
      return NextResponse.rewrite(new URL('/api/system-health', req.url));
    }
    return NextResponse.next();
  }
  if (host.startsWith('app.onegodian.com')) {
    if (![...APP_ALLOWED].some((p) => path === p || path.startsWith(`${p}/`))) {
      return NextResponse.rewrite(new URL('/dashboard', req.url));
    }
    if (role === 'operator' || role === 'admin') {
      const res = NextResponse.next();
      res.headers.set('x-onegodian-surface', 'app');
      return res;
    }
  }

  if (host.startsWith('console.onegodian.com')) {
    if (path === '/' || path === '') return NextResponse.redirect(new URL('/admin', req.url));
    if (!CONSOLE_ALLOWED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) {
      return NextResponse.rewrite(new URL('/admin', req.url));
    }
    if (path !== '/admin' && !path.startsWith('/admin/')) {
      return NextResponse.rewrite(new URL(`/admin${path}`, req.url));
    }
    if (role !== 'operator' && role !== 'admin') {
      return NextResponse.json({ error: 'operator_or_admin_required' }, { status: 403 });
    }
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.headers.set('x-onegodian-surface', 'console');
    return res;
  }

  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };
