export const appMeta = {
  eyebrow: 'APP.ONEGODIAN.COM · MEMBER APP',
  title: 'OneGodian App',
  description:
    'The unified command dashboard for OneGodian apps, plugins, registries, certificates, campaigns, media, tools, and ecosystem operations.',
  primaryCta: { label: 'Open Dashboard', href: '/dashboard' },
  secondaryCta: { label: 'View Ecosystem', href: '/ecosystem' }
};

export const appNavigation = [
  { label: 'Dashboard', href: '/dashboard' }, { label: 'Ecosystem', href: '/ecosystem' }, { label: 'Registry', href: '/registry' },
  { label: 'Tools', href: '/tools' }, { label: 'Members', href: '/members' }, { label: 'Certificates', href: '/certificates' },
  { label: 'Products', href: '/products' }, { label: 'Media', href: '/media' }, { label: 'Settings', href: '/settings' }, { label: 'Docs', href: '/docs' }
];

export const consoleNavigation = [
  { label: 'Admin', href: '/admin' }, { label: 'Dashboard', href: '/dashboard' }, { label: 'Agents', href: '/agents' },
  { label: 'Tasks', href: '/tasks' }, { label: 'Workflows', href: '/workflows' }, { label: 'OCP', href: '/ocp' },
  { label: 'OEG', href: '/oeg' }, { label: 'Audit', href: '/audit' }, { label: 'Logs', href: '/logs' }, { label: 'Status', href: '/status' }
];

export const ecosystemLinks = [
  { label: 'OneGodian.org', href: 'https://onegodian.org' }, { label: 'OneGodian.com', href: 'https://onegodian.com' }, { label: 'University', href: 'https://u.onegodian.org' },
  { label: 'Galaxy Console', href: 'https://galaxy.onegodian.com' }, { label: 'Capital Portal', href: 'https://capital.onegodian.com' }, { label: 'OMOS', href: 'https://omos.onegodian.com' }
];

export const dashboardCards = [
  { title: 'App Structure', description: 'Review the standard OneGodian app structure across public pages, dashboards, admin screens, APIs, data, security, documentation, compliance, and deployment.', href: '/apps', status: 'Active' },
  { title: 'Plugins', description: 'Manage OneGodian plugins, commerce extensions, LMS tools, capital modules, media tools, and ecosystem bridges.', href: '/plugins', status: 'Active' },
  { title: 'Ecosystem', description: 'Access OneGodian.org, OneGodian.com, U OneGodian, Galaxy, Capital, OMOS, and connected properties.', href: '/ecosystem', status: 'Active' },
  { title: 'Certificates', description: 'View certificate records, verification metadata, member certificates, product certificates, and registry-linked documents.', href: '/certificates', status: 'Available' },
  { title: 'Registry', description: 'Access ODIN, OBP-1, product, system, certificate, and submission registries.', href: '/registry', status: 'Planned' },
  { title: 'Members', description: 'Access member tools, membership records, member IDs, onboarding, and profile functions.', href: '/members', status: 'Planned' },
  { title: 'Remember Campaign', description: 'Manage THE ONEGODIAN: Remember Campaign content, links, media assets, and campaign resources.', href: '/campaigns/remember', status: 'Live' },
  { title: 'API Status', description: 'Review runtime health, manifest endpoints, API bridge readiness, and deployment metadata.', href: '/api-status', status: 'Production Prep' }
];

export const appStructureLayers = ['Public App', 'Dashboard', 'Admin', 'API / Bridge', 'Data', 'Security', 'UI / UX', 'Documentation', 'Compliance', 'Deployment'];
export const coreRoutes = ['/dashboard', '/ecosystem', '/registry', '/tools', '/members', '/certificates', '/products', '/media', '/settings', '/docs', '/api/health', '/api/manifest', '/api/tools', '/api/stats'];

export const pluginCategories = [{ title: 'Core Platform Plugins', plugins: ['OneGodian Platform Plugin', 'OneGodian App Bridge Plugin', 'OneGodian Members Plugin', 'OneGodian Certificates Plugin', 'OneGodian Registry Plugin'] }, { title: 'Commerce Plugins', plugins: ['OneGodian Store Plugin', 'OneGodian Products Plugin', 'OneGodian Contributor Plugin', 'OneGodian Affiliate Plugin', 'OneGodian Capital Plugin'] }, { title: 'Education Plugins', plugins: ['U OneGodian LMS Plugin', 'OneGodian Courses Plugin', 'OneGodian Certificates for Learning Plugin', 'OneGodian Student Portal Plugin'] }, { title: 'Media & Campaign Plugins', plugins: ['OneGodian Media Center Plugin', 'Remember Campaign Plugin', 'OneGodian Creator Network Plugin', 'OneGodian Press Kit Plugin'] }, { title: 'Runtime / API Plugins', plugins: ['OneGodian API Bridge Plugin', 'OneGodian Tools Runtime Plugin', 'OneGodian Manifest Plugin', 'OneGodian Status Monitor Plugin'] }];

export const ecosystemPortals = [{ name: 'OneGodian.org', role: 'Official public identity and institutional site', url: 'https://onegodian.org' }, { name: 'OneGodian.com', role: 'Store, products, memberships, commerce, and public shopping platform', url: 'https://onegodian.com' }, { name: 'U OneGodian', role: 'Education, LMS, courses, certificates, and learning paths', url: 'https://u.onegodian.org' }, { name: 'Galaxy OneGodian', role: 'Galaxy console, planet navigator, planet stores, and immersive ecosystem layer', url: 'https://galaxy.onegodian.com' }, { name: 'Capital OneGodian', role: 'Corporate finance, disclosure, capital materials, and contributor/investor readiness', url: 'https://capital.onegodian.com' }, { name: 'OMOS OneGodian', role: 'OMOS protocol, specification, alignment system, and consciousness-centered operating model', url: 'https://omos.onegodian.com' }, { name: 'App OneGodian', role: 'Control plane tying every OneGodian property, app, plugin, registry, and dashboard together', url: 'https://app.onegodian.com' }];

export const rememberCampaign = { officialStartDate: 'May 9, 2026', onegodianDate: 'Wisdom 23, OT 0001', message: 'You were always One — you simply forgot. Remember who you are.', purpose: 'A public-facing awareness campaign centered on remembrance, identity, unity, origin, and shared human connection.', dashboardFunctions: ['Campaign overview', 'Campaign media', 'Store product links', 'Creator resources', 'Member participation tools', 'Social captions', 'Campaign status'] };

export const apiStatus = { app: 'OneGodian Control Plane', version: '0.1.0', buildMarker: '2026.05.16-prod', environment: 'Production', deploymentHost: 'Hostinger', framework: 'Next.js', nodeVersion: '20.x', repository: 'ohi-stack/execution-interface', branch: 'main', requiredEndpoints: ['/api/health', '/api/manifest', '/api/tools', '/api/stats'] };

export const footerSections = [
  { title: 'Control Plane', links: [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Apps', href: '/apps' }, { label: 'Plugins', href: '/plugins' }, { label: 'Registry', href: '/registry' }] },
  { title: 'Ecosystem', links: [{ label: 'OneGodian.org', href: 'https://onegodian.org' }, { label: 'OneGodian.com', href: 'https://onegodian.com' }, { label: 'University', href: 'https://u.onegodian.org' }, { label: 'Capital', href: 'https://capital.onegodian.com' }] },
  { title: 'Operations', links: [{ label: 'Certificates', href: '/certificates' }, { label: 'Members', href: '/members' }, { label: 'Tools', href: '/tools' }, { label: 'API Status', href: '/api-status' }] }
];

export const systemsModel = [
  { title: 'Control Plane', items: ['Dashboard', 'Apps', 'Plugins', 'Registry'] },
  { title: 'Operations', items: ['Members', 'Certificates', 'Tools', 'Media'] },
  { title: 'Runtime', items: ['API Status', 'Manifest', 'Health', 'Stats'] }
];

export const appStatus = { app: 'OneGodian Control Plane', appUrl: 'https://app.onegodian.com', store: 'https://onegodian.com', publicSite: 'https://onegodian.org', api: 'https://app.onegodian.com/api/health', environment: 'Production', activeCampaign: 'THE ONEGODIAN: Remember Campaign', currentDateRecord: 'May 16, 2026' };
