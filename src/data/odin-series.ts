export type OdinSeriesItem = {
  code: string;
  title: string;
  description: string;
  group: 'Technology & Systems' | 'Governance, Law & Canon' | 'Assets & Property' | 'Economy & Commerce' | 'Knowledge & Media';
};

export const odinSeries: OdinSeriesItem[] = [
  { code: 'ODIN-T', title: 'Technology & Intelligence', description: 'Execution engines, intelligence systems, computational architectures, processors, networks, and OHI™ / Quantum-OHI™ infrastructure.', group: 'Technology & Systems' },
  { code: 'ODIN-A', title: 'Architecture & System Design', description: 'System architectures, platform blueprints, templates, layouts, and design logic for commerce and media operating systems.', group: 'Technology & Systems' },
  { code: 'ODIN-X', title: 'Experimental & Prototype Systems', description: 'Draft systems, experimental platforms, alpha architectures, and pre-canon concepts not yet canon-locked.', group: 'Technology & Systems' },
  { code: 'ODIN-G', title: 'Governance & Legal Systems', description: 'Constitutions, laws, decrees, treaties, enforcement doctrines, jurisdictional logic, and compliance frameworks.', group: 'Governance, Law & Canon' },
  { code: 'ODIN-S', title: 'Strategic Scrolls & Canon Archives', description: 'Scrolls, doctrines, principles, theories, manifestos, sacred writings, and long-form canonical records.', group: 'Governance, Law & Canon' },
  { code: 'ODIN-C', title: 'Canonical Terms & Structural Records', description: 'Defined terms, coined concepts, classifications, structural language, naming authority, and lexicons.', group: 'Governance, Law & Canon' },
  { code: 'ODIN-L', title: 'Land & Property', description: 'Land claims, parcels, reclamations, addresses, deeds, easements, planetary territories, and spatial ownership records.', group: 'Assets & Property' },
  { code: 'ODIN-PR', title: 'Planetary Registry & World Assets', description: 'Planetary assets, world registries, Planet-as-a-Platform classifications, world-level valuations, PR codes, and canon-lock states.', group: 'Assets & Property' },
  { code: 'ODIN-I', title: 'Interstellar & Supra-Dimensional Assets', description: 'Planets, worlds, star systems, interstellar cities, dimensional corridors, and supra-spatial infrastructure.', group: 'Assets & Property' },
  { code: 'ODIN-F', title: 'Financial Instruments & Currency', description: 'Notes, bonds, credits, currencies, yield systems, treasuries, valuation frameworks, and financial execution rails.', group: 'Economy & Commerce' },
  { code: 'ODIN-P', title: 'Products, Platforms & Memberships', description: 'Commercial platforms, SaaS, marketplaces, memberships, subscriptions, licenses, and access tiers.', group: 'Economy & Commerce' },
  { code: 'ODIN-N', title: 'Nation Projects & Fundraisers', description: 'Nation-level initiatives, sovereign projects, development funds, capital raises, and public offerings tied to nation building.', group: 'Economy & Commerce' },
  { code: 'ODIN-R', title: 'Research & Discoveries', description: 'Scientific findings, experimental frameworks, discovery records, validated research outputs, and empirical backing for canon systems.', group: 'Knowledge & Media' },
  { code: 'ODIN-M', title: 'Media, Audio & Visual Works', description: 'Films, series, episodes, podcasts, music, albums, soundscapes, visual media IP, and licensing-ready creative works.', group: 'Knowledge & Media' }
];
