import Link from 'next/link';

const panels = ['Dashboard', 'Settings', 'App Bridge', 'API Keys', 'Submissions', 'Tools', 'Status', 'Production Checklist', 'Documentation', 'Logs / audit trail'];

export default function AdminPage() {
  return <main className="space-y-6"><header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6"><h1 className="text-3xl font-bold">Admin / Control Panel</h1><p className="mt-2 text-slate-300">Role-based admin gating placeholder with secure bridge key handling and environment review.</p></header>
  <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{panels.map((item)=><article key={item} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><h2 className="font-semibold">{item}</h2><p className="mt-2 text-xs text-slate-300">Operational placeholder</p></article>)}</section>
  <Link href="/docs" className="inline-block text-cyan-300">Open documentation</Link></main>;
}
