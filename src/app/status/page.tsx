import { PageHeader } from '@/components/PageHeader';
import { appRepository, dashboardModules, domainStructure } from '@/lib/acc-content';
import { StatusBadge } from '@/components/StatusBadge';

export default function StatusPage() {
  return (
    <main className="space-y-6">
      <PageHeader eyebrow="App Status" title="OneGodian App readiness" description="Readiness summary for the public and member-facing OneGodian App gateway." />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-3xl border border-emerald-300/30 bg-emerald-300/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">Deploy target</p>
          <p className="mt-3 break-words text-2xl font-black text-white">{appRepository.deployTarget}</p>
          <p className="mt-2 text-sm text-emerald-50/80">Canonical host configured for the OneGodian App.</p>
        </article>
        <article className="rounded-3xl border border-amber-300/30 bg-amber-300/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-100">Modules</p>
          <p className="mt-3 text-2xl font-black text-white">{dashboardModules.length}</p>
          <p className="mt-2 text-sm text-amber-50/80">Public and member-facing routes available.</p>
        </article>
        <article className="rounded-3xl border border-purple-300/30 bg-purple-400/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-100">Domain roles</p>
          <p className="mt-3 text-2xl font-black text-white">{domainStructure.length}</p>
          <p className="mt-2 text-sm text-purple-50/80">Production domain roles documented.</p>
        </article>
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
        <h2 className="text-2xl font-black text-white">Module readiness</h2>
        <div className="mt-5 grid gap-3">
          {dashboardModules.map((module) => (
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
