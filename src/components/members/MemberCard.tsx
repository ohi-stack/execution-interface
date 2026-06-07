import Link from 'next/link';
import type { ContentCard } from '@/data/onegodianContent';

export function MemberCard({ card }: { card: ContentCard }) {
  return (
    <article className="mobile-card min-w-0">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-black tracking-[-0.02em] text-white">{card.title}</h2>
        <span className="shrink-0 rounded-full border border-gold-300/30 bg-gold-300/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-gold-100">
          {card.status}
        </span>
      </div>
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
      <Link href={card.href} className="premium-button-secondary mt-5">
        {card.action}
      </Link>
    </article>
  );
}
