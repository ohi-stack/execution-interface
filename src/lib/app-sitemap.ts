import { routeStatusRows } from '@/lib/app-content';

export type AppRouteNode = {
  title: string;
  path: string;
  group: string;
  description: string;
  status: 'active' | 'planned';
  children?: AppRouteNode[];
};

export const appSitemap: AppRouteNode[] = routeStatusRows.map((route) => ({
  title: route.title,
  path: route.path,
  group: route.path.startsWith('/api') ? 'API' : 'Core',
  description: route.purpose,
  status: 'active'
}));
