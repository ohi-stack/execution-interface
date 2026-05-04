export type EcosystemCategory = 'infrastructure' | 'identity' | 'commerce' | 'governance' | 'education' | 'media';

export type ProductionStatus = 'Live' | 'Staging' | 'In Development' | 'Needs Setup' | 'Offline' | 'Planned';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type EcosystemIconKey =
  | 'identity'
  | 'registry'
  | 'commerce'
  | 'infrastructure'
  | 'api'
  | 'education'
  | 'time'
  | 'media';

export type EcosystemSystem = {
  id: string;
  slug: string;
  title: string;
  name: string;
  category: EcosystemCategory;
  iconKey: EcosystemIconKey;
  productionStatus: ProductionStatus;
  priority: Priority;
  domain: string;
  repo: string;
  deploymentTarget: string;
  publicUrl: string;
  adminUrl: string;
  apiHealthUrl: string;
  lastCheckedLabel: string;
  description: string;
  productionChecklist: string[];
  nextActions: string[];
};

export const PRODUCTION_STATUSES: ProductionStatus[] = ['Live', 'Staging', 'In Development', 'Needs Setup', 'Offline', 'Planned'];

export const PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];

export const ECOSYSTEM_CATEGORIES: EcosystemCategory[] = ['infrastructure', 'identity', 'commerce', 'governance', 'education', 'media'];

export const ONEGODIAN_ECOSYSTEM: EcosystemSystem[] = [
  {
    id: 'OG-ECO-01',
    slug: 'onegodian-identity-engine',
    title: 'OneGodian Identity Engine',
    name: 'OneGodian Identity Engine',
    category: 'identity',
    iconKey: 'identity',
    productionStatus: 'In Development',
    priority: 'Critical',
    domain: 'identity.quantumohi.com',
    repo: 'ohi-stack/execution-interface',
    deploymentTarget: 'Hostinger Node/Next.js runtime',
    publicUrl: 'https://app.onegodian.com/profile',
    adminUrl: 'https://app.onegodian.com/settings',
    apiHealthUrl: 'https://api.onegodian.org/health',
    lastCheckedLabel: 'Manual review required before production lock',
    description:
      'Unified identity profiles, session trust, role-ready account surfaces, and OneGodian member identity controls for app.onegodian.com.',
    productionChecklist: [
      'Confirm authentication and account sessions',
      'Validate profile route and identity data model',
      'Connect membership roles to dashboard access',
      'Document privacy and identity data handling'
    ],
    nextActions: [
      'Wire identity records to the API gateway',
      'Add member status indicators to dashboard cards',
      'Create QR-V ready identity verification states'
    ]
  },
  {
    id: 'OG-ECO-02',
    slug: 'odin-registry-core',
    title: 'ODIN Registry Core',
    name: 'ODIN Registry Core',
    category: 'governance',
    iconKey: 'registry',
    productionStatus: 'Staging',
    priority: 'Critical',
    domain: 'app.onegodian.com/odin',
    repo: 'ohi-stack/execution-interface',
    deploymentTarget: 'Next.js App Router route group',
    publicUrl: 'https://app.onegodian.com/odin',
    adminUrl: 'https://app.onegodian.com/registry',
    apiHealthUrl: 'https://api.onegodian.org/health',
    lastCheckedLabel: 'Route available; API synchronization pending',
    description:
      'Canonical registration, validation, indexing, and review surface for ODIN records across OneGodian systems.',
    productionChecklist: [
      'Confirm ODIN route renders on production domain',
      'Connect registry data source to API gateway',
      'Add immutable record export workflow',
      'Add admin-only registry controls'
    ],
    nextActions: [
      'Define ODIN schema for production records',
      'Add record detail pages',
      'Add status filters for registry entries'
    ]
  },
  {
    id: 'OG-ECO-03',
    slug: 'capital-products-exchange',
    title: 'Capital + Products Exchange',
    name: 'Capital + Products Exchange',
    category: 'commerce',
    iconKey: 'commerce',
    productionStatus: 'Needs Setup',
    priority: 'High',
    domain: 'onegodian.com',
    repo: 'ohi-stack/execution-interface',
    deploymentTarget: 'WooCommerce + Stripe commerce layer with app dashboard links',
    publicUrl: 'https://app.onegodian.com/products',
    adminUrl: 'https://onegodian.com/wp-admin',
    apiHealthUrl: 'https://api.onegodian.org/health',
    lastCheckedLabel: 'Commerce integration not yet locked',
    description:
      'Commerce and product rails for digital products, certificates, memberships, licensing, and member-grade monetization.',
    productionChecklist: [
      'Confirm Stripe live mode products',
      'Connect product catalog to app cards',
      'Add checkout return and success states',
      'Document fulfillment and certificate delivery flow'
    ],
    nextActions: [
      'Map WooCommerce products to app modules',
      'Add product status widgets',
      'Create revenue summary card for dashboard'
    ]
  },
  {
    id: 'OG-ECO-04',
    slug: 'planetary-infra-layer',
    title: 'Planetary Infra Layer',
    name: 'Planetary Infra Layer',
    category: 'infrastructure',
    iconKey: 'infrastructure',
    productionStatus: 'In Development',
    priority: 'Medium',
    domain: 'galaxy.onegodian.com',
    repo: 'ohi-stack/execution-interface',
    deploymentTarget: 'Next.js planetary and moons routes',
    publicUrl: 'https://app.onegodian.com/planets',
    adminUrl: 'https://app.onegodian.com/moons-systems',
    apiHealthUrl: 'https://api.onegodian.org/health',
    lastCheckedLabel: 'Static canon routes live; data API pending',
    description:
      'Operational infrastructure for planets, moon systems, orbital records, and cross-route canon data mirroring.',
    productionChecklist: [
      'Confirm planets route production rendering',
      'Confirm moons and systems route production rendering',
      'Normalize canon data into reusable library files',
      'Add API-backed lookup for planetary records'
    ],
    nextActions: [
      'Add detail pages for planets and moons',
      'Add canon source references',
      'Add ODIN-PR record linkage'
    ]
  },
  {
    id: 'OG-ECO-05',
    slug: 'onegodian-api-gateway',
    title: 'OneGodian API Gateway',
    name: 'OneGodian API Gateway',
    category: 'infrastructure',
    iconKey: 'api',
    productionStatus: 'Needs Setup',
    priority: 'Critical',
    domain: 'api.onegodian.org',
    repo: 'ohi-stack/onegodian-api',
    deploymentTarget: 'Hostinger Node.js Express service',
    publicUrl: 'https://api.onegodian.org',
    adminUrl: 'https://hpanel.hostinger.com',
    apiHealthUrl: 'https://api.onegodian.org/health',
    lastCheckedLabel: 'Deployment target identified; production health pending',
    description:
      'Official OneGodian API gateway for health checks, registry endpoints, identity verification, commerce callbacks, and app data services.',
    productionChecklist: [
      'Deploy root Node server.js on Hostinger',
      'Confirm /health returns JSON status',
      'Configure CORS for app.onegodian.com',
      'Add environment variables and secrets',
      'Document restart and rollback procedure'
    ],
    nextActions: [
      'Deploy API gateway to Hostinger',
      'Connect app dashboard summary cards to health endpoint',
      'Add uptime and last checked automation'
    ]
  },
  {
    id: 'OG-ECO-06',
    slug: 'university-of-onegodian',
    title: 'University of OneGodian',
    name: 'University of OneGodian',
    category: 'education',
    iconKey: 'education',
    productionStatus: 'Planned',
    priority: 'High',
    domain: 'u.onegodian.org',
    repo: 'ohi-stack/execution-interface',
    deploymentTarget: 'WordPress LMS + app dashboard integration',
    publicUrl: 'https://u.onegodian.org',
    adminUrl: 'https://u.onegodian.org/wp-admin',
    apiHealthUrl: 'https://api.onegodian.org/health',
    lastCheckedLabel: 'Content model ready; LMS production setup pending',
    description:
      'Education, courses, certifications, learning paths, and member development programs for the OneGodian ecosystem.',
    productionChecklist: [
      'Confirm LMS platform and course structure',
      'Add course catalog and enrollment flow',
      'Connect certificate issuance process',
      'Create app links for active learners'
    ],
    nextActions: [
      'Build LMS landing page',
      'Create first certification path',
      'Add learner dashboard widgets'
    ]
  },
  {
    id: 'OG-ECO-07',
    slug: 'omos-plugin-bridge',
    title: 'OMOS Plugin Bridge',
    name: 'OMOS Plugin Bridge',
    category: 'infrastructure',
    iconKey: 'api',
    productionStatus: 'Staging',
    priority: 'Critical',
    domain: 'app.onegodian.com/omos',
    repo: 'ohi-stack/execution-interface',
    deploymentTarget: 'Next.js OMOS dashboard + API bridge endpoint',
    publicUrl: 'https://app.onegodian.com/omos',
    adminUrl: 'https://app.onegodian.com/dashboard',
    apiHealthUrl: 'https://app.onegodian.com/api/omos/llm/chat',
    lastCheckedLabel: 'Bridge route added; external OMOS API validation required',
    description:
      'Operational Module Operating System dashboard and secure app bridge endpoint for OMOS plugin communications.',
    productionChecklist: [
      'Set OMOS bridge environment variables',
      'Validate /api/omos/llm/chat POST response in production',
      'Confirm dashboard route and navigation visibility',
      'Verify bridge key rotation policy'
    ],
    nextActions: [
      'Connect OMOS dashboard widgets to live bridge telemetry',
      'Add request/response audit logging',
      'Publish plugin-side setup guide'
    ]
  }
];

export function getEcosystemSystemBySlug(slug: string) {
  return ONEGODIAN_ECOSYSTEM.find((system) => system.slug === slug);
}

export function getEcosystemSummary() {
  return {
    totalSystems: ONEGODIAN_ECOSYSTEM.length,
    liveSystems: ONEGODIAN_ECOSYSTEM.filter((system) => system.productionStatus === 'Live').length,
    criticalSystems: ONEGODIAN_ECOSYSTEM.filter((system) => system.priority === 'Critical').length,
    needsSetup: ONEGODIAN_ECOSYSTEM.filter((system) => system.productionStatus === 'Needs Setup').length
  };
}

export const onegodianAppModules = [
  {
    slug: 'algorithm',
    title: 'Onegodian Algorithm™',
    category: 'AI Governance',
    iconKey: 'BrainCircuit',
    productionStatus: 'In Development',
    priority: 'Critical',
    domain: 'app.onegodian.com',
    publicUrl: '/algorithm',
    repo: 'ohi-stack/execution-interface',
    deploymentTarget: 'Hostinger Node / Next.js',
    description:
      'Four-layer AI governance framework for recognition, personalization, community intelligence, and AI/robotic behavioral orientation.',
    productionChecklist: [
      'Create /algorithm landing page',
      'Add four-layer visual architecture',
      'Add Protocol, Experience, Community, Orientation child pages',
      'Add downloadable white paper link',
      'Add API-ready endpoint structure',
      'Add institutional-safe definitions'
    ]
  },
  {
    slug: 'belief-mapper-lite',
    title: 'Belief Mapper Lite',
    category: 'Identity',
    iconKey: 'Sparkles',
    productionStatus: 'Needs Setup',
    priority: 'Critical',
    domain: 'app.onegodian.com',
    publicUrl: '/belief-mapper',
    repo: 'ohi-stack/execution-interface',
    deploymentTarget: 'Next.js App Router',
    description:
      'Interactive 3–5 question entry tool that maps users into Seeker, Believer, Onegodian, or Elder journey stages.',
    productionChecklist: [
      'Build question flow',
      'Create result states',
      'Add consent notice',
      'Do not store belief data without explicit consent',
      'Route users to content, courses, or membership'
    ]
  },
  {
    slug: 'learn',
    title: 'OneGodian Learn',
    category: 'Education',
    iconKey: 'GraduationCap',
    productionStatus: 'Needs Setup',
    priority: 'Critical',
    domain: 'onegodian.org',
    publicUrl: 'https://onegodian.org/learn',
    adminUrl: 'https://onegodian.org/wp-admin',
    deploymentTarget: 'WordPress Knowledge Layer',
    description:
      'Public educational structure for Onegodianology, Onegodianosophy, Onegodianese, Onegodianism, Onegodianonomics, and Courses.',
    productionChecklist: [
      'Create /learn landing page',
      'Create six pillar cards',
      'Deep-link all course buttons to u.onegodian.org',
      'Keep onegodian.org as knowledge layer',
      'Keep u.onegodian.org as execution layer'
    ]
  },
  {
    slug: 'onegodian-u',
    title: 'OneGodian U',
    category: 'Education',
    iconKey: 'BookOpenCheck',
    productionStatus: 'Planned',
    priority: 'Critical',
    domain: 'u.onegodian.org',
    publicUrl: 'https://u.onegodian.org',
    deploymentTarget: 'Course Execution Platform',
    description:
      'Operational course delivery environment for lessons, modules, accounts, certifications, and progress tracking.',
    productionChecklist: [
      'Create course shell',
      'Create authentication flow',
      'Add courses by track',
      'Add certificates',
      'Connect course CTAs from onegodian.org/learn'
    ]
  },
  {
    slug: 'visual-cover-standards',
    title: 'Visual Cover Standards',
    category: 'Media',
    iconKey: 'Image',
    productionStatus: 'In Development',
    priority: 'High',
    domain: 'app.onegodian.com',
    publicUrl: '/standards/visual-covers',
    description:
      'Cover-art governance standard requiring every scroll and companion cover to visually encode the title’s meaning.',
    productionChecklist: [
      'Create standard page',
      'Add core principle',
      'Add dominant visual anchor rule',
      'Add no-clutter rule',
      'Add prompt template generator'
    ]
  },
  {
    slug: 'institutional',
    title: 'Institutional Dossier',
    category: 'Institutional',
    iconKey: 'Landmark',
    productionStatus: 'Needs Setup',
    priority: 'Critical',
    domain: 'app.onegodian.com',
    publicUrl: '/institutional',
    description:
      'Institutional-safe overview of ONEGODIAN, LLC, IP standing, Onegodian Algorithm, legal documentation, and operating structure.',
    productionChecklist: [
      'Add positioning statement summary',
      'Separate ONEGODIAN, LLC from INO governance',
      'Add copyright reference',
      'Add valuation document placeholder',
      'Add investor/banking/press inquiry routing'
    ]
  }
];
