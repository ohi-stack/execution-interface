export type ProductionDocCard = {
  title: string;
  body: string;
  status?: 'Active' | 'Planned' | 'Documented' | 'Monitored';
  meta?: string;
};

export type ProductionDocPage = {
  slug: string;
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  summary: string;
  cards: ProductionDocCard[];
  checklist: string[];
};

export const productionRelease = {
  version: '1.0',
  name: 'OMOS Production Documentation Release 1.0',
  canonicalHost: 'https://app.onegodian.com',
  status: 'production-documentation',
  releasedAt: '2026-06-07',
  theme: 'dark OneGodian production theme'
} as const;

export const productionDocPages: ProductionDocPage[] = [
  {
    slug: 'framework',
    href: '/framework',
    eyebrow: 'Framework',
    title: 'OMOS is the operating framework for OneGodian systems.',
    description: 'Framework documentation for the interpretive, operational, interface, and compliance layers that make OMOS repeatable in production.',
    summary: 'The framework connects human meaning, structured records, AI-assisted interpretation, public interfaces, and compliance-safe publication rules into one documented model.',
    cards: [
      { title: 'Interpretive layer', body: 'Names the meaning, audience, source context, and boundary language before any automated output is presented.', status: 'Active' },
      { title: 'Operational layer', body: 'Turns routes, APIs, manifests, health checks, dashboards, and reusable page sections into repeatable production surfaces.', status: 'Active' },
      { title: 'Interface layer', body: 'Packages OMOS for readers, members, operators, and integration partners through responsive pages and machine-readable endpoints.', status: 'Documented' },
      { title: 'Compliance layer', body: 'Keeps all public language clear that OMOS is not governmental authority, legal immunity, tax exemption, or jurisdiction over non-participants.', status: 'Monitored' }
    ],
    checklist: ['Route is published at /framework.', 'Cards are reusable and mobile responsive.', 'Metadata identifies OMOS framework documentation.', 'Footer and navigation expose the framework path.']
  },
  {
    slug: 'algorithm',
    href: '/algorithm',
    eyebrow: 'Algorithm',
    title: 'The OneGodian Algorithm runs Observe → Distill → Align → Select → Execute → Verify.',
    description: 'Production documentation for the six-step OMOS algorithm used to create structured, compliance-aware outputs.',
    summary: 'The algorithm is an operating loop for processing meaning into documented actions while preserving source boundaries, route purpose, and response shape.',
    cards: [
      { title: 'Observe', body: 'Receive source material, route context, metadata, operator intent, and any constraints without expanding claims.', status: 'Active', meta: '01' },
      { title: 'Distill', body: 'Extract the purpose, audience, key terms, risk notes, required format, and publication surface.', status: 'Active', meta: '02' },
      { title: 'Align', body: 'Apply protocol wording, safety boundaries, active/planned labels, and OneGodian theme consistency.', status: 'Active', meta: '03' },
      { title: 'Select', body: 'Choose the endpoint, template, card pattern, dashboard row, or documentation page that best fits the request.', status: 'Active', meta: '04' },
      { title: 'Execute', body: 'Generate the page, response, summary, or record in a repeatable structure that humans can review.', status: 'Active', meta: '05' },
      { title: 'Verify', body: 'Check authentication, validation, wording, status classification, links, and output shape before release.', status: 'Monitored', meta: '06' }
    ],
    checklist: ['Algorithm steps are visible as cards.', 'Non-operational capabilities remain planned.', 'The page links into the docs hub and status dashboard.']
  },
  {
    slug: 'protocol',
    href: '/protocol',
    eyebrow: 'Protocol',
    title: 'The OMOS protocol defines the production rules for meaning, routes, APIs, and claims.',
    description: 'Protocol documentation for route naming, response structure, public boundaries, and release acceptance criteria.',
    summary: 'The protocol keeps every OMOS surface readable, implementable, reviewable, and repeatable across pages, dashboards, and endpoints.',
    cards: [
      { title: 'Route rule', body: 'Every route states its purpose, audience, system boundary, and status classification.', status: 'Active' },
      { title: 'API rule', body: 'Every endpoint exposes a stable JSON shape with status, version, generated timestamp, and canonical routes where appropriate.', status: 'Active' },
      { title: 'Claims rule', body: 'Public materials avoid governmental, legal, tax, financial, or authority claims outside documented private operational context.', status: 'Monitored' },
      { title: 'Release rule', body: 'A feature is active only when operational, documented, responsive, linked, and repeatable.', status: 'Documented' }
    ],
    checklist: ['Protocol cards include API, route, claim, and release rules.', 'Compliance band appears on the page.', 'Metadata and sitemap include /protocol.']
  },
  {
    slug: 'pipeline',
    href: '/ohi',
    eyebrow: 'OHI Pipeline',
    title: 'The OHI pipeline turns intake into structured OneGodian intelligence outputs.',
    description: 'Pipeline documentation for intake, normalization, interpretation, routing, publication, and monitoring across OHI and Quantum OHI systems.',
    summary: 'OHI is documented as a production pipeline that receives signals, normalizes them, maps them to OMOS context, and publishes reviewable outputs.',
    cards: [
      { title: 'Intake', body: 'Collect prompts, records, forms, route events, and operator notes from approved public or member-facing surfaces.', status: 'Active', meta: 'Input' },
      { title: 'Normalize', body: 'Convert mixed source material into common fields: source, intent, audience, route, risk, and desired output.', status: 'Active', meta: 'Transform' },
      { title: 'Interpret', body: 'Apply OMOS framework and algorithm rules to produce meaning-aware summaries, classifications, or next steps.', status: 'Documented', meta: 'OMOS' },
      { title: 'Route', body: 'Send the result to the correct page, dashboard, manifest field, API response, or planned backlog item.', status: 'Active', meta: 'Output' },
      { title: 'Monitor', body: 'Expose status through health, manifest, and dashboard surfaces so production readiness remains visible.', status: 'Monitored', meta: 'Ops' }
    ],
    checklist: ['OHI page is mobile responsive.', 'Pipeline stages use reusable cards.', 'Health and manifest endpoints include release references.']
  },
  {
    slug: 'belief-mapper',
    href: '/belief-mapper',
    eyebrow: 'Belief Mapper™',
    title: 'Belief Mapper™ documents consent-first identity reflection paths.',
    description: 'Production documentation for Belief Mapper routes, result surfaces, journal flows, certificate paths, and premium progression.',
    summary: 'Belief Mapper is the member-facing reflection module that maps question responses into educational, journaling, timeline, certificate, and upgrade experiences.',
    cards: [
      { title: 'Start', body: 'Mobile-first questionnaire entry for consent-aware reflection and initial profile creation.', status: 'Active', meta: '/start' },
      { title: 'Results', body: 'Seeker, Believer, Onegodian, and Elder result paths display summary guidance and next-step cards.', status: 'Active', meta: '/results' },
      { title: 'Journal', body: 'Reflection entries let members preserve context around their belief mapping journey.', status: 'Active', meta: '/journal' },
      { title: 'Certificate', body: 'Certificate preview and route documentation provide a clear pathway without overstating legal status.', status: 'Documented', meta: '/certificate' },
      { title: 'Premium', body: 'Upgrade card describes optional deeper mapping surfaces, marked according to production readiness.', status: 'Documented', meta: '/premium' }
    ],
    checklist: ['Belief Mapper routes are linked from the hub.', 'Cards stay readable on mobile.', 'Public copy remains educational and consent-first.']
  }
];

export const docsHubCards = productionDocPages.map(({ title, description, href, eyebrow }) => ({
  title: eyebrow,
  body: description,
  href
}));

export const productionDashboardRows = [
  { surface: 'Framework page', href: '/framework', status: 'Active', owner: 'OMOS docs' },
  { surface: 'Algorithm page', href: '/algorithm', status: 'Active', owner: 'OMOS docs' },
  { surface: 'Protocol page', href: '/protocol', status: 'Active', owner: 'OMOS docs' },
  { surface: 'OHI pipeline page', href: '/ohi', status: 'Active', owner: 'OHI docs' },
  { surface: 'Belief Mapper page', href: '/belief-mapper', status: 'Active', owner: 'App module' },
  { surface: 'Documentation hub', href: '/docs', status: 'Active', owner: 'Docs hub' },
  { surface: 'Status dashboard', href: '/status', status: 'Active', owner: 'Runtime' },
  { surface: 'Health endpoint', href: '/api/health', status: 'Active', owner: 'API' },
  { surface: 'Manifest endpoint', href: '/api/manifest', status: 'Active', owner: 'API' }
] as const;

export function getProductionDocPage(slug: string) {
  return productionDocPages.find((page) => page.slug === slug || page.href === slug);
}
