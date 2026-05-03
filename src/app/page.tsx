import Link from 'next/link';

type CommandModule = {
  title: string;
  href: string;
  description: string;
  icon: string;
  status: 'Live' | 'In Development' | 'Needs Setup' | 'Planned';
};

type SystemStatus = {
  title: string;
  status: 'Live' | 'In Development' | 'Needs Setup' | 'Planned';
};

const commandModules: CommandModule[] = [
  { title: 'Algorithm', href: '/algorithm', description: 'Four-layer operational model for protocol, experience, community, and orientation.', icon: '◈', status: 'Live' },
  { title: 'OMOS', href: '/omos', description: 'Operational module index for command workflows and system alignment.', icon: '◎', status: 'In Development' },
  { title: 'Time', href: '/time', description: 'OTS-V5 timing reference, conversion tools, and legal-time guidance.', icon: '⏣', status: 'Live' },
  { title: 'Protocol', href: '/protocol', description: 'Protocol governance references and implementation placeholders.', icon: '⌬', status: 'In Development' },
  { title: 'AI Prompt', href: '/ai-system-prompt', description: 'Behavioral and classification standards for AI system usage.', icon: '✦', status: 'Live' },
  { title: 'Identity', href: '/identity', description: 'Identity model, records, and LLC/INO separation references.', icon: '▣', status: 'Live' },
  { title: 'Pipeline', href: '/pipeline', description: 'Compare, Filter, Normalize, and Output workflow specification.', icon: '⇄', status: 'In Development' },
  { title: 'Gen Alpha', href: '/gen-alpha', description: 'Belief Mapper Lite stages for guided user progression.', icon: '△', status: 'Planned' },
  { title: 'Docs', href: '/docs', description: 'Document library cards for system records and milestones.', icon: '☰', status: 'Needs Setup' },
];

const systemStatuses: SystemStatus[] = [
  { title: 'Node App Live', status: 'Live' },
  { title: 'Hostinger Deployment Active', status: 'Live' },
  { title: 'Ecosystem Directory', status: 'Live' },
  { title: 'Time Converter', status: 'In Development' },
  { title: 'Docs Library', status: 'Needs Setup' },
  { title: 'API Gateway', status: 'Needs Setup' },
  { title: 'GitHub Repo Matrix', status: 'In Development' },
  { title: 'Alignment Demo', status: 'Planned' },
];

const statusStyles: Record<SystemStatus['status'], string> = {
  Live: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200',
  'In Development': 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200',
  'Needs Setup': 'border-amber-400/50 bg-amber-500/10 text-amber-200',
  Planned: 'border-violet-400/50 bg-violet-500/10 text-violet-200',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.08)] sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">ONEGODIAN COMMAND DASHBOARD</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">OneGodian System Control Surface</h1>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Command access for operational modules, records, timing systems, and documentation. Status tags indicate current implementation maturity.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 sm:text-base">Open Dashboard</Link>
            <Link href="/algorithm" className="rounded-xl border border-cyan-400/60 bg-slate-950/60 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300 sm:text-base">View Algorithm</Link>
            <Link href="/docs" className="rounded-xl border border-slate-600 bg-slate-950/60 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300 sm:text-base">Open Docs</Link>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">Command Modules</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {commandModules.map((module) => (
              <Link key={module.title} href={module.href} className="group rounded-xl border border-slate-700 bg-slate-950/70 p-5 transition hover:border-cyan-400/60 hover:bg-slate-900">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-2xl text-cyan-300">{module.icon}</span>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusStyles[module.status]}`}>{module.status}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-50">{module.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{module.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <h2 className="text-xl font-semibold sm:text-2xl">System Status</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {systemStatuses.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-200">{item.title}</p>
                <span className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusStyles[item.status]}`}>
                  {item.status}
                </span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
