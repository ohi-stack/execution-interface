import Link from 'next/link';
import type { ContentRoute } from '@/data/onegodianContent';

const isExternal = (href: string) => href.startsWith('http');

export function ContentRoutePage({ content }: { content: ContentRoute }) {
  return (
    <main className="space-y-6 sm:space-y-8">
      <section className="glass-panel overflow-hidden p-5 sm:p-7 lg:p-10">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300 sm:tracking-[0.3em]">{content.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(2rem,10vw,4.6rem)] font-black leading-[0.95] tracking-[-0.055em] text-white">{content.title}</h1>
          <p className="mt-5 text-xl font-bold leading-8 text-gold-100 sm:text-2xl sm:leading-9">{content.headline}</p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">{content.description}</p>
        </div>
        {content.portal ? (
          <div className="mt-7">
            <Link href={content.portal.href} className="premium-button" target={isExternal(content.portal.href) ? '_blank' : undefined} rel={isExternal(content.portal.href) ? 'noreferrer' : undefined}>
              {content.portal.label}
            </Link>
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.cards.map((card, index) => (
          <article key={card.title} className="mobile-card min-w-0">
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-cyan-100">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="rounded-full border border-gold-300/30 bg-gold-300/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-gold-100">
                {card.status}
              </span>
            </div>
            <h2 className="mt-5 text-xl font-black tracking-[-0.02em] text-white">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{card.description}</p>
            {card.metrics?.length ? (
              <ul className="mt-4 space-y-2">
                {card.metrics.map((metric) => (
                  <li key={metric} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-purple-100">
                    {metric}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-5">
              <Link href={card.href} className="premium-button-secondary" target={isExternal(card.href) ? '_blank' : undefined} rel={isExternal(card.href) ? 'noreferrer' : undefined}>
                {card.action}
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
