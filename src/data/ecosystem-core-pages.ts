export type EcosystemCorePageCount = {
  platform: string;
  pages: number;
  canonicalRole: string;
};

export const ecosystemCorePages: EcosystemCorePageCount[] = [
  { platform: 'OneGodian.org', pages: 36, canonicalRole: 'Organization, identity, education, community, and public institutional context' },
  { platform: 'OneGodian.com', pages: 72, canonicalRole: 'Commerce, products, services, payments, and transaction pathways' },
  { platform: 'U.OneGodian.com', pages: 25, canonicalRole: 'Learning, courses, lessons, certifications, and education onboarding' },
  { platform: 'Galaxy.OneGodian.com', pages: 32, canonicalRole: 'Galaxy, planets, lore, discovery, and planet-store gateways' },
  { platform: 'Capital.OneGodian.com', pages: 55, canonicalRole: 'Corporate finance, capital strategy, funding, and financial platform responsibilities' },
  { platform: 'OMOS.OneGodian.com', pages: 30, canonicalRole: 'Protocol, specification, alignment, runtime, tools, and developer documentation' },
  { platform: 'App.OneGodian.com', pages: 40, canonicalRole: 'Public/member app gateway, dashboards, registry, tools, members, integrations, and control surfaces' },
  { platform: 'OBP1.OneGodian.org', pages: 28, canonicalRole: 'Verification context, records, registries, certificates, and public ledger interfaces' },
  { platform: 'Time.OneGodian.org', pages: 24, canonicalRole: 'OneGodian Time, OTS-V5, dual-date tools, timestamp rules, and time governance' },
  { platform: 'QuantumOHI.com', pages: 26, canonicalRole: 'Quantum-OHI enterprise platform, governance hub, alignment, security, APIs, and research' },
  { platform: 'QRV.Network', pages: 18, canonicalRole: 'Verification network, issuer workflows, registry, QR tools, API, and developer portal' }
];

export const TRACKED_PLATFORM_COUNT = ecosystemCorePages.length;
export const ECOSYSTEM_CORE_PAGE_TOTAL = ecosystemCorePages.reduce((sum, item) => sum + item.pages, 0);
export const ECOSYSTEM_REGISTRY_UPDATED_AT = '2026-09-18';
