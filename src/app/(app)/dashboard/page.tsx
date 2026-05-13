import Link from 'next/link';
import { ecosystemProperties } from '@/lib/control-plane';

const auxiliaryCards = [
  { title: 'Repositories', role: 'GitHub / deployment status', status: 'Monitoring', description: 'Track repository branch health, release tags, and deployment sync.', href: '/admin' },
  { title: 'Plugin Status', role: 'WordPress plugin bridges', status: 'Operational', description: 'Bridge placeholders for members, OMOS, and capital plugins via server APIs.', href: '/plugins' },
  { title: 'API Health', role: 'Node endpoints', status: 'Operational', description: 'Core API health, manifest, tools, and stats endpoints exposed for automation.', href: '/api/health' }
];

export default function DashboardPage() {
  return <main className="space-y-8"><header className="rounded-2xl border border-cyan-400/30 bg-slate-950 p-6"><h1 className="text-3xl font-bold text-cyan-200">OneGodian Digital Ecosystem Control Plane</h1><p className="mt-2 text-slate-300">Operational dashboard for the seven official OneGodian properties at app.onegodian.com.</p></header>
  <section className="grid gap-4 lg:grid-cols-2">{ecosystemProperties.map((card)=><article key={card.key} className="rounded-2xl border border-blue-500/20 bg-slate-900/70 p-5"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-gold-200">{card.title} Card</h2><span className="rounded-full border border-cyan-400/50 px-3 py-1 text-xs text-cyan-200">{card.status}</span></div><p className="mt-2 text-sm text-slate-300">{card.role}</p><p className="mt-1 text-xs text-blue-300">{card.domain}</p><p className="mt-3 text-sm text-slate-300">{card.description}</p><p className="mt-2 text-xs text-emerald-300">Health: {card.health}</p><ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-300">{card.checklist.map((item)=><li key={item}>{item}</li>)}</ul><div className="mt-4 flex gap-2"><Link href={card.href} className="rounded-lg bg-cyan-500/20 px-3 py-2 text-sm text-cyan-200">Open site</Link>{card.adminHref && <Link href={card.adminHref} className="rounded-lg border border-blue-400/40 px-3 py-2 text-sm text-blue-200">Admin/settings</Link>}</div></article>)}</section>
  <section className="grid gap-4 md:grid-cols-3">{auxiliaryCards.map((card)=><article key={card.title} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><h3 className="font-semibold">{card.title} Card</h3><p className="text-xs text-slate-400">{card.role}</p><p className="mt-2 text-sm text-slate-300">{card.description}</p><p className="mt-2 text-xs text-cyan-300">{card.status}</p><Link href={card.href} className="mt-3 inline-block text-sm text-cyan-300">Open</Link></article>)}</section></main>;
}
