import { appJson } from '@/lib/api';
import { appPositioning } from '@/lib/acc-content';

export const dynamic = 'force-dynamic';

export function GET() {
  return appJson({ version: process.env.NEXT_PUBLIC_APP_VERSION ?? appPositioning.version });
}
