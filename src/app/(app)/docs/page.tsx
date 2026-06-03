import Link from 'next/link';
import { protocolDocs } from '@/lib/protocol-docs';

export default function DocsPage() {
  const featured = protocolDocs[0];

  return (
    <main className="space-y-6">
      <section className="glass-panel p-6 sm:p-8">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-gold-300/35 bg-gold-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-gold-100">Unified Engine</span>
          <span className="rounded-full border border-purple-300/25 bg-purple-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-purple-100">Markdown Ready</span>
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.32em] text-gold-300">Protocol Docs Engine</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">OneGodian Protocol Documentation</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
          A single documentation engine renders Protocol, Algorithm, System Prompt, GCD Synthesis, and OTS-V5 routes with sticky navigation, anchors, markdown rendering, copy controls, version badges, and PDF CTAs.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={`/docs/${featured.slug}`} className="premium-button">Open Protocol Docs</Link>
          <Link href="/docs/ots-v5" className="premium-button-secondary">Open OTS-V5</Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {protocolDocs.map((doc) => (
          <Link key={doc.slug} href={`/docs/${doc.slug}`} className="mobile-card group">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-gold-300/30 bg-gold-300/10 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-gold-100">{doc.version}</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-300">{doc.status}</span>
            </div>
            <h2 className="mt-4 text-2xl font-black text-white group-hover:text-gold-200">{doc.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{doc.description}</p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">Source: {doc.source}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
