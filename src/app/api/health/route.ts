import { appJson } from '@/lib/api';

export const dynamic = 'force-dynamic';

export function GET() {
  return appJson({ ok: true, status: 'healthy', surface: 'public-member-gateway' });
}
