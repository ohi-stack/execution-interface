import { appJson } from '@/lib/api';
import { dashboardModules } from '@/lib/acc-content';

export const dynamic = 'force-dynamic';

export function GET() {
  return appJson({ ready: true, modules: dashboardModules.map(({ title, href, status }) => ({ title, href, status })) });
}
