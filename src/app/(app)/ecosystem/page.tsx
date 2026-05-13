import Link from 'next/link';
import { ecosystemProperties } from '@/lib/control-plane';

export default function EcosystemPage() {
  return <main className="space-y-8"><header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6"><h1 className="text-3xl font-bold">Ecosystem</h1><p className="mt-2 text-slate-300">Mirrored links and status for the official seven-property OneGodian domain map.</p></header>
  <section className="grid gap-4 md:grid-cols-2">{ecosystemProperties.map((p)=><article key={p.key} className="rounded-xl border border-cyan-500/20 bg-slate-900/70 p-5"><h2 className="text-xl font-semibold">{p.title}</h2><p className="mt-1 text-sm text-slate-300">{p.role}</p><p className="mt-1 text-xs text-cyan-300">{p.domain}</p><p className="mt-2 text-sm text-slate-300">{p.description}</p><div className="mt-3 flex gap-3"><Link href={p.href} className="text-sm text-cyan-300">Open site</Link>{p.adminHref && <Link href={p.adminHref} className="text-sm text-blue-300">Open controls</Link>}</div></article>)}</section>
  </main>;
}
