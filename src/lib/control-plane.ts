export type PropertyCard = {
  key: string;
  title: string;
  role: string;
  domain: string;
  href: string;
  status: 'Operational' | 'Monitoring' | 'Needs Setup';
  health: string;
  description: string;
  checklist: string[];
  adminHref?: string;
};

export const ecosystemProperties: PropertyCard[] = [
  { key: 'org', title: 'Organization', role: 'Public identity / institutional home', domain: 'onegodian.org', href: 'https://onegodian.org', status: 'Operational', health: 'HTTP/SSL reachable', description: 'Public-facing organization site and institutional identity.', checklist: ['Brand/legal notices present', 'Public navigation validated', 'Member handoff links verified'], adminHref: '/admin' },
  { key: 'store', title: 'Store', role: 'Commerce platform', domain: 'onegodian.com', href: 'https://onegodian.com', status: 'Monitoring', health: 'Commerce bridge pending', description: 'Products, checkout operations, and economic catalog.', checklist: ['Catalog sync placeholder', 'Checkout route audit', 'Tax/compliance placeholders'] },
  { key: 'university', title: 'University', role: 'Education / LMS', domain: 'u.onegodian.com', href: 'https://u.onegodian.com', status: 'Monitoring', health: 'LMS plugins monitored', description: 'Curriculum, coursework, and educational membership pathways.', checklist: ['Course routes linked', 'Student/admin roles mapped', 'LMS API bridge placeholder'] },
  { key: 'galaxy', title: 'Galaxy', role: 'Planets / planet stores', domain: 'galaxy.onegodian.com', href: 'https://galaxy.onegodian.com', status: 'Operational', health: 'Registry connections live', description: 'Planetary navigation, lore modules, and planet store routing.', checklist: ['Planet registry synced', 'Public explore route available', 'Media module links verified'] },
  { key: 'capital', title: 'Capital', role: 'Corporate finance platform', domain: 'capital.onegodian.com', href: 'https://capital.onegodian.com', status: 'Monitoring', health: 'Finance endpoints placeholder', description: 'Funding, finance documents, contributor/investor interface.', checklist: ['Funding links listed', 'Compliance disclaimer visible', 'Capital REST placeholders configured'], adminHref: '/admin' },
  { key: 'omos', title: 'OMOS', role: 'Protocol/specification/alignment', domain: 'omos.onegodian.com', href: 'https://omos.onegodian.com', status: 'Operational', health: 'Bridge key + API proxy pattern enabled', description: 'Protocol docs, app bridge, and LLM gateway orchestration.', checklist: ['Manifest route available', 'Gateway status route exposed', 'Admin docs linked'], adminHref: '/omos' },
  { key: 'app', title: 'Control Plane App', role: 'Node command center', domain: 'app.onegodian.com', href: 'https://app.onegodian.com', status: 'Operational', health: 'Core pages and APIs online', description: 'Central dashboard linking all OneGodian properties.', checklist: ['Core routes built', 'Admin routes mapped', 'Production checklist published'], adminHref: '/dashboard' }
];

export const requiredEnvVars = [
  'NEXT_PUBLIC_APP_URL=https://app.onegodian.com',
  'NEXT_PUBLIC_ORG_URL=https://onegodian.org',
  'NEXT_PUBLIC_STORE_URL=https://onegodian.com',
  'NEXT_PUBLIC_UNIVERSITY_URL=https://u.onegodian.com',
  'NEXT_PUBLIC_GALAXY_URL=https://galaxy.onegodian.com',
  'NEXT_PUBLIC_CAPITAL_URL=https://capital.onegodian.com',
  'NEXT_PUBLIC_OMOS_URL=https://omos.onegodian.com',
  'OMOS_REST_BASE_URL=https://omos.onegodian.com/wp-json/omos/v1',
  'OMOS_APP_BRIDGE_KEY=',
  'MEMBERS_REST_BASE_URL=https://onegodian.org/wp-json/onegodian-members/v1',
  'CAPITAL_REST_BASE_URL=https://capital.onegodian.com/wp-json/onegodian-capital/v1'
];

export const controlPlanePlaceholderLabels = ['Coming Soon', 'Planned Module', 'Operational Layer', 'Requires Admin Integration'];
