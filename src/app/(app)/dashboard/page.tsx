import Link from 'next/link';
import { AppStatusPanel } from '@/components/AppStatusPanel';
import { dashboardCards, whatThisAppDoes } from '@/lib/onegodian-content';

export const metadata = { title: 'OneGodian App | Command Dashboard', description: 'The official OneGodian App dashboard for identity, membership, certificates, systems, tools, campaigns, products, and ecosystem access.' };

export default function DashboardPage() {
  return <main className="space-y-8"><header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6"><h1 className="text-3xl font-bold">OneGodian App Dashboard</h1></header>
  <section><h2 className="mb-3 text-xl font-semibold">Command Modules</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{dashboardCards.map((card)=><Link key={card.href} href={card.href} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><h3 className="font-medium">{card.title}</h3><p className="mt-2 text-sm text-slate-300">{card.description}</p><p className="mt-2 text-xs text-cyan-300">{card.status}</p></Link>)}</div></section>
  <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6"><h2 className="text-xl font-semibold">What This App Does</h2><ul className="mt-3 list-disc space-y-2 pl-6 text-slate-300">{whatThisAppDoes.map((item) => <li key={item}>{item}</li>)}</ul></section>
  <AppStatusPanel />
  </main>;
}
