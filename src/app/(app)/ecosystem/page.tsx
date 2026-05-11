import { ONEGODIAN_ECOSYSTEM } from '@/lib/ecosystem';

const appStructureStandard = ['Public-facing page', 'Logged-in dashboard', 'Admin/control panel', 'API/bridge endpoint', 'Documentation', 'Production checklist'];

export default function EcosystemPage() {
  return (
    <main className="space-y-8">
      <header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">OneGodian Ecosystem</h1>
        <p className="mt-3 text-slate-300">The OneGodian App is the central command interface for systems, plugins, dashboards, tools, registries, media, products, certificates, and ecosystem navigation.</p>
      </header>
      <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
        <h2 className="text-xl font-semibold">OneGodian App Structure Standard</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">{appStructureStandard.map((item) => <li key={item} className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm">{item}</li>)}</ul>
      </section>
      <section aria-label="Ecosystem modules" className="grid gap-4 sm:grid-cols-2">
        {ONEGODIAN_ECOSYSTEM.map((module) => (
          <article key={module.id} className="rounded-xl border border-cyan-500/20 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{module.id}</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-100">{module.name}</h2>
            <p className="mt-2 text-sm text-slate-300">{module.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
