import Link from 'next/link';
import { type ReactNode } from 'react';

type CapitalPageProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: { href: string; label: string }[];
};

export function CapitalPage({ eyebrow = 'ONEGODIAN CAPITAL PORTAL™', title, subtitle, children, actions }: CapitalPageProps) {
  return (
    <main className="capital-page onegodian-surface mx-auto w-full max-w-7xl px-4 py-6 text-slate-100 sm:px-6 lg:px-8 lg:py-10">
      <section className="glass-panel capital-hero relative overflow-hidden p-5 sm:p-8 lg:p-10">
        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-gold-300/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-purple-300/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-gold-300">{eyebrow}</p>
          <h1 className="mt-3 max-w-5xl text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">{title}</h1>
          {subtitle ? <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300 sm:text-lg">{subtitle}</p> : null}
          {actions ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
              {actions.map((action, index) => (
                <Link key={action.href} href={action.href} className={index === 0 ? 'premium-button' : 'premium-button-secondary'}>
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
      <div className="mt-6 space-y-6">{children}</div>
    </main>
  );
}

export function CapitalCardGrid({ children, cols = 'lg:grid-cols-3' }: { children: ReactNode; cols?: string }) {
  return <section className={`grid gap-4 sm:grid-cols-2 ${cols}`}>{children}</section>;
}

export function CapitalCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="mobile-card">
      <h2 className="text-xl font-black text-white">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-slate-300">{children}</div>
    </article>
  );
}

export function NoticePanel({ children }: { children: ReactNode }) {
  return <section className="rounded-3xl border border-gold-300/25 bg-gold-300/10 p-5 text-sm leading-6 text-gold-50 backdrop-blur-xl">{children}</section>;
}
