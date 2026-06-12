import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { appPositioning, dashboardModules, pluginShortcodes } from '@/lib/acc-content';

const fallback = {
  title: 'OneGodian App Module',
  href: '/',
  status: 'coming-soon' as const,
  description: 'Member-facing module reserved for the OneGodian App gateway.'
};

export function ConsolePage({ href, children }: { href: string; children?: React.ReactNode }) {
  const appModule = dashboardModules.find((item) => item.href === href) ?? fallback;

  return (
    <main className="space-y-6">
      <PageHeader eyebrow="OneGodian App Route" title={appModule.title} description={appModule.description} />
      <section className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
        <article className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h2 className="text-2xl font-black text-white">Route details</h2>
            <StatusBadge status={appModule.status} />
          </div>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-black uppercase tracking-[0.16em] text-slate-400">Route</dt>
              <dd className="mt-1 font-semibold text-slate-100">{appModule.href}</dd>
            </div>
            <div>
              <dt className="font-black uppercase tracking-[0.16em] text-slate-400">Scope</dt>
              <dd className="mt-1 leading-6 text-slate-300">Public and member-facing gateway for the OneGodian ecosystem.</dd>
            </div>
            <div>
              <dt className="font-black uppercase tracking-[0.16em] text-slate-400">Domain separation</dt>
              <dd className="mt-1 leading-6 text-slate-300">{appPositioning.boundary}</dd>
            </div>
          </dl>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
          <h2 className="text-2xl font-black text-white">Module content</h2>
          <div className="mt-4 text-sm leading-7 text-slate-300">
            {children ?? <p>This module is ready for live app content, WordPress plugin bridge references, and ecosystem links.</p>}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/dashboard" className="rounded-full border border-amber-200/50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-amber-100">Dashboard</Link>
            <Link href="/ecosystem" className="rounded-full border border-purple-300/40 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100">Ecosystem</Link>
          </div>
        </article>
      </section>
      <section className="rounded-3xl border border-purple-300/25 bg-purple-400/10 p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-100">WordPress plugin bridge</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {pluginShortcodes.map((shortcode) => <code key={shortcode} className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-slate-200">{shortcode}</code>)}
        </div>
      </section>
    </main>
  );
}
