import Link from 'next/link';
import { AuthorityGrid } from '@/components/AuthorityGrid';
import { ModuleCard } from '@/components/ModuleCard';
import { accPositioning, accRepository, consoleModules, separationRules } from '@/lib/acc-content';

export default function HomePage() {
  return (
    <main className="space-y-8">
      <section className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">{accPositioning.eyebrow}</p>
        <h1 className="mt-4 max-w-5xl text-[clamp(3rem,10vw,6.5rem)] font-black leading-[0.9] tracking-[-0.07em] text-white">{accPositioning.name}</h1>
        <p className="mt-6 max-w-4xl text-xl font-bold leading-9 text-cyan-50 sm:text-2xl">{accPositioning.summary}</p>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300">{accPositioning.boundary}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-full border border-cyan-200/60 bg-cyan-200 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950 shadow-cyan transition hover:-translate-y-0.5 hover:bg-cyan-100">Open Dashboard</Link>
          <Link href="/docs" className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:border-cyan-200/40">Read Console Doctrine</Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Repository</p>
          <p className="mt-3 text-2xl font-black text-white">{accRepository.owner}/{accRepository.name}</p>
          <p className="mt-2 text-sm text-slate-300">Canonical ACC repository for operator interface code.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Deploy Target</p>
          <p className="mt-3 text-2xl font-black text-white">{accRepository.canonicalHost}</p>
          <p className="mt-2 text-sm text-slate-300">Noindex operator deployment at {accRepository.deployTarget}.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Scope</p>
          <p className="mt-3 text-2xl font-black text-white">Interface Only</p>
          <p className="mt-2 text-sm text-slate-300">OSCC, OCP, OEG, identity, registry, and audit retain authority.</p>
        </article>
      </section>

      <section>
        <div className="mb-5 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Operator modules</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">ACC screens and routes</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{consoleModules.map((module) => <ModuleCard key={module.href} module={module} />)}</div>
      </section>

      <section className="space-y-5">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Authority boundary</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">ACC observes and invokes; external systems authorize.</h2>
        </div>
        <AuthorityGrid />
      </section>

      <section className="rounded-[2rem] border border-amber-300/30 bg-amber-300/10 p-6">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-100">Repository separation rules</p>
        <ul className="mt-4 grid gap-3 text-sm font-semibold leading-6 text-amber-50 md:grid-cols-2">
          {separationRules.map((rule) => <li key={rule}>• {rule}</li>)}
        </ul>
      </section>
    </main>
  );
}
