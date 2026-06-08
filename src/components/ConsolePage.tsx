import { AuthorityGrid } from '@/components/AuthorityGrid';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { accPositioning, consoleModules } from '@/lib/acc-content';

const fallback = {
  title: 'ACC Module',
  href: '/',
  status: 'planned' as const,
  description: 'Operator module reserved for canonical ACC coverage.'
};

export function ConsolePage({ href, children }: { href: string; children?: React.ReactNode }) {
  const consoleModule = consoleModules.find((item) => item.href === href) ?? fallback;

  return (
    <main className="space-y-6">
      <PageHeader eyebrow="ACC Operator Route" title={consoleModule.title} description={consoleModule.description} />
      <section className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
        <article className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-2xl font-black text-white">Route posture</h2>
            <StatusBadge status={consoleModule.status} />
          </div>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-black uppercase tracking-[0.16em] text-slate-400">Route</dt>
              <dd className="mt-1 font-semibold text-slate-100">{consoleModule.href}</dd>
            </div>
            <div>
              <dt className="font-black uppercase tracking-[0.16em] text-slate-400">Scope</dt>
              <dd className="mt-1 leading-6 text-slate-300">Operator-facing interface only; no public/member-facing workflow lives here.</dd>
            </div>
            <div>
              <dt className="font-black uppercase tracking-[0.16em] text-slate-400">Authority</dt>
              <dd className="mt-1 leading-6 text-slate-300">{accPositioning.boundary}</dd>
            </div>
          </dl>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
          <h2 className="text-2xl font-black text-white">Operator notes</h2>
          <div className="mt-4 text-sm leading-7 text-slate-300">
            {children ?? <p>This canonical screen is ready for live bindings to OSCC, OCP, OEG, identity, registry, and audit APIs.</p>}
          </div>
        </article>
      </section>
      <AuthorityGrid />
    </main>
  );
}
