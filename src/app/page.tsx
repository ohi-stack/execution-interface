import Link from 'next/link';

type StatusItem = {
  title: string;
  state: string;
  description: string;
};

type ModuleSection = {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
};

const productionStatus: StatusItem[] = [
  {
    title: 'Node App',
    state: 'Live',
    description: 'Primary Next.js application successfully deployed and serving production traffic.'
  },
  {
    title: 'Hostinger Deployment',
    state: 'Active',
    description: 'Production hosting environment operational with live routing and domain resolution.'
  },
  {
    title: 'ODIN Systems',
    state: 'Online',
    description: 'Registry structure, routing architecture, and synchronization layers initialized.'
  },
  {
    title: 'Static Fallback',
    state: 'Enabled',
    description: 'Fallback rendering and static route support active during phased backend expansion.'
  },
  {
    title: 'GitHub Integration',
    state: 'Connected',
    description: 'Repository-based deployment workflow and source management active.'
  },
  {
    title: 'UI Framework',
    state: 'Operational',
    description: 'Responsive mobile-first shell, navigation system, and module routing online.'
  },
  {
    title: 'Future Database Layer',
    state: 'In Development',
    description: 'Structured transition planned from static shell to dynamic registry infrastructure.'
  }
];

const moduleSections: ModuleSection[] = [
  {
    eyebrow: 'COMMAND HUB',
    title: 'Dashboard',
    description:
      'Open the central operating environment for ecosystem monitoring, module access, deployment visibility, production status, and active OneGodian infrastructure coordination.',
    points: ['System overview', 'Priority tracking', 'Deployment visibility', 'Operational summaries', 'Gateway routing', 'Infrastructure monitoring']
  },
  {
    eyebrow: 'SYSTEM DIRECTORY',
    title: 'Ecosystem',
    description:
      'Browse connected OneGodian systems, domains, infrastructure layers, applications, educational platforms, synchronization targets, and future execution environments from one unified directory.',
    points: ['Platform registry', 'Domain structure', 'Service relationships', 'Deployment targets', 'Infrastructure layers', 'Expansion pathways']
  },
  {
    eyebrow: 'ODIN INDEX',
    title: 'Registry',
    description:
      'Access ODIN-aligned registry categories for planetary systems, certificates, products, archives, records, classifications, and future verification layers.',
    points: ['Planetary records', 'Certificate indexes', 'Product systems', 'Membership structures', 'Archive records', 'Identity-linked entries']
  },
  {
    eyebrow: 'ODIN-PR',
    title: 'Planets',
    description:
      'Explore the 25-world OneGodian Galaxy™ planetary registry, including planetary profiles, environmental canon, system classifications, and future expansion continuity.',
    points: ['Planet profiles', 'Canon timelines', 'Visual archives', 'Galactic mapping', 'Civilization structures', 'World continuity systems']
  },
  {
    eyebrow: 'ORBITAL SYSTEMS',
    title: 'Moons & Systems',
    description:
      'Review moon systems, orbital continuity structures, expansion interfaces, planetary relationships, and Elyndria™ system architecture across the developing OneGodian Galaxy framework.',
    points: ['Moon registries', 'Orbital continuity', 'System hierarchies', 'Expansion structures', 'Celestial indexing', 'Elyndria™ archives']
  },
  {
    eyebrow: 'UTILITIES',
    title: 'Tools',
    description:
      'Open verification systems, lookups, time conversion interfaces, synchronization monitoring, product tooling, and operational utilities supporting the broader ecosystem.',
    points: ['OneGodian Time converter', 'Verification utilities', 'Registry lookup', 'QR validation', 'Sync monitoring', 'Infrastructure diagnostics']
  },
  {
    eyebrow: 'CANON LIBRARY',
    title: 'Media',
    description:
      'Access story worlds, planetary visuals, cinematic artwork, audio systems, poster archives, launch media, educational visuals, and future OneGodian content libraries.',
    points: ['Planetary artwork', 'Story archives', 'Posters', 'Audio collections', 'Video systems', 'Promotional media']
  },
  {
    eyebrow: 'COMMERCE',
    title: 'Products',
    description:
      'Organize digital downloads, educational products, certificates, memberships, courses, branded assets, and future planetary commerce systems through a centralized product layer.',
    points: ['eBooks', 'Courses', 'Certificates', 'Memberships', 'Downloads', 'Planetary collections']
  },
  {
    eyebrow: 'OBP-1',
    title: 'Certificates',
    description:
      'Prepare certificate verification systems, holder records, issuer management views, QR-linked validation flows, and future OBP-1™ credential infrastructure.',
    points: ['Certificate issuance', 'Verification lookup', 'Holder dashboards', 'QR validation', 'Download access', 'Registry linking']
  },
  {
    eyebrow: 'ODIN-PR',
    title: 'Galactic Canon',
    description:
      'Interactive registry for the OneGodian Galaxy™, planetary canon, moons, species, realms, lineages, figures, and temporal structures.',
    points: ['Status: In Development', 'Priority: High', 'Atlas interface', 'Species index', 'Temporal records', 'Satellite registry']
  },
  {
    eyebrow: 'IDENTITY',
    title: 'Profile',
    description:
      'View account structure, membership alignment, registry participation, downloads, certificates, saved systems, and future identity-linked infrastructure modules.',
    points: ['Account dashboard', 'Membership status', 'Registry alignment', 'Saved downloads', 'Certificate history', 'Identity preferences']
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">ONEGODIAN PLATFORM · APP.ONEGODIAN.COM</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">OneGodian Everything App</h1>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-300 sm:text-base">
            The central Node/Next.js operating interface for the OneGodian ecosystem — connecting ODIN registry systems, planetary canon infrastructure,
            moon systems, identity frameworks, certificates, products, media archives, synchronized tooling, and future platform services through a
            unified application layer.
          </p>
          <div className="mt-5 grid gap-2 text-sm text-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            {['Centralized ecosystem navigation', 'Registry and infrastructure access', 'Operational module management', 'Cross-platform synchronization', 'Visual command routing', 'Scalable gateway architecture'].map((item) => (
              <p key={item} className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2">
                • {item}
              </p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-lg border border-cyan-400/70 px-4 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-500/10">Open Dashboard</Link>
            <Link href="/ecosystem" className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:border-cyan-300">Explore Ecosystem</Link>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-xl font-semibold">Production Status</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {productionStatus.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-sm uppercase tracking-wide text-cyan-300">
                  {item.title} — {item.state}
                </p>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Module Wireframe</p>
          <h2 className="mt-2 text-xl font-semibold">Core app navigation</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Each module is connected through the homepage gateway so the platform behaves as a unified operational interface while deeper registry logic,
            synchronization layers, APIs, and database-backed workflows are deployed incrementally in controlled production phases.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {moduleSections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{section.eyebrow}</p>
              <h3 className="mt-2 text-2xl font-semibold">{section.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{section.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-200">
                {section.points.map((point) => (
                  <p key={point} className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2">
                    • {point}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
