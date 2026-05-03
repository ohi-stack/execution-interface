import Link from 'next/link';

const commandModules = [
  { icon: '🧭', title: 'Dashboard', href: '/', description: 'Central command and runtime overview.', status: 'Active' },
  { icon: '🌐', title: 'Ecosystem', href: '/ecosystem', description: 'Platform directory and system discovery.', status: 'Connected' },
  { icon: '🪪', title: 'Registry', href: '/registry', description: 'ODIN records, entries, and validation.', status: 'Connected' },
  { icon: '⚙️', title: 'Systems', href: '/systems', description: 'Infrastructure architecture and core system states.', status: 'Priority' },
  { icon: '👤', title: 'Members', href: '/members', description: 'Identity, profile, verification, and access.', status: 'Online' },
  { icon: '📈', title: 'Capital', href: '/capital', description: 'Scenario-driven financial and contribution systems.', status: 'Staging' },
  { icon: '🧠', title: 'Tools', href: '/tools', description: 'OMOS utilities and operational tooling layer.', status: 'Active' },
  { icon: '🎬', title: 'Media', href: '/media', description: 'Content, assets, and press distribution hub.', status: 'Online' },
  { icon: '🌌', title: 'Galaxy', href: '/galaxy', description: 'Planets, canon, moons, and world map.', status: 'Expanding' },
  { icon: '🧩', title: 'Developers', href: '/developers', description: 'Repositories, APIs, docs, and SDK pathing.', status: 'Syncing' }
];

export default function HomePage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">ONEGODIAN COMMAND HUB</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Unified Operational Interface</h1>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Identity, systems, registries, infrastructure, verification, execution, capital, tooling, media, and developer access synchronized through one runtime environment.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {commandModules.map((module) => (
          <article key={module.title} className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(34,211,238,0.05)]">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{module.icon}</span>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-200">{module.status}</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-white">{module.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{module.description}</p>
            <Link href={module.href} className="mt-4 inline-flex rounded-lg border border-cyan-400/70 px-4 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-500/10">
              Open {module.title}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
