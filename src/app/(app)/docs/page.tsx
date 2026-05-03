const docs = ['White Paper', 'System Prompt', 'OTS-V5', 'Positioning Statement', 'LLC Certificate', 'INO Certificate', 'Gen Alpha Strategy', 'April 17 Milestone'];
export default function DocsPage() {
  return <main className="p-6 text-slate-100"><h1 className="text-3xl font-semibold">Docs</h1><p className="mt-3 text-slate-300">Document library index for production-safe references.</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{docs.map((doc)=> <article key={doc} className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">{doc}</article>)}</div></main>;
}
