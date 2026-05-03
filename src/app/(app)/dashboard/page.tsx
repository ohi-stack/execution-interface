import Link from 'next/link';

const cards = [
  { title: 'Ecosystem', description: 'Core OneGodian ecosystem map and module status.', href: '/ecosystem' },
  { title: 'Registry', description: 'ODIN registry systems and canonical record continuity.', href: '/registry' },
  { title: 'Planets', description: 'Planetary and moon registry operations.', href: '/planets' },
  { title: 'Time', description: 'OneGodian Time™ synchronization and daily references.', href: '/time' },
  { title: 'OHI', description: 'OHI™ and Quantum OHI™ system interfaces.', href: '/ohi' },
  { title: 'Algorithm', description: 'The Onegodian Algorithm™ command layers.', href: '/algorithm' },
  { title: 'AI System Prompt', description: 'Operational prompt standards and alignment rules.', href: '/ai-system-prompt' },
  { title: 'Assets', description: 'Digital assets, certificates, and property modules.', href: '/assets' },
  { title: 'Economics', description: 'Economic intelligence and ecosystem economics.', href: '/economics' },
  { title: 'Institutional Clarity', description: 'Institutional continuity, legal clarity, and governance surfaces.', href: '/identity' }
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-4 text-slate-300">
            The central Node/Next.js command interface for the core OneGodian ecosystem: ODIN registry systems, OneGodian Time™, OHI™, Quantum OHI™, The Onegodian Algorithm™, certificates, planets, assets, and synchronized platform infrastructure.
          </p>
        </header>

        <section>
          <h2 className="text-xl font-semibold">Production Status</h2>
          <p className="mt-2 text-sm text-slate-300">Core services are synchronized with active route and module health checks.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Today in OneGodian Time™</h2>
          <p className="mt-2 text-sm text-slate-300">Use the Time module for live UTC ↔ OT alignment and platform clock references.</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Core Systems</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.slice(0, 7).map((card) => (
              <Link key={card.title} href={card.href} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 hover:border-cyan-400/60">
                <h3 className="font-medium">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{card.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Digital Assets</h2>
          <Link href="/assets" className="block rounded-xl border border-slate-700 bg-slate-900/60 p-4 hover:border-cyan-400/60">Assets module for certificates, files, and asset tracking.</Link>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold">Institutional Clarity</h2>
          <Link href="/identity" className="block rounded-xl border border-slate-700 bg-slate-900/60 p-4 hover:border-cyan-400/60">Institutional Clarity module for continuity and governance references.</Link>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold">Economic Intelligence</h2>
          <Link href="/economics" className="block rounded-xl border border-slate-700 bg-slate-900/60 p-4 hover:border-cyan-400/60">Economics module for economic systems and ecosystem intelligence.</Link>
        </section>
      </div>
    </main>
  );
}
