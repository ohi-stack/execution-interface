import Link from 'next/link';
import { dashboardCards } from '@/lib/onegodian-content';

export default function DashboardPage() {
  return <main className="space-y-8"><header className="rounded-2xl border border-cyan-400/30 bg-slate-950 p-6"><h1 className="text-3xl font-bold text-cyan-200">ONEGODIAN APP COMMAND DASHBOARD</h1></header><section className="grid gap-4 md:grid-cols-2">{dashboardCards.map((card) => <article key={card.title} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{card.title}</h2><span className="text-xs text-cyan-300">{card.status}</span></div><p className="mt-2 text-sm text-slate-300">{card.description}</p><Link href={card.href} className="mt-3 inline-block text-cyan-300">Open</Link></article>)}</section></main>;
}
