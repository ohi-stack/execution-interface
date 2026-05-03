import Link from 'next/link';
import { appModules, type Priority, type ProductionStatus } from '@/lib/app-modules';

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

const statusStyles: Record<ProductionStatus, string> = {
  Live: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
  'Demo Ready': 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300',
  Staging: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  'In Development': 'border-violet-500/40 bg-violet-500/15 text-violet-300',
  'Needs Setup': 'border-orange-500/40 bg-orange-500/15 text-orange-300',
  Planned: 'border-slate-500/40 bg-slate-500/15 text-slate-300',
  Offline: 'border-red-500/40 bg-red-500/15 text-red-300'
};

const priorityStyles: Record<Priority, string> = {
  Critical: 'border-red-500/40 bg-red-500/10 text-red-300',
  High: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
  Medium: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  Low: 'border-slate-500/40 bg-slate-500/10 text-slate-300'
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
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">ONEGODIAN APP · APP.ONEGODIAN.COM</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">OneGodian App Systems Model</h1>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Central interface layer for navigation, discovery, dashboards, tools, games, records, products, certificates, and future execution environments.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {appModules.map((module) => (
          <article key={module.slug} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{module.category}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{module.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{module.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
              <span className={`rounded-full border px-2 py-1 ${statusStyles[module.productionStatus]}`}>{module.productionStatus}</span>
              <span className={`rounded-full border px-2 py-1 ${priorityStyles[module.priority]}`}>{module.priority} Priority</span>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-slate-300">
              {module.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Link href={module.route} className="mt-5 inline-flex rounded-lg border border-cyan-400/70 px-4 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-500/10">
              Open Module
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
