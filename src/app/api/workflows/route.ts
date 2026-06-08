import { accJson } from '@/lib/api';

export const dynamic = 'force-dynamic';

export function GET() {
  return accJson({ resource: 'workflows', authoritative: false, note: 'ACC exposes operator-facing read models only; authority remains with external services.' });
}
