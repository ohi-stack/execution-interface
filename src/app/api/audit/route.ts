import { appJson } from '@/lib/api';

export const dynamic = 'force-dynamic';

export function GET() {
  return appJson({ resource: 'audit', authoritative: false, note: 'This legacy endpoint is not a payment, contribution, or securities workflow on the public OneGodian App surface.' });
}
