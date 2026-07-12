import type { Metadata } from 'next';
import Link from 'next/link';
import { protocolDocs } from '@/data/protocol-docs';

export const metadata: Metadata = {
  title: 'Protocol Documentation Engine',
  description: 'Unified OMOS protocol, algorithm, prompt, synthesis, and OTS-V5 documentation.'
};

export default function Page() {
  return <main className="space-y-8">
    <section className="rounded-[2rem] border border-white/10 bg-white/[.055] p-8">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#F0D98A]">Unified Docs Engine</p>
      <h1 className="mt-3 text-5xl font-black text-white">Protocol Docs Engine</h1>
      <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">A single markdown-ready documentation system with sticky navigation, anchors, copy controls, version badges, and PDF calls to action.</p>
    </section>
    <div className="grid gap-4 md:grid-cols-2">
      {protocolDocs.map((doc) => <Link className="rounded-3xl border border-white/10 bg-white/[.055] p-6 transition hover:border-[#D8B35A]/60 hover:bg-[#D8B35A]/10" href={`/docs/${doc.slug}`} key={doc.slug}>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#D8B35A]/15 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#F0D98A]">{doc.badge}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white">{doc.version}</span>
        </div>
        <h2 className="mt-4 text-2xl font-black text-white">{doc.title}</h2>
        <p className="mt-3 text-slate-300">{doc.summary}</p>
      </Link>)}
    </div>
  </main>;
}
