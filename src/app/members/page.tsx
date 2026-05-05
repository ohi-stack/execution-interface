import Link from 'next/link';
import { memberEndpoints, membersProductionChecklist, memberTools, MEMBERS_WORDPRESS_BASE_URL } from '@/lib/members';

const statusStyles = {
  Ready: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
  'Needs WordPress Page': 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  'API Pending': 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300',
  'Admin Only': 'border-violet-500/40 bg-violet-500/15 text-violet-300'
} as const;

const commandStats = [
  { label: 'Plugin Version Target', value: 'v1.1.0' },
  { label: 'REST Endpoints', value: String(memberEndpoints.length) },
  { label: 'Member Tools', value: String(memberTools.length) },
  { label: 'App Status', value: 'Bridge Ready' }
];

export default function MembersPage() {
  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">MEMBERSHIP LAYER · WORDPRESS PLUGIN BRIDGE</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-5xl">OneGodian Members Command Center</h1>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-300 sm:text-base">
              App-side command surface for the OneGodian Members Plugin: member dashboard access, certificate retrieval,
              resource routing, account tools, plugin health checks, and administrative summary integration.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">WordPress Base URL</p>
            <p className="mt-2 break-all text-sm font-medium text-cyan-200">{MEMBERS_WORDPRESS_BASE_URL}</p>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Set NEXT_PUBLIC_MEMBERS_WORDPRESS_BASE_URL in production when the live WordPress membership domain is finalized.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {commandStats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {memberTools.map((tool) => (
          <article key={tool.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{tool.title}</h2>
              <span className={`whitespace-nowrap rounded-full border px-2 py-1 text-[11px] font-medium ${statusStyles[tool.status]}`}>
                {tool.status}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{tool.description}</p>
            <Link
              href={tool.href}
              className="mt-5 inline-flex rounded-lg border border-cyan-400/70 px-4 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-500/10"
            >
              {tool.label}
            </Link>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">API / BRIDGE LAYER</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Plugin REST Endpoints</h2>
          <div className="mt-5 space-y-4">
            {memberEndpoints.map((endpoint) => (
              <div key={endpoint.path} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-xs font-semibold text-cyan-200">{endpoint.method}</span>
                  <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300">{endpoint.access}</span>
                </div>
                <p className="mt-3 break-all font-mono text-xs text-cyan-100">{endpoint.path}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{endpoint.purpose}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300">PRODUCTION CHECKLIST</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Required Before Production Lock</h2>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-300">
            {membersProductionChecklist.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
