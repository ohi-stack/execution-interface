import Link from 'next/link';
import { ModuleCard } from '@/components/ModuleCard';
import { appPositioning, appRepository, dashboardModules, domainStructure, homepageSections } from '@/lib/acc-content';

export default function HomePage() {
  return (
    <main className="space-y-8">
      <section className="overflow-hidden rounded-[2.25rem] border border-amber-200/15 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8 lg:p-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-200">{appPositioning.eyebrow}</p>
        <h1 className="mt-4 max-w-5xl text-[clamp(2.6rem,9vw,6.25rem)] font-black leading-[0.92] tracking-[-0.07em] text-white">{appPositioning.shortName}</h1>
        <p className="mt-6 max-w-4xl text-xl font-bold leading-9 text-amber-50 sm:text-2xl">{appPositioning.summary}</p>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300">{appPositioning.boundary}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-full border border-amber-200/60 bg-amber-200 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950 shadow-gold transition hover:-translate-y-0.5 hover:bg-amber-100">Open Dashboard</Link>
          <Link href="/members" className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:border-purple-200/40">Membership</Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Repository</p>
          <p className="mt-3 break-words text-2xl font-black text-white">{appRepository.owner}/{appRepository.name}</p>
          <p className="mt-2 text-sm text-slate-300">Production deployment repository for the public OneGodian App surface.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Deploy Target</p>
          <p className="mt-3 break-words text-2xl font-black text-white">{appRepository.canonicalHost}</p>
          <p className="mt-2 text-sm text-slate-300">Public and member-facing gateway at {appRepository.deployTarget}.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Domain Role</p>
          <p className="mt-3 text-2xl font-black text-white">Gateway</p>
          <p className="mt-2 text-sm text-slate-300">Identity and education link to .org; commerce and payments link to .com.</p>
        </article>
      </section>

      <section>
        <div className="mb-5 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-200">App sections</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">Current OneGodian ecosystem access</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {homepageSections.map((section) => (
            <Link key={section.title} href={section.href} className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 transition hover:-translate-y-1 hover:border-amber-300/40">
              <h3 className="text-xl font-black text-white">{section.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-purple-200">Dashboard modules</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">Real module cards and routes</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{dashboardModules.map((module) => <ModuleCard key={module.href} module={module} />)}</div>
      </section>

      <section className="rounded-[2rem] border border-amber-300/30 bg-amber-300/10 p-6">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-100">Production domain structure</p>
        <div className="mt-4 grid gap-3 text-sm leading-6 text-amber-50 md:grid-cols-2">
          {domainStructure.map((domain) => <p key={domain.host}><strong>{domain.host}</strong> — {domain.role}</p>)}
        </div>
      </section>
    </main>
  );
}
