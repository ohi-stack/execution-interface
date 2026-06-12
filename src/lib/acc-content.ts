export type AppStatus = 'live' | 'available' | 'plugin-bridge' | 'coming-soon';
export type AccStatus = AppStatus;

export const appRepository = {
  owner: 'ohi-stack',
  name: 'onegodian-app-deploy',
  url: 'https://github.com/ohi-stack/onegodian-app-deploy',
  deployTarget: 'https://app.onegodian.com',
  canonicalHost: 'app.onegodian.com'
};

export const domainStructure = [
  { host: 'app.onegodian.com', role: 'Public/member-facing gateway for identity, education, membership, tools, certificates, products, media, and ecosystem access.' },
  { host: 'console.onegodian.com', role: 'Operator/admin runtime surface.' },
  { host: 'capital.onegodian.com', role: 'Capital operations.' },
  { host: 'onegodian.org', role: 'Identity, education, community, and documentation.' },
  { host: 'onegodian.com', role: 'Commerce, products, services, and payments.' }
];

export const appPositioning = {
  name: 'OneGodian App',
  shortName: 'OneGodian App™',
  version: '1.1.0',
  eyebrow: 'PUBLIC & MEMBER-FACING GATEWAY',
  summary:
    'The OneGodian App™ — the public and member-facing gateway for OneGodian identity, education, membership, tools, certificates, products, media, and ecosystem access.',
  boundary:
    'The app presents public and member-facing experiences. It links to OneGodian.org for identity, education, community, and documentation, and to OneGodian.com for commerce, products, services, and payments. Contributions are not processed directly in this app unless a payment backend is connected.'
};

export const pluginShortcodes = [
  '[onegodian_membership_cta]',
  '[onegodian_members_pricing]',
  '[onegodian_membership_resources]',
  '[onegodian_member_certificates]',
  '[onegodian_member_dashboard]',
  '[onegodian_member_support]',
  '[onegodian_contributors_page]',
  '[onegodian_contributor_tiers]',
  '[onegodian_creator_network]',
  '[onegodian_affiliate_dashboard]',
  '[onegodian_referral_link]',
  '[onegodian_contributor_wall]',
  '[onegodian_contributor_disclaimer]'
];

export const homepageSections = [
  { title: 'OneGodian Identity', href: '/members', description: 'Member identity entry points, certificates, resources, and ecosystem access aligned with OneGodian.org.' },
  { title: 'Membership', href: '/members', description: 'Membership calls to action, pricing references, member resources, dashboard access, certificates, and support.' },
  { title: 'Contributors', href: '/contributors', description: 'Voluntary public support for products, education, media, technology, membership, and community infrastructure.' },
  { title: 'Creator Network', href: '/creator-network', description: 'A home for creators, affiliates, educators, and community voices who share OneGodian resources and campaigns.' },
  { title: 'Affiliate Program', href: '/affiliate-dashboard', description: 'Application-aware affiliate structure with referral links, campaign assets, updates, and compliance notices.' },
  { title: 'Certificates', href: '/certificates', description: 'Member certificate references and recognition pathways connected to the plugin bridge.' },
  { title: 'Products', href: '/products', description: 'Product discovery and commerce pathways that keep purchases on OneGodian.com.' },
  { title: 'Media', href: '/media', description: 'Public videos, updates, education media, campaigns, and creator-ready materials.' },
  { title: 'Tools', href: '/tools', description: 'Member and public utilities, resource links, and operational helpers exposed through the app surface.' },
  { title: 'Education', href: '/learning', description: 'Learning paths, community education, resources, and documentation linked to OneGodian.org.' },
  { title: 'Ecosystem', href: '/ecosystem', description: 'A domain-aware map of OneGodian public, commerce, operator, capital, and community surfaces.' }
];

export const dashboardModules = [
  { title: 'Members', href: '/members', status: 'plugin-bridge' as AppStatus, description: 'Membership CTA, pricing references, resources, certificates, member dashboard, and support entry points.' },
  { title: 'Contributors', href: '/contributors', status: 'available' as AppStatus, description: 'Voluntary support tiers and contributor information for public-facing OneGodian infrastructure.' },
  { title: 'Creator Network', href: '/creator-network', status: 'available' as AppStatus, description: 'Application gateway for creators, affiliates, educators, and community voices.' },
  { title: 'Affiliate Dashboard', href: '/affiliate-dashboard', status: 'coming-soon' as AppStatus, description: 'Structured affiliate workspace for referral links, campaign assets, updates, notices, and application status.' },
  { title: 'Referral Links', href: '/referral-links', status: 'coming-soon' as AppStatus, description: 'Reserved referral-link workspace connected to the WordPress plugin bridge; no earnings logic is active here.' },
  { title: 'Contributor Wall', href: '/contributor-wall', status: 'plugin-bridge' as AppStatus, description: 'Recognition surface for contributor acknowledgements when published by the plugin bridge.' },
  { title: 'Certificates', href: '/certificates', status: 'plugin-bridge' as AppStatus, description: 'Member certificate access and verification references powered by current membership shortcode work.' },
  { title: 'Products', href: '/products', status: 'available' as AppStatus, description: 'Product discovery with commerce and payment paths kept on OneGodian.com.' },
  { title: 'Media', href: '/media', status: 'available' as AppStatus, description: 'Media hub for education, campaigns, creator updates, community stories, and ecosystem announcements.' },
  { title: 'Learning', href: '/learning', status: 'available' as AppStatus, description: 'Education resources, learning paths, documentation, and community links aligned with OneGodian.org.' },
  { title: 'Registry', href: '/registry', status: 'available' as AppStatus, description: 'Public registry references for identity, certificates, modules, tools, and ecosystem records.' },
  { title: 'Tools', href: '/tools', status: 'live' as AppStatus, description: 'Member and public utility catalog returned by the app tools API and exposed through this gateway.' },
  { title: 'Settings', href: '/settings', status: 'live' as AppStatus, description: 'Member-facing app preferences, account links, domain guidance, and support routing.' }
];

export const contributorTiers = [
  { name: 'Supporter', amount: '$11' },
  { name: 'Builder', amount: '$33' },
  { name: 'Sustainer', amount: '$77' },
  { name: 'Founder Circle', amount: '$111' },
  { name: 'Infrastructure Partner', amount: '$333+' },
  { name: 'Custom Contribution', amount: 'Any amount' }
];

export const contributorNotice = 'Contributions are voluntary support payments. They are not equity, securities, loans, bonds, investment contracts, or promises of financial return.';

export const membershipShortcodeMap = [
  { label: 'Membership CTA', shortcode: '[onegodian_membership_cta]' },
  { label: 'Membership Pricing', shortcode: '[onegodian_members_pricing]' },
  { label: 'Membership Resources', shortcode: '[onegodian_membership_resources]' },
  { label: 'Member Certificates', shortcode: '[onegodian_member_certificates]' },
  { label: 'Member Dashboard', shortcode: '[onegodian_member_dashboard]' },
  { label: 'Member Support', shortcode: '[onegodian_member_support]' }
];

export const affiliateDashboardItems = [
  'Referral Link',
  'Campaign Assets',
  'Contributor Products',
  'Creator Updates',
  'Compliance Notice',
  'Application Status'
];

export const tools = [
  { name: 'Membership Bridge', href: '/members', description: 'Connects app visitors to membership CTA, pricing, resources, certificates, dashboard, and support.' },
  { name: 'Contributor Tiers', href: '/contributors', description: 'Displays voluntary support tiers and the required non-investment contributor notice.' },
  { name: 'Creator Network Application', href: '/creator-network', description: 'Routes creators, affiliates, educators, and community voices toward the Creator Network application.' },
  { name: 'Affiliate Structure', href: '/affiliate-dashboard', description: 'Shows referral, campaign, product, update, compliance, and application-status sections without payment logic.' },
  { name: 'Ecosystem Map', href: '/ecosystem', description: 'Clarifies the production roles for app, console, capital, .org, and .com domains.' }
];

// Backwards-compatible names used by existing components/pages during the app transition.
export const accRepository = appRepository;
export const accPositioning = appPositioning;
export const consoleModules = dashboardModules;
export const authorityServices = domainStructure.map((item) => ({ key: item.host, name: item.host, role: item.role, ownership: 'available' as AppStatus }));
export const separationRules = [
  'Use app.onegodian.com for public and member-facing access.',
  'Use console.onegodian.com for operator and admin runtime work.',
  'Use capital.onegodian.com for capital operations.',
  'Use OneGodian.org for identity, education, community, and documentation.',
  'Use OneGodian.com for commerce, products, services, and payments.',
  'Keep contributor language voluntary, non-investment, and non-securities.'
];
