import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="max-w-3xl rounded-2xl border border-slate-700 bg-slate-900/60 p-10 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-neon">app.onegodian.com</p>
        <h1 className="mt-3 text-4xl font-bold">OneGodian Everything App</h1>
        <p className="mt-4 text-slate-300">Unified access to registry, planetary records, products, certificates, tools, media, and learning modules.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard" className="rounded-lg bg-neon px-5 py-3 font-semibold text-slate-950">Enter Dashboard</Link>
          <Link href="/odin" className="rounded-lg border border-cyan-400/40 px-5 py-3 font-semibold text-slate-100">Open ODIN Registry™</Link>
        </div>
      </section>
    </main>
  );
}
