import Link from 'next/link';
import { systemHierarchy } from '@/lib/system-hierarchy';

const statusStyles = {
  Live: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
  'In Development': 'border-violet-500/40 bg-violet-500/15 text-violet-300',
  Planned: 'border-slate-500/40 bg-slate-500/15 text-slate-300'
};

export default function SystemsPage() {
  return (<main className="space-y-8">{/*...*/}
    <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6 sm:p-8"><p className="text-xs uppercase tracking-[0.22em] text-cyan-300">ONEGODIAN APP · SYSTEMS MODEL</p><h1 className="mt-3 text-3xl font-bold sm:text-4xl">OneGodian Ecosystem Hierarchy</h1><p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-300 sm:text-base">The May 2026 hierarchy organizes the OneGodian ecosystem into layered systems: founder origin, framework, institutions, platforms, registries, commerce, applications, media, expansion, and infrastructure control.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/" className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">Open Dashboard</Link><Link href="/ecosystem" className="rounded-lg border border-cyan-400/60 px-4 py-2 text-sm font-semibold text-cyan-200">Explore Ecosystem</Link></div></section>
    <section className="grid gap-4 md:grid-cols-2">{systemHierarchy.map((layer)=><article key={layer.level} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{layer.level}</p><h2 className="mt-2 text-2xl font-semibold text-white"><span className="mr-2">{layer.emoji}</span>{layer.title}</h2></div><span className={`rounded-full border px-2 py-1 text-xs font-medium ${statusStyles[layer.status]}`}>{layer.status}</span></div><p className="mt-3 text-sm leading-relaxed text-slate-300">{layer.description}</p><div className="mt-4 flex flex-wrap gap-2">{layer.examples.map((example)=><span key={example} className="rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1 text-xs text-slate-300">{example}</span>)}</div></article>)}</section>
    <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6"><p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Infrastructure Thesis</p><h2 className="mt-2 text-2xl font-semibold text-white">The Real Competition Is Infrastructure Control</h2><p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-300">The OneGodian App should continue moving toward identity control, verification control, execution environments, platform orchestration, system interoperability, and infrastructure ownership.</p></section>
  </main>);
const hierarchy = ['Founder','Framework','Institutional','Platform','Systems','Registry','Commerce','Infrastructure'];
const coreSystems = ['OHI™','Quantum-OHI™','OMOS™','ACC™','OBP-1™','OTS-V5™'];

export default function SystemsPage() {
  return <main className="space-y-6">
    <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6"><h1 className="text-3xl font-bold">OneGodian Systems</h1><p className="mt-2 text-slate-300">Architecture, infrastructure positioning, and investor-facing systems map.</p></section>
    <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6"><h2 className="text-xl font-semibold">🌐 OneGodian Ecosystem Hierarchy</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{hierarchy.map((i,idx)=><div key={i} className="rounded border border-cyan-500/20 p-3">{idx+1}. {i}</div>)}</div></section>
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{coreSystems.map((s)=><article key={s} className="rounded-xl border border-slate-700 bg-slate-900/50 p-4"><h3 className="font-semibold">{s}</h3><p className="mt-2 text-sm text-slate-300">Status: Active • Runtime: Syncing • Docs: Pending link</p></article>)}</section>
    <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6"><h2 className="text-xl font-semibold">🏗 Infrastructure Layer</h2><p className="mt-2 text-slate-300">Identity, verification, execution, and infrastructure orchestration combine into a unified systems-runtime layer for operational delivery.</p></section>
  </main>;
}
