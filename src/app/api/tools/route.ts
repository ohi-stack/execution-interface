import { appJson, toolsPayload } from '@/lib/api';

export const dynamic = 'force-dynamic';

export function GET() {
  return appJson(toolsPayload());
}
