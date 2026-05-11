export const onegodianAppMeta = {
  eyebrow: 'ONEGODIAN APP',
  title: 'Your OneGodian Command Dashboard',
  description:
    'Access your OneGodian identity, membership tools, certificates, systems, products, media, campaigns, and ecosystem dashboards from one unified app.',
  primaryCta: {
    label: 'Open Dashboard',
    href: '/dashboard'
  },
  secondaryCta: {
    label: 'Explore Ecosystem',
    href: '/ecosystem'
  }
};

export const appNavigation = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Systems Model', href: '/systems-model' },
  { label: 'Remember Campaign', href: '/campaigns/remember' },
  { label: 'Members', href: '/members' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Registry', href: '/registry' },
  { label: 'Tools', href: '/tools' },
  { label: 'Products', href: '/products' },
  { label: 'Media', href: '/media' },
  { label: 'Profile', href: '/profile' },
  { label: 'Settings', href: '/settings' },
  { label: 'Admin', href: '/admin' }
];

export const dashboardCards = [
  { title: 'My OneGodian Profile', description: 'View identity details, member status, and app access.', href: '/profile', status: 'Active' },
  { title: 'Membership', description: 'Access membership records, plans, benefits, and member tools.', href: '/members', status: 'Available' },
  { title: 'Certificates', description: 'View, verify, and manage OneGodian certificates.', href: '/certificates', status: 'Available' },
  { title: 'Remember Campaign', description: 'Access campaign tools, visuals, posts, and participation resources.', href: '/campaigns/remember', status: 'Live' },
  { title: 'Ecosystem', description: 'Navigate OneGodian systems, stores, education, media, and capital portals.', href: '/ecosystem', status: 'Expanded' },
  { title: 'Tools', description: 'Access system tools, generators, bridge functions, and app utilities.', href: '/tools', status: 'In Progress' },
  { title: 'Registry', description: 'Review ODIN, certificate, submission, and verification records.', href: '/registry', status: 'Planned' },
  { title: 'Media Center', description: 'Access campaign media, brand visuals, audio, videos, and press resources.', href: '/media', status: 'Available' }
];

export const ecosystemPortals = [
  { name: 'OneGodian Store', description: 'Commerce, products, apparel, books, memberships, and digital downloads.', url: 'https://onegodian.com', type: 'Store / Commerce' },
  { name: 'OneGodian Official Site', description: 'Public identity, writings, remembrance, articles, founder content, and public education.', url: 'https://onegodian.org', type: 'Public Site' },
  { name: 'University of OneGodian', description: 'Education, courses, certificates, learning paths, and curriculum.', url: 'https://u.onegodian.org', type: 'Education' },
  { name: 'OneGodian Capital', description: 'Capital portal, funding materials, financial instruments, and contributor onboarding.', url: 'https://capital.onegodian.com', type: 'Capital' },
  { name: 'OneGodian App', description: 'Dashboard, systems access, app bridge, tools, profile, and registry.', url: 'https://app.onegodian.com', type: 'Application' },
  { name: 'OneGodian API', description: 'Runtime API, bridge layer, system health, manifest, and tool endpoints.', url: 'https://api.onegodian.org', type: 'Runtime / API' }
];

export const rememberCampaign = {
  name: 'THE ONEGODIAN: Remember Campaign', officialStartDate: 'May 9, 2026', onegodianDate: 'Wisdom 23, OT 0001',
  purpose: 'A public-facing awareness campaign centered on remembrance, identity, unity, origin, and shared human connection.',
  coreMessage: 'You were always One — you simply forgot. Remember who you are.',
  primaryAudience: ['members', 'supporters', 'families', 'students', 'creators', 'faith-aligned participants', 'global OneGodian allies'],
  sections: [
    { title: 'Why', body: 'To remind people of shared origin, dignity, identity, and belonging through OneGodian remembrance.' },
    { title: 'What', body: 'A campaign using apparel, media, posts, videos, events, storefront displays, identity tools, and educational content.' },
    { title: 'Who', body: 'For members, supporters, learners, families, creators, institutions, and respectful observers of OneGodian principles.' },
    { title: 'When', body: 'Officially launched May 9, 2026 / Wisdom 23, OT 0001.' },
    { title: 'How', body: 'Through coordinated content, store products, member participation, campaign visuals, public education, and app-based dashboard access.' }
  ]
};

export const systemsModel = [
  { title: 'Identity Layer', items: ['Profile', 'Membership', 'OneGodian ID', 'Certificates', 'QR-V Verification'] },
  { title: 'Ecosystem Layer', items: ['Store', 'Education', 'Capital', 'Media', 'Products', 'Members'] },
  { title: 'Registry Layer', items: ['ODIN Registry', 'OBP-1 Records', 'Certificate Archive', 'Submission Logs'] },
  { title: 'Execution Layer', items: ['Tools', 'Runtime APIs', 'App Bridge', 'Agent Console', 'Status Checks'] },
  { title: 'Governance / Compliance Layer', items: ['Terms', 'IP Notices', 'System Records', 'Documentation', 'Audit Logs'] }
];

export const whatThisAppDoes = [
  'Connects members to OneGodian identity and membership tools.',
  'Provides access to certificates, verification, and registry records.',
  'Organizes OneGodian systems into one operational dashboard.',
  'Links the store, education platform, capital portal, media center, and public sites.',
  'Supports campaign execution for THE ONEGODIAN: Remember Campaign.',
  'Prepares the foundation for app bridge, agent tools, API runtime, and administrative control.'
];

export const appStatus = {
  environment: 'Production Preparation',
  appUrl: 'https://app.onegodian.com',
  publicSite: 'https://onegodian.org',
  store: 'https://onegodian.com',
  api: 'https://api.onegodian.org',
  activeCampaign: 'THE ONEGODIAN: Remember Campaign',
  currentDateRecord: 'Wisdom 25, OT 0001 / May 11, 2026'
};

export const footerLinks = [
  { label: 'OneGodian Store', href: 'https://onegodian.com' },
  { label: 'Official Site', href: 'https://onegodian.org' },
  { label: 'University', href: 'https://u.onegodian.org' },
  { label: 'Capital Portal', href: 'https://capital.onegodian.com' },
  { label: 'API Status', href: 'https://api.onegodian.org/api/health' }
];
