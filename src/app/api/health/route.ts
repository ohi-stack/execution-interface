import { accJson } from '@/lib/api';

export const dynamic = 'force-dynamic';

export function GET() {
  return accJson({ ok: true, status: 'healthy', surface: 'operator-interface' });
}
