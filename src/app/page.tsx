import Link from 'next/link';
import { appMeta } from '@/lib/onegodian-content';

export default function HomePage() {
  return <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl space-y-10"><section className="rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-8"><p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{appMeta.eyebrow}</p><h1 className="mt-3 text-4xl font-bold">{appMeta.title}</h1><p className="mt-4 max-w-4xl text-slate-300">{appMeta.description}</p><div className="mt-5 flex gap-3"><Link className="rounded-lg bg-cyan-500/20 px-4 py-2 text-cyan-200" href={appMeta.primaryCta.href}>{appMeta.primaryCta.label}</Link><Link className="rounded-lg border border-slate-600 px-4 py-2" href={appMeta.secondaryCta.href}>{appMeta.secondaryCta.label}</Link></div></section></div></main>;
}
