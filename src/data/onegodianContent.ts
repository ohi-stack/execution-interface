export type ContentLink = {
  label: string;
  href: string;
};

export type ContentCard = {
  title: string;
  description: string;
  status: string;
  href: string;
  action: string;
  metrics?: string[];
  links?: ContentLink[];
};

export type ContentRoute = {
  eyebrow: string;
  title: string;
  headline: string;
  description: string;
  portal?: ContentLink;
  cards: ContentCard[];
};

export const registryContent: ContentRoute = {
  eyebrow: 'ODIN Registry · Verification Layer',
  title: 'ODIN Registry',
  headline: 'Operational record access for certificates, products, identities, systems, and verification.',
  description:
    'The registry route surfaces live OneGodian registry categories from the shared content source and prepares each lane for future ODIN, QRV, certificate, product, and identity APIs.',
  portal: { label: 'Connect QRV Network', href: 'https://qrv.network' },
  cards: [
    {
      title: 'ODIN Registry',
      description: 'Canonical ODIN record lane for ecosystem identifiers, registered platform references, and public-safe registry lookup.',
      status: 'Live category',
      href: '/odin-registry',
      action: 'Open ODIN records',
      metrics: ['Registry class: canonical', 'API target: /api/manifest']
    },
    {
      title: 'Certificates',
      description: 'Certificate issuance and verification surface for member, learning, participation, and ecosystem credentials.',
      status: 'Verification ready',
      href: '/certificates',
      action: 'View certificates',
      metrics: ['Credential lane: active', 'QRV handoff: prepared']
    },
    {
      title: 'Products',
      description: 'Registered commerce, digital download, membership, course, and founder product categories routed to OneGodian.com.',
      status: 'Commerce linked',
      href: '/products',
      action: 'Open products',
      metrics: ['Commerce node: OneGodian.com', 'Checkout handoff: external']
    },
    {
      title: 'Identity',
      description: 'Digital OneGodian ID context, profile references, participation records, and member identity verification routes.',
      status: 'Member ready',
      href: '/identity',
      action: 'Open identity',
      metrics: ['Identity lane: public/member', 'Auth integration: prepared']
    },
    {
      title: 'Systems',
      description: 'System registry for OMOS, OHI, app, commerce, education, capital, and verification infrastructure nodes.',
      status: 'System mapped',
      href: '/systems',
      action: 'View systems',
      metrics: ['Runtime nodes: mapped', 'Health handoff: /api/health']
    },
    {
      title: 'Verification',
      description: 'QRV-aligned trust layer for record status, registry references, certificate checks, and public lookup workflows.',
      status: 'QRV prepared',
      href: '/verification',
      action: 'Verify records',
      metrics: ['Trust layer: QRV.Network', 'Lookup API: planned']
    }
  ]
};

export const membersContent: ContentRoute = {
  eyebrow: 'Member Layer · Public/Member View',
  title: 'Member Dashboard',
  headline: 'Member identity, certificates, and participation records prepared for auth integration.',
  description:
    'The member route presents the public-safe dashboard structure now, while keeping each data lane ready for authenticated profile, certificate, participation, and Digital OneGodian ID integrations.',
  cards: [
    {
      title: 'Digital OneGodian ID',
      description: 'A member identity card surface for display name, member role, registry reference, and future authenticated profile metadata.',
      status: 'Ready for auth',
      href: '/id-card',
      action: 'Open ID card',
      metrics: ['View: public/member', 'Auth: prepared']
    },
    {
      title: 'Member Certificates',
      description: 'Credential lane for learning certificates, participation certificates, verification artifacts, and QRV-ready certificate lookups.',
      status: 'Credential lane',
      href: '/certificates',
      action: 'View certificates',
      metrics: ['Certificates: active', 'Verification: prepared']
    },
    {
      title: 'Participation Records',
      description: 'Participation records for campaigns, learning activity, member contributions, community actions, and ecosystem milestones.',
      status: 'Record lane',
      href: '/records',
      action: 'Open records',
      metrics: ['Campaigns: Remember', 'Records: member scoped']
    }
  ]
};

export const learningContent: ContentRoute = {
  eyebrow: 'Education Layer · u.OneGodian.com',
  title: 'University of OneGodian',
  headline: 'Learning catalog for Onegodianology, Onegodianese, OTS-V5, and certification pathways.',
  description:
    'The learning route makes the education catalog visible inside the app while preparing links and categories for LMS integration with u.OneGodian.com.',
  portal: { label: 'Open LMS Portal', href: 'https://u.onegodian.com' },
  cards: [
    {
      title: 'University of OneGodian',
      description: 'Primary education portal for courses, student journeys, learning paths, certificates, and institutional education programs.',
      status: 'Catalog live',
      href: 'https://u.onegodian.com',
      action: 'Open university',
      metrics: ['Domain: u.OneGodian.com', 'LMS handoff: prepared']
    },
    {
      title: 'Onegodianology',
      description: 'Foundational curriculum covering OneGodian identity, ecosystem structure, belief architecture, remembrance, and public-safe interpretation.',
      status: 'Course category',
      href: '/learn',
      action: 'View category',
      metrics: ['Track: foundations', 'Certificates: eligible']
    },
    {
      title: 'Onegodianese',
      description: 'Language and naming system studies for terms, symbols, dates, ecosystem concepts, and structured communication.',
      status: 'Course category',
      href: '/time',
      action: 'Study language',
      metrics: ['Track: language', 'Glossary handoff: planned']
    },
    {
      title: 'OTS-V5',
      description: 'Operational training sequence for app workflows, registry usage, OMOS orientation, verification, and production readiness.',
      status: 'Training path',
      href: '/tools',
      action: 'Open tools',
      metrics: ['Track: operations', 'Level: V5']
    },
    {
      title: 'Certifications',
      description: 'Credential pathways for course completion, member participation, learning modules, and ecosystem-aligned verification records.',
      status: 'Credential track',
      href: '/certificates',
      action: 'View credentials',
      metrics: ['QRV: prepared', 'Registry: linked']
    }
  ]
};

export const omosContent: ContentRoute = {
  eyebrow: 'OMOS · Runtime Architecture',
  title: 'OMOS Node Structure',
  headline: 'The app route mirrors the OMOS architecture and links to OMOS.OneGodian.com.',
  description:
    'OMOS connects algorithmic identity interpretation, OHI processing, belief mapping, institutional layers, AGI alignment, economic systems, and cosmic philosophy into one runtime/protocol structure.',
  portal: { label: 'Open OMOS Portal', href: 'https://omos.onegodian.com' },
  cards: [
    {
      title: 'OneGodian Algorithm™',
      description: 'Core interpretation engine for identity-aware routing, decision context, member experience, and ecosystem intelligence.',
      status: 'Protocol node',
      href: 'https://omos.onegodian.com',
      action: 'Open protocol',
      metrics: ['Layer: algorithm', 'Runtime: OMOS']
    },
    {
      title: 'OHI',
      description: 'OHI processing layer for intake, normalization, interpretation, routing, synthesis, and monitoring.',
      status: 'Pipeline node',
      href: '/ohi',
      action: 'Open OHI',
      metrics: ['Pipeline: active', 'Health: monitored']
    },
    {
      title: 'Identity & Belief Mapper',
      description: 'Identity and belief mapping layer for questionnaires, profiles, journeys, certificates, and structured self-understanding.',
      status: 'Mapper node',
      href: '/belief-mapper',
      action: 'Open mapper',
      metrics: ['Mapper: active', 'Certificates: linked']
    },
    {
      title: 'Institutional Layer',
      description: 'Boundary, compliance, governance, public-safe language, and institutional clarity across app, commerce, education, and capital surfaces.',
      status: 'Governance node',
      href: '/institutional',
      action: 'Open clarity',
      metrics: ['Boundary: active', 'Disclosure: linked']
    },
    {
      title: 'AGI Alignment',
      description: 'Alignment structure for AI-era systems, identity-sensitive outputs, human-safe routing, and OMOS-guided agent behavior.',
      status: 'Alignment node',
      href: '/ai-system-prompt',
      action: 'Open prompt',
      metrics: ['AI layer: prepared', 'Runtime: guided']
    },
    {
      title: 'Unified Economic Cosmos',
      description: 'Economic operating model connecting commerce, memberships, products, capital readiness, licensing, and revenue infrastructure.',
      status: 'Economic node',
      href: '/economics',
      action: 'Open economics',
      metrics: ['Revenue: mapped', 'Capital: linked']
    },
    {
      title: 'Cosmos & Philosophy',
      description: 'Cosmic and philosophical layer connecting the OneGodian framework, planetary canon, remembrance, time, and ecosystem meaning.',
      status: 'Philosophy node',
      href: '/galaxy',
      action: 'Open cosmos',
      metrics: ['Canon: linked', 'Time: OT compatible']
    }
  ]
};

export const capitalContent: ContentRoute = {
  eyebrow: 'Capital Portal · Revenue Infrastructure',
  title: 'OneGodian Capital',
  headline: 'Capital readiness, valuation, disclosures, funding initiatives, and revenue system visibility.',
  description:
    'The capital route consumes the content source to present investor-safe readiness categories and route users to the capital portal, disclosures, funding tracker, valuation, and revenue infrastructure.',
  portal: { label: 'Open Capital Portal', href: 'https://capital.onegodian.com' },
  cards: [
    {
      title: 'Positioning Statement',
      description: 'Private commercial/IP/software/media/education/e-commerce positioning for capital conversations and public-safe investor context.',
      status: 'Published',
      href: '/capital',
      action: 'Read position',
      metrics: ['Readiness: 92%', 'Boundary: active']
    },
    {
      title: 'Infrastructure Readiness',
      description: 'Operational readiness view covering app routes, registry surfaces, OMOS architecture, APIs, plugin bridges, and deployment paths.',
      status: 'Operational',
      href: '/readiness',
      action: 'View readiness',
      metrics: ['Readiness: 88%', 'Routes: covered']
    },
    {
      title: 'Business Valuation',
      description: 'Strategic value model, ecosystem assets, revenue pathways, intellectual property layers, and platform infrastructure indicators.',
      status: 'Modeled',
      href: '/capital/valuation',
      action: 'Open valuation',
      metrics: ['Readiness: 84%', 'Model: strategic']
    },
    {
      title: 'Disclosure Center',
      description: 'Disclosure access for public-safe capital communication, risk language, compliance posture, and investor-facing materials.',
      status: 'Disclosure ready',
      href: '/disclosures',
      action: 'Open disclosures',
      metrics: ['Readiness: 90%', 'Compliance: routed']
    },
    {
      title: 'Funding Initiatives',
      description: 'Funding tracker, commitments, lender mapping, initiative stages, and institutional relationship management.',
      status: 'Tracker active',
      href: '/capital/funding-tracker',
      action: 'Open tracker',
      metrics: ['Readiness: 86%', 'Pipeline: active']
    },
    {
      title: 'Revenue Systems',
      description: 'Revenue infrastructure across commerce, memberships, licensing, products, certificates, courses, APIs, and platform services.',
      status: 'Revenue mapped',
      href: '/capital/instruments',
      action: 'Open systems',
      metrics: ['Readiness: 89%', 'Systems: mapped']
    }
  ]
};

export const platformStatus = [
  { title: 'App Status', status: 'Operational', href: '/api/health', description: 'app.OneGodian.com routes, manifest, and health surfaces are active.' },
  { title: 'OMOS Status', status: 'Runtime linked', href: '/omos', description: 'OMOS architecture and runtime node links are exposed through the app.' },
  { title: 'Capital Status', status: 'Readiness visible', href: '/capital', description: 'Capital readiness, valuation, funding, disclosures, and revenue systems are routed.' },
  { title: 'QRV Status', status: 'Verification prepared', href: 'https://qrv.network', description: 'Verification and trust-layer handoffs are ready for QRV APIs.' }
];

export const latestDeployments = [
  { title: 'Content source committed', detail: 'onegodianContent data source established for production routes.', href: '/api/manifest' },
  { title: 'Core route implementation', detail: 'Registry, members, learning, OMOS, capital, dashboard, ecosystem, and APIs consume shared content.', href: '/dashboard' },
  { title: 'Production API surface', detail: 'Manifest, health, tools, and stats endpoints expose app status and ecosystem structure.', href: '/api/health' }
];

export const productionMetrics = [
  { label: 'Certificates', value: '4 lanes', detail: 'Member, learning, participation, and registry credentials.' },
  { label: 'Products', value: '6 categories', detail: 'Commerce, memberships, downloads, courses, founder products, and subscriptions.' },
  { label: 'Learning Modules', value: String(learningContent.cards.length), detail: 'University, Onegodianology, Onegodianese, OTS-V5, certifications.' },
  { label: 'Capital Readiness', value: '89%', detail: 'Average readiness across capital route cards.' }
];

export const verificationStatus = [
  { title: 'QRV status card', status: 'Prepared', href: 'https://qrv.network', description: 'Trust layer handoff is present for future record verification APIs.' },
  { title: 'Registry status card', status: 'Live', href: '/registry', description: 'ODIN registry categories render directly from the content source.' }
];

export const ecosystemHierarchy = [
  { domain: 'OneGodian.org', href: 'https://onegodian.org', children: ['Education', 'Archives', 'Community'] },
  { domain: 'OneGodian.com', href: 'https://onegodian.com', children: ['Commerce', 'Memberships', 'Services'] },
  { domain: 'u.OneGodian.com', href: 'https://u.onegodian.com', children: ['Courses', 'Certifications', 'Learning'] },
  { domain: 'app.OneGodian.com', href: 'https://app.onegodian.com', children: ['Dashboard', 'Registry', 'Members', 'Tools'] },
  { domain: 'OMOS.OneGodian.com', href: 'https://omos.onegodian.com', children: ['Protocol', 'Runtime', 'Architecture'] },
  { domain: 'capital.OneGodian.com', href: 'https://capital.onegodian.com', children: ['Offerings', 'Disclosures', 'Zolfi', 'Instryx'] },
  { domain: 'QuantumOHI.com', href: 'https://quantumohi.com', children: ['Enterprise', 'Strategy'] },
  { domain: 'QRV.Network', href: 'https://qrv.network', children: ['Verification', 'Registry', 'Trust Layer'] }
];

export const manifestEcosystem = ecosystemHierarchy
  .filter((node) => node.domain !== 'app.OneGodian.com')
  .map((node) => node.domain);

export const routeContent = {
  registry: registryContent,
  members: membersContent,
  learning: learningContent,
  omos: omosContent,
  capital: capitalContent
};
