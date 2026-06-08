import { accJson } from '@/lib/api';

export const dynamic = 'force-dynamic';

export function GET() {
  return accJson({ version: process.env.NEXT_PUBLIC_ACC_VERSION ?? '1.0.0' });
}
