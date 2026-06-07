import Link from 'next/link';
import { type ReactNode } from 'react';
import { complianceSafeWording, productionRule } from '@/lib/omos-docs-content';

export function OmosPage({ eyebrow, title, description, children, cta }: { eyebrow: string; title: string; description: string; children: ReactNode; cta?: { href: string; label: string }[] }) {
  return (
    <main className="omos-page mx-auto w-full max-w-7xl px-4 py-6 text-slate-100 sm:px-6 lg:px-8 lg:py-10">
      <section className="glass-panel omos-hero relative overflow-hidden p-5 sm:p-8 lg:p-10">
        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-gold-300/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-gold-300">{eyebrow}</p>
          <h1 className="mt-3 max-w-5xl text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
          {cta ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {cta.map((item, index) => (
                <Link key={item.href} href={item.href} className={index === 0 ? 'premium-button' : 'premium-button-secondary'}>
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
      <ComplianceBand />
      <div className="mt-6 space-y-6">{children}</div>
    </main>
  );
}

export function CardGrid({ children, cols = 'lg:grid-cols-3' }: { children: ReactNode; cols?: string }) {
  return <section className={`grid gap-4 sm:grid-cols-2 ${cols}`}>{children}</section>;
}

export function InfoCard({ title, children, accent = 'cyan', meta }: { title: string; children: ReactNode; accent?: 'cyan' | 'gold' | 'green'; meta?: string }) {
  const color = accent === 'gold' ? 'text-gold-200 border-gold-300/30' : accent === 'green' ? 'text-emerald-200 border-emerald-300/30' : 'text-cyan-100 border-cyan-300/30';
  return (
    <article className={`mobile-card border ${color}`}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-black text-white">{title}</h2>
        {meta ? <span className="shrink-0 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-gold-100">{meta}</span> : null}
      </div>
      <div className="mt-3 text-sm leading-6 text-slate-300">{children}</div>
    </article>
  );
}

export function ProductionDocCard({ title, body, status, meta }: { title: string; body: string; status?: string; meta?: string }) {
  const active = status === 'Active' || status === 'Documented' || status === 'Monitored';
  return (
    <InfoCard title={title} meta={meta} accent={status === 'Monitored' ? 'green' : status === 'Documented' ? 'gold' : 'cyan'}>
      {status ? <StatusPill active={active}>{status}</StatusPill> : null}
      <p className={status ? 'mt-3' : undefined}>{body}</p>
    </InfoCard>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return <pre className="overflow-x-auto rounded-2xl border border-cyan-300/20 bg-black/60 p-4 text-sm leading-6 text-cyan-100"><code>{code}</code></pre>;
}

export function ComplianceBand() {
  return (
    <section className="mt-4 rounded-3xl border border-emerald-300/25 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-50">
      <p>{complianceSafeWording}</p>
      <p className="mt-2 font-semibold text-gold-100">{productionRule}</p>
    </section>
  );
}

export function StatusPill({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${active ? 'border-emerald-300/50 bg-emerald-300/10 text-emerald-100' : 'border-gold-300/40 bg-gold-300/10 text-gold-100'}`}>{children}</span>;
}
