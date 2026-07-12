import Link from 'next/link';
import { protocolDocs, type ProtocolDoc } from '@/data/protocol-docs';
import { getHeadings, MarkdownRenderer } from './MarkdownRenderer';
import { CopyButton } from './CopyButton';

export function DocsEngine({ doc }: { doc: ProtocolDoc }) {
  const headings = getHeadings(doc.markdown);
  return <main className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-[2rem] border border-white/10 bg-[#070607]/75 p-4 shadow-2xl backdrop-blur-xl">
        <p className="px-3 text-xs font-black uppercase tracking-[0.22em] text-[#F0D98A]">Protocol Docs</p>
        <nav className="mt-4 space-y-2">{protocolDocs.map((item) => <Link key={item.slug} href={`/docs/${item.slug}`} className={`block rounded-2xl px-3 py-3 text-sm font-bold transition ${item.slug === doc.slug ? 'bg-[#D8B35A] text-black' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>{item.title}<span className="mt-1 block text-xs opacity-70">{item.version}</span></Link>)}</nav>
        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="px-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">On this page</p>
          <div className="mt-3 space-y-2">{headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} className="block rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-[#F0D98A]">{heading.text}</a>)}</div>
        </div>
      </div>
    </aside>
    <article className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl md:p-10">
      <header className="mb-8 rounded-[1.5rem] border border-[#D8B35A]/30 bg-gradient-to-br from-[#D8B35A]/15 to-white/[0.03] p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[#D8B35A]/50 bg-[#D8B35A]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#F0D98A]">{doc.badge}</span>
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">{doc.version}</span>
        </div>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{doc.summary}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={doc.pdfHref} className="rounded-full bg-[#D8B35A] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-black shadow-gold">Download PDF</a>
          <CopyButton text={doc.markdown} />
        </div>
      </header>
      <MarkdownRenderer markdown={doc.markdown} />
    </article>
  </main>;
}
