import { PageHeader } from '@/components/PageHeader';
import { accRepository, authorityServices, consoleModules } from '@/lib/acc-content';
import { StatusBadge } from '@/components/StatusBadge';

export default function StatusPage() {
  return (
    <main className="space-y-6">
      <PageHeader eyebrow="ACC Status" title="Operational Status" description="Readiness summary for the canonical ACC operator interface and its external authority bindings." />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-3xl border border-emerald-300/30 bg-emerald-300/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">Deploy target</p>
          <p className="mt-3 text-2xl font-black text-white">{accRepository.deployTarget}</p>
          <p className="mt-2 text-sm text-emerald-50/80">Canonical host configured for ACC.</p>
        </article>
        <article className="rounded-3xl border border-cyan-300/30 bg-cyan-300/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-100">Modules</p>
          <p className="mt-3 text-2xl font-black text-white">{consoleModules.length}</p>
          <p className="mt-2 text-sm text-cyan-50/80">Operator-facing routes available.</p>
        </article>
        <article className="rounded-3xl border border-cyan-300/30 bg-cyan-300/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-100">Authority services</p>
          <p className="mt-3 text-2xl font-black text-white">{authorityServices.length}</p>
          <p className="mt-2 text-sm text-cyan-50/80">External systems retain authority.</p>
        </article>
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
        <h2 className="text-2xl font-black text-white">Module readiness</h2>
        <div className="mt-5 grid gap-3">
          {consoleModules.map((module) => (
            <div key={module.href} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-black text-white">{module.title}</p>
                <p className="text-sm text-slate-400">{module.href}</p>
              </div>
              <StatusBadge status={module.status} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
