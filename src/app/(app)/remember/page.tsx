import Link from 'next/link';

export default function RememberPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Campaign</p>
        <h1 className="mt-2 text-3xl font-bold">OneGodian: Remember</h1>
        <p className="mt-3 text-slate-300">You were always One — you simply forgot. Remember who you are.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold">Campaign Intent</h2>
          <p className="mt-2 text-sm text-slate-300">A public-safe awareness campaign focused on identity, remembrance, dignity, unity, and shared human connection.</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold">Participation</h2>
          <p className="mt-2 text-sm text-slate-300">Creators, members, and supporters can access campaign media, captions, releases, and distribution pathways from the dashboard.</p>
          <Link href="/dashboard" className="mt-3 inline-block text-cyan-300">Open Dashboard</Link>
        </article>
      </section>
    </main>
  );
}
