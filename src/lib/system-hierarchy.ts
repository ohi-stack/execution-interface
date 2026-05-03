export type SystemHierarchyLayer = {
  level: string;
  title: string;
  emoji: string;
  description: string;
  examples: string[];
  status: 'Live' | 'In Development' | 'Planned';
};

export const systemHierarchy: SystemHierarchyLayer[] = [
  { level: 'Level 0', title: 'Founder Layer', emoji: '👤', status: 'Live', description: 'Origin layer for authorship, system direction, intellectual property, strategy, and ecosystem continuity.', examples: ['Founder record', 'Authorship', 'System direction', 'IP origin'] },
  { level: 'Level 1', title: 'Framework Layer', emoji: '🧠', status: 'Live', description: 'OneGodian philosophy, concepts, language, educational framework, and interpretive structure.', examples: ['OneGodian Philosophy', 'OMOS', 'OneGodian Algorithm', 'Lexicon'] },
  { level: 'Level 2', title: 'Institutional Layer', emoji: '🏢', status: 'Live', description: 'Commercial entity and separated community/cultural structures, with clear distinction between business operations and community frameworks.', examples: ['ONEGODIAN, LLC', 'Commercial operations', 'Community initiatives'] },
  { level: 'Level 3', title: 'Platform Layer', emoji: '🌐', status: 'Live', description: 'Domain architecture across public, commercial, app, and API environments.', examples: ['Onegodian.org', 'Onegodian.com', 'app.onegodian.com', 'api.onegodian.org'] },
  { level: 'Level 4', title: 'Systems Layer', emoji: '⚙️', status: 'In Development', description: 'Core runtime systems including intelligence, alignment, execution, blockchain, timekeeping, and agent command infrastructure.', examples: ['OHI', 'Quantum-OHI', 'OMOS', 'ACC', 'OBP-1', 'OTS-V5'] },
  { level: 'Level 5', title: 'Registry & Identity Layer', emoji: '🪪', status: 'In Development', description: 'Identity, records, certificates, registry objects, verification, QR-V lookup, and access continuity.', examples: ['ODIN Registry', 'Member IDs', 'Certificates', 'QR-V', 'Verification records'] },
  { level: 'Level 6', title: 'Commerce Layer', emoji: '🛍', status: 'In Development', description: 'Commercial products, books, courses, memberships, digital downloads, and capital dashboards.', examples: ['Books', 'Courses', 'Memberships', 'Capital', 'WooCommerce', 'Stripe'] },
  { level: 'Level 7', title: 'Application Layer', emoji: '📱', status: 'Live', description: 'The OneGodian App interface for dashboards, registries, modules, tools, systems, identity, and developer access.', examples: ['Dashboard', 'Ecosystem', 'Registry', 'Systems', 'Tools', 'Members'] },
  { level: 'Level 8', title: 'Knowledge & Media Layer', emoji: '🎬', status: 'In Development', description: 'Books, publications, media center, visual assets, podcasts, music, press kits, and educational content.', examples: ['Books', 'Lexicons', 'Media Center', 'Press assets', 'Visual galleries'] },
  { level: 'Level 9', title: 'Expansion Layer', emoji: '🪐', status: 'Planned', description: 'Galaxy, planet systems, moons, future systems, conceptual expansion, and long-range frameworks.', examples: ['Planets', 'Moons', 'Galaxy', 'Future systems'] },
  { level: 'Level 10', title: 'Infrastructure Control Layer', emoji: '🏗', status: 'In Development', description: 'Infrastructure ownership thesis: identity, verification, execution environments, APIs, standards, and dependency control.', examples: ['Compute', 'Identity', 'Verification', 'Execution', 'APIs', 'Standards'] }
];
