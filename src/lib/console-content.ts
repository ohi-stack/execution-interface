export const consoleHomeHero = {
  eyebrow: 'CONSOLE.ONEGODIAN.COM',
  title: 'OneGodian Console',
  description:
    'The internal command console for managing OneGodian apps, plugins, APIs, registries, deployments, system health, and operational workflows.',
  primaryCta: {
    label: 'Open Console',
    href: '/dashboard'
  },
  secondaryCta: {
    label: 'View System Status',
    href: '/status'
  }
};

export const consoleNavigation = [
  { label: 'Console Dashboard', href: '/dashboard' },
  { label: 'Apps', href: '/apps' },
  { label: 'Plugins', href: '/plugins' },
  { label: 'API Status', href: '/api-status' },
  { label: 'Registry Admin', href: '/registry' },
  { label: 'Certificate Admin', href: '/certificates' },
  { label: 'Members Admin', href: '/members' },
  { label: 'Deployments', href: '/deployments' },
  { label: 'System Health', href: '/status' },
  { label: 'Logs', href: '/logs' },
  { label: 'Admin', href: '/admin' },
  { label: 'Settings', href: '/settings' }
];


export const consoleDashboardCards = [
  { title: 'Apps', description: 'Manage OneGodian apps, modules, route structures, deployment status, and app configuration.', href: '/apps', status: 'Active' },
  { title: 'Plugins', description: 'Manage platform plugins, WordPress bridges, app bridges, commerce tools, LMS tools, and registry extensions.', href: '/plugins', status: 'Active' },
  { title: 'API Status', description: 'Monitor API health, manifest output, runtime tools, bridge endpoints, and system stats.', href: '/api-status', status: 'Production Prep' },
  { title: 'Deployments', description: 'Review deployment metadata, GitHub commits, Hostinger status, branch state, and build markers.', href: '/deployments', status: 'Live' },
  { title: 'Registry Admin', description: 'Manage ODIN, OBP-1, certificate, product, member, and system registry records.', href: '/registry', status: 'Planned' },
  { title: 'System Health', description: 'Monitor app health, uptime checks, version files, active environments, and runtime alerts.', href: '/status', status: 'Active' }
];

export const consoleFooterBoundary =
  'OneGodian Console is the internal administrative and operational command system for OneGodian apps, plugins, APIs, registries, deployments, and system health.';
