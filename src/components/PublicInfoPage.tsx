import Link from 'next/link';
import type { PlatformStatus } from '@/config/platform-status';
import { PlatformStatusBadge } from './PlatformStatusBadge';

export function PublicInfoPage({ eyebrow, title, intro, status, cards }: { eyebrow: string; title: string; intro: string; status: PlatformStatus; cards: readonly { title: string; copy: string }[] }) {
  return <><header className="info-hero"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div><PlatformStatusBadge status={status} /></header><section className="public-card-grid info-grid" aria-label={`${title} overview`}>{cards.map((card) => <article className="public-card" key={card.title}><h2>{card.title}</h2><p>{card.copy}</p></article>)}</section><section className="info-next"><p>Capabilities are described by their current readiness—not their intended potential.</p><div className="actions"><Link className="button" href="/status">Review status</Link><Link className="button secondary" href="/docs">Read documentation</Link></div></section></>;
}
