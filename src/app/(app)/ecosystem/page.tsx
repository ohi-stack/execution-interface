import Link from 'next/link';
import { ecosystemPortals } from '@/lib/onegodian-content';

export const metadata = { title: 'OneGodian App | Ecosystem', description: 'Official OneGodian ecosystem portals for store, public site, education, capital, app, and API.' };

export default function EcosystemPage() {
  return <main className="space-y-8"><header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6"><h1 className="text-3xl font-bold">Ecosystem</h1></header>
  <section className="grid gap-4 sm:grid-cols-2">{ecosystemPortals.map((p)=><article key={p.url} className="rounded-xl border border-cyan-500/20 bg-slate-900/70 p-5"><p className="text-xs text-cyan-300">{p.type}</p><h2 className="mt-2 text-xl font-semibold">{p.name}</h2><p className="mt-2 text-sm text-slate-300">{p.description}</p><Link href={p.url} className="mt-3 inline-block text-sm text-cyan-300">Open portal</Link></article>)}</section>
  </main>;
}
