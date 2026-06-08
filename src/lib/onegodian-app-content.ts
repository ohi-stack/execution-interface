export type OneGodianModule = {
  title: string;
  description: string;
  status: string;
  route: string;
};

export type DomainRole = {
  domain: string;
  role: string;
  url: string;
};

export const appName = 'OneGodian App';
export const appVersion = '1.4.0-real-ecosystem';
export const appPositioning =
  'The OneGodian App™ — the public and member-facing gateway for OneGodian identity, education, membership, tools, certificates, products, media, and ecosystem access.';
export const appDomainRole = 'public/member-facing app gateway';

export const productionDomainRoles: DomainRole[] = [
  { domain: 'app.onegodian.com', role: 'Public/member product surface for identity, membership, certificates, media, tools, and ecosystem access.', url: 'https://app.onegodian.com' },
  { domain: 'console.onegodian.com', role: 'Operator/admin runtime surface for internal operations and administration.', url: 'https://console.onegodian.com' },
  { domain: 'capital.onegodian.com', role: 'Capital operations surface for capital workflows and disclosure-aware operations.', url: 'https://capital.onegodian.com' },
  { domain: 'onegodian.org', role: 'Identity, education, community, public documentation, and ecosystem explanation.', url: 'https://onegodian.org' },
  { domain: 'onegodian.com', role: 'Commerce, products, services, memberships, and payment checkout.', url: 'https://onegodian.com' }
];

export const appRoutes = [
  '/',
  '/dashboard',
  '/members',
  '/contributors',
  '/creator-network',
  '/affiliate-dashboard',
  '/referral-links',
  '/contributor-wall',
  '/certificates',
  '/products',
  '/media',
  '/learning',
  '/registry',
  '/tools',
  '/settings',
  '/ecosystem'
];

export const pluginBridgeShortcodes = [
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

export const homepageSections: OneGodianModule[] = [
  { title: 'OneGodian Identity', description: 'Identity explanations, public meaning, member context, and clear links into OneGodian.org education and documentation.', status: 'Live', route: '/members' },
  { title: 'Membership', description: 'Membership CTA, pricing, resources, certificates, dashboard access, and member support bridged from the WordPress plugin.', status: 'Plugin bridge', route: '/members' },
  { title: 'Contributors', description: 'Voluntary support pathways for products, education, media, technology, membership, and community infrastructure.', status: 'Live content', route: '/contributors' },
  { title: 'Creator Network', description: 'A public pathway for creators, affiliates, educators, and community voices to share campaigns and resources.', status: 'Intake ready', route: '/creator-network' },
  { title: 'Affiliate Program', description: 'Affiliate dashboard structure for referral links, campaign assets, contributor products, creator updates, and compliance notices.', status: 'Structured', route: '/affiliate-dashboard' },
  { title: 'Certificates', description: 'Member certificates, completion records, certificate references, and verification-oriented access.', status: 'Live', route: '/certificates' },
  { title: 'Products', description: 'Product and service discovery for the commerce layer with checkout routed to OneGodian.com.', status: 'Commerce bridge', route: '/products' },
  { title: 'Media', description: 'Media assets, videos, campaign content, creator updates, and public communication resources.', status: 'Live', route: '/media' },
  { title: 'Tools', description: 'Member and public tools for reflection, records, registry lookup, referrals, and ecosystem navigation.', status: 'Live', route: '/tools' },
  { title: 'Education', description: 'Educational resources, membership learning, community documentation, and links to OneGodian.org.', status: 'Org bridge', route: '/learning' },
  { title: 'Ecosystem', description: 'Domain map for app, console, capital, .org identity/community, and .com commerce/payment surfaces.', status: 'Current', route: '/ecosystem' }
];

export const dashboardModules: OneGodianModule[] = [
  { title: 'Members', description: 'Membership CTA, pricing, resources, certificates, dashboard access, and support for member-facing activity.', status: 'Open', route: '/members' },
  { title: 'Contributors', description: 'Voluntary contribution tiers and public support language for ONEGODIAN, LLC infrastructure.', status: 'Live', route: '/contributors' },
  { title: 'Creator Network', description: 'Creator, affiliate, educator, and community voice intake for sharing OneGodian resources and campaigns.', status: 'Apply', route: '/creator-network' },
  { title: 'Affiliate Dashboard', description: 'Affiliate structure for referral links, campaign assets, contributor products, creator updates, and compliance notices.', status: 'Scaffolded', route: '/affiliate-dashboard' },
  { title: 'Referral Links', description: 'Referral link surface for future creator and affiliate links without payment or commission logic.', status: 'Bridge ready', route: '/referral-links' },
  { title: 'Contributor Wall', description: 'Recognition surface for voluntary supporters when approved contributor data is available.', status: 'Content ready', route: '/contributor-wall' },
  { title: 'Certificates', description: 'Member certificates and record references with plugin bridge support for certificate displays.', status: 'Live', route: '/certificates' },
  { title: 'Products', description: 'Product categories, memberships, downloads, certificates, and services routed to OneGodian.com commerce.', status: 'Commerce', route: '/products' },
  { title: 'Media', description: 'Media center for educational clips, campaign assets, videos, and shareable ecosystem content.', status: 'Live', route: '/media' },
  { title: 'Learning', description: 'Education bridge for identity resources, membership learning, documentation, and community education.', status: 'Org bridge', route: '/learning' },
  { title: 'Registry', description: 'Registry pathways for certificates, records, identifiers, ODIN references, and verification links.', status: 'Live', route: '/registry' },
  { title: 'Tools', description: 'Tools for ecosystem navigation, certificate lookup, member resources, referrals, and public utilities.', status: 'Live', route: '/tools' },
  { title: 'Settings', description: 'Profile, preferences, privacy, notification, and connected service settings for app access.', status: 'Available', route: '/settings' }
];

export const contributorTiers = [
  { name: 'Supporter', amount: '$11' },
  { name: 'Builder', amount: '$33' },
  { name: 'Sustainer', amount: '$77' },
  { name: 'Founder Circle', amount: '$111' },
  { name: 'Infrastructure Partner', amount: '$333+' },
  { name: 'Custom Contribution', amount: 'Any amount' }
];

export const contributorDescription =
  'Contributors support ONEGODIAN, LLC public-facing products, education, media, technology, membership, and community infrastructure.';

export const contributorLegalNotice =
  'Contributions are voluntary support payments. They are not equity, securities, loans, bonds, investment contracts, or promises of financial return.';

export const membershipShortcodeMap = [
  { label: 'Membership CTA', shortcode: '[onegodian_membership_cta]', description: 'Primary member enrollment and interest call-to-action.' },
  { label: 'Membership Pricing', shortcode: '[onegodian_members_pricing]', description: 'Current member pricing display from the WordPress membership bridge.' },
  { label: 'Membership Resources', shortcode: '[onegodian_membership_resources]', description: 'Member guides, downloads, and educational resources.' },
  { label: 'Member Certificates', shortcode: '[onegodian_member_certificates]', description: 'Member certificate and record display surface.' },
  { label: 'Member Dashboard', shortcode: '[onegodian_member_dashboard]', description: 'Member activity, resources, and dashboard bridge.' },
  { label: 'Member Support', shortcode: '[onegodian_member_support]', description: 'Support and help pathway for members.' }
];

export const affiliateDashboardItems = [
  'Referral Link',
  'Campaign Assets',
  'Contributor Products',
  'Creator Updates',
  'Compliance Notice',
  'Application Status'
];
