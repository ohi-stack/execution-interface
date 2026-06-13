import { NextResponse } from 'next/server';
import { routes } from '@/data/omos-pages';
import { tools } from '@/data/tools';
import { statusModules } from '@/data/status';
export function GET() {
  const counts = statusModules.reduce<Record<string, number>>((acc, module) => { acc[module.status] = (acc[module.status] ?? 0) + 1; return acc; }, {});
  return NextResponse.json({ routeCount: routes.length, toolCount: tools.length, moduleCount: statusModules.length, statusCounts: counts });
}
