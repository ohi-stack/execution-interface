import Link from 'next/link';

const cards = [
  { title: 'Systems', href: '/ecosystem' },
  { title: 'Plugins', href: '/plugins' },
  { title: 'Registry', href: '/registry' },
  { title: 'Tools', href: '/tools' },
  { title: 'Certificates', href: '/certificates' },
  { title: 'Members', href: '/members' },
  { title: 'Products', href: '/products' },
  { title: 'Media', href: '/media' },
  { title: 'App Bridge', href: '/app-bridge' },
  { title: 'Production Checklist', href: '/production-checklist' }
];

export default function DashboardPage() {
  return (
    <main className="space-y-8">
      <header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">OneGodian App Dashboard</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Central command interface for systems, plugins, dashboards, tools, registries, media, products, certificates, and ecosystem navigation.</p>
      </header>
      <section>
        <h2 className="mb-3 text-xl font-semibold">Command Modules</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 hover:border-cyan-400/60">
              <h3 className="font-medium">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-300">Open {card.title} interface.</p>
            </Link>
          ))}
        </div>
      </section>
type Status = 'Live' | 'In Development' | 'Needs Setup' | 'Planned';

const modules: { icon: string; title: string; description: string; href: string; status: Status }[] = [
  { icon: '🧠', title: 'Algorithm', description: 'Four-layer operating framework for command and alignment.', href: '/algorithm', status: 'Live' },
  { icon: '🧩', title: 'OMOS', description: 'Operational module bridge configuration and runtime hooks.', href: '/omos', status: 'Live' },
  { icon: '🕒', title: 'Time', description: 'OTS-V5 reference, synchronized clocks, and legal note guidance.', href: '/time', status: 'In Development' },
  { icon: '📡', title: 'Protocol', description: 'Protocol boundaries and staged implementation controls.', href: '/protocol', status: 'Live' },
  { icon: '🤖', title: 'AI Prompt', description: 'System prompt standards for reliable and safe behavior.', href: '/ai-system-prompt', status: 'Live' },
  { icon: '🪪', title: 'Identity', description: 'Institutional records and entity separation references.', href: '/identity', status: 'Live' },
  { icon: '🔄', title: 'Pipeline', description: 'Compare, filter, normalize, and output workflow map.', href: '/pipeline', status: 'In Development' },
  { icon: '🎯', title: 'Gen Alpha', description: 'Belief Mapper Lite stages for learner progression.', href: '/gen-alpha', status: 'In Development' },
  { icon: '📘', title: 'Docs', description: 'Document library with current platform references.', href: '/docs', status: 'Needs Setup' }
];

const systemStatus: { title: string; status: Status }[] = [
  { title: 'Node App Live', status: 'Live' },
  { title: 'Hostinger Deployment Active', status: 'Live' },
  { title: 'Ecosystem Directory', status: 'Live' },
  { title: 'Time Converter', status: 'In Development' },
  { title: 'Docs Library', status: 'Needs Setup' },
  { title: 'API Gateway', status: 'Needs Setup' },
  { title: 'GitHub Repo Matrix', status: 'In Development' },
  { title: 'Alignment Demo', status: 'Planned' }
];

const statusStyles: Record<Status, string> = {
  Live: 'border-emerald-400/60 bg-emerald-500/15 text-emerald-200',
  'In Development': 'border-cyan-400/60 bg-cyan-500/15 text-cyan-200',
  'Needs Setup': 'border-amber-400/60 bg-amber-500/15 text-amber-200',
  Planned: 'border-violet-400/60 bg-violet-500/15 text-violet-200'
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">OneGodian Command Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Operational Command Surface</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">Mobile-first command entry for ecosystem modules, documentation, and system readiness. Status labels indicate current maturity only.</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/ecosystem" className="rounded-lg border border-cyan-400/70 px-4 py-2 text-cyan-200">Open Ecosystem</Link>
            <Link href="/milestones" className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200">View Milestones</Link>
          </div>
        </header>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Command Modules</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <Link key={module.title} href={module.href} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 transition hover:border-cyan-400/60">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xl" aria-hidden>{module.icon}</span>
                  <span className={`rounded-full border px-2 py-1 text-xs ${statusStyles[module.status]}`}>{module.status}</span>
                </div>
                <h3 className="mt-3 font-semibold">{module.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{module.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">System Status</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {systemStatus.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                <p className="text-sm text-slate-300">{item.title}</p>
                <p className={`mt-3 inline-flex rounded-full border px-2 py-1 text-xs ${statusStyles[item.status]}`}>{item.status}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
