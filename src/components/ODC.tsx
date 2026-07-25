import Link from 'next/link';
import type { FeatureStatus } from '@/lib/odc';

export function Badge({ status }: { status: FeatureStatus }) { return <span className={`badge badge-${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>; }
export function PageHero({ eyebrow='ODC Platform', title, intro }: { eyebrow?: string; title: string; intro: string }) { return <header className="page-hero"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header>; }
export function Card({ title, children }: { title: string; children: React.ReactNode }) { return <article className="card"><h2>{title}</h2>{children}</article>; }
export function CTA() { return <section className="cta"><div><p className="eyebrow">Verified information</p><h2>Build with the canonical ODC record.</h2><p>Use the public, versioned API without handling private keys or custody.</p></div><div className="actions"><Link className="button" href="/docs">Read documentation</Link><Link className="button secondary" href="/api/manifest">View manifest</Link></div></section>; }
