export const publicNavigation = [
  { label: 'OMOS', href: '/' }, { label: 'OHI', href: '/ohi-pipeline' }, { label: 'Models', href: '/models' },
  { label: 'Tools', href: '/tools' }, { label: 'Artifacts', href: '/artifacts' }, { label: 'Docs', href: '/docs' }, { label: 'Shop', href: '/shop' }
] as const;
export const openConsoleHref = '/dashboard';
export const roles = ['visitor','member','developer','editor','operator','administrator'] as const;
export type Role = typeof roles[number];
export const roleRank: Record<Role, number> = { visitor:0, member:1, developer:2, editor:3, operator:4, administrator:5 };
export const dashboardRoutes = [
  "/dashboard",
  "/dashboard/overview",
  "/dashboard/identity",
  "/dashboard/tools",
  "/dashboard/artifacts",
  "/dashboard/downloads",
  "/dashboard/activity",
  "/dashboard/protocol-status",
  "/dashboard/agent-registry",
  "/dashboard/alignment-verification",
  "/dashboard/credentials",
  "/dashboard/settings"
] as const;
export const adminRoutes = [
  "/admin",
  "/admin/content",
  "/admin/pages",
  "/admin/navigation",
  "/admin/artifacts",
  "/admin/tools",
  "/admin/models",
  "/admin/prompts",
  "/admin/registry",
  "/admin/verification",
  "/admin/users",
  "/admin/roles",
  "/admin/api-keys",
  "/admin/integrations",
  "/admin/plugin-sync",
  "/admin/system-health",
  "/admin/logs",
  "/admin/audit",
  "/admin/settings"
] as const;
export const settingsGroups = ['General','Branding','Navigation','Authentication','Runtime/API','Integrations','Content/Artifacts','Compliance','Time/Records','Notifications','Logs','Import/Export'] as const;
export const runtimeStatus = { runtimeHealth: 'nominal', manifestVersion: '1.2.0', routeCount: dashboardRoutes.length + adminRoutes.length + publicNavigation.length + 22, toolCount: 12, artifactCount: 8, modelProviderStatus: 'configured by environment', wordpressPluginTargets: ['onegodian-members','omos-site-bridge'], lastSyncUtc: '2026-07-12T00:00:00Z', deploymentStatus: 'production-ready pending secret injection', recentActivity: ['Route manifest expanded','RBAC middleware enabled','Mobile drawer navigation installed'], productionWarnings: ['Set OMOS_SESSION_SECRET before deployment','Create initial administrator with password hash out-of-band'], quickActions: ['Review audit log','Sync plugin targets','Validate settings','Rotate API keys'] } as const;
export const privilegedRuntimeControls = ['/admin/system-health','/admin/plugin-sync','/admin/api-keys','/admin/logs'] as const;
