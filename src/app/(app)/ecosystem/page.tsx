import Link from 'next/link';
import { ecosystemHierarchy } from '@/data/onegodianContent';

export default function EcosystemPage() {
  return (
    <main className="space-y-6 sm:space-y-8">
      <section className="glass-panel overflow-hidden p-5 sm:p-7 lg:p-10">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300 sm:tracking-[0.3em]">Ecosystem Architecture</p>
          <h1 className="mt-4 text-[clamp(2rem,10vw,4.6rem)] font-black leading-[0.95] tracking-[-0.055em] text-white">OneGodian Ecosystem</h1>
          <p className="mt-5 text-xl font-bold leading-8 text-gold-100 sm:text-2xl sm:leading-9">Domain hierarchy for education, commerce, learning, app, OMOS, capital, enterprise strategy, and verification.</p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">This page renders the documented ecosystem tree from the shared content source so the application can route each domain, child surface, and future API handoff from one operational structure.</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ecosystemHierarchy.map((node) => (
          <article key={node.domain} className="mobile-card min-w-0">
            <Link href={node.href} target="_blank" rel="noreferrer" className="text-xl font-black tracking-[-0.02em] text-white transition hover:text-gold-100">
              {node.domain}
            </Link>
            <ul className="mt-5 space-y-3">
              {node.children.map((child) => (
                <li key={child} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-gold-300 shadow-gold" />
                  {child}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
