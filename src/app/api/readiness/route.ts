import { accJson } from '@/lib/api';
import { consoleModules } from '@/lib/acc-content';

export const dynamic = 'force-dynamic';

export function GET() {
  return accJson({ ready: true, modules: consoleModules.map(({ title, href, status }) => ({ title, href, status })) });
}
