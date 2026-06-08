import { accJson, manifestPayload } from '@/lib/api';

export const dynamic = 'force-dynamic';

export function GET() {
  return accJson({ manifest: manifestPayload() });
}
