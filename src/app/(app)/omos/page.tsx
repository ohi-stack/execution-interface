import Link from 'next/link';

const primaryRoutes = [
  { href: '/protocol', label: 'Protocol', detail: 'Human, semantic, agent, and interface layers for integration.' },
  { href: '/algorithm', label: 'Algorithm', detail: 'Observe, distill, align, select, execute, and verify.' },
  { href: '/docs', label: 'Documentation', detail: 'Implementation notes, definitions, and runtime references.' },
  { href: '/tools', label: 'Tools', detail: 'Bridge Builder, Belief Mapper, and operational utilities.' },
  { href: '/artifacts', label: 'Artifacts', detail: 'Whitepapers, prompts, schemas, and downloadable records.' },
  { href: '/dashboard', label: 'Developer Dashboard', detail: 'API surface, endpoint notes, and plan structure.' }
];

const runtimeRoutes = [
  { href: '/api/health', label: 'Health API' },
  { href: '/api/manifest', label: 'Runtime Manifest' },
  { href: '/api/pages', label: 'Page Registry' },
  { href: '/api/plugin/health', label: 'Plugin Health' },
  { href: '/api/plugin/manifest', label: 'Plugin Manifest' }
];

const layers = [
  ['Identity Layer', 'ONEGODIAN root identity and authored framework context.'],
  ['Protocol Layer', 'Interoperability rules for human, agent, and interface systems.'],
  ['Algorithm Layer', 'Coherence-first decision model for synthesis and execution.'],
  ['Runtime Layer', 'Manifest, page registry, plugin bridge, and health endpoints.'],
  ['Distribution Layer', 'WordPress bridge for OneGodian.com, OneGodian.org, and QuantumOHI.com.']
];

export default function OmosPage() {
  return (
    <main className="space-y-8">
      <section className="glass-panel overflow-hidden p-6 sm:p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">OMOS Runtime</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
          OneGodian Metaphysical Operating System™
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
          OMOS is the protocol, documentation, runtime-support, and developer-facing integration layer for the OneGodian ecosystem. It connects the Protocol, Algorithm, OHI concepts, manifests, tools, and WordPress distribution targets without moving checkout or institutional authority into the runtime node.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/protocol" className="premium-button">Open Protocol</Link>
          <Link href="/algorithm" className="premium-button-secondary">Open Algorithm</Link>
          <Link href="/api/manifest" className="premium-button-secondary">View Manifest</Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {primaryRoutes.map((route) => (
          <Link key={route.href} href={route.href} className="mobile-card group">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">OMOS Route</span>
            <h2 className="mt-3 text-2xl font-bold text-white group-hover:text-gold-200">{route.label}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{route.detail}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        {layers.map(([title, detail]) => (
          <article key={title} className="rounded-2xl border border-gold-300/20 bg-slate-950/60 p-5">
            <h2 className="text-lg font-bold text-gold-100">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{detail}</p>
          </article>
        ))}
      </section>

      <section className="glass-panel p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-200">Runtime APIs</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Live Endpoint Surface</h2>
          </div>
          <Link href="/dashboard" className="text-sm font-semibold text-cyan-300">Open Developer Dashboard →</Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {runtimeRoutes.map((route) => (
            <Link key={route.href} href={route.href} className="rounded-xl border border-cyan-400/20 bg-cyan-950/20 p-4 text-sm font-semibold text-cyan-100">
              {route.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
