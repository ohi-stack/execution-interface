import { accJson } from '@/lib/api';

export const dynamic = 'force-dynamic';

export function GET() {
  return accJson({ resource: 'tasks', authoritative: false, note: 'ACC exposes operator-facing read models only; authority remains with external services.' });
}
