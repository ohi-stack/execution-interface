import Link from 'next/link';

const hierarchy = ['Founder', 'Framework', 'Institutional', 'Platform', 'Systems', 'Registry', 'Commerce', 'Infrastructure'];

export default function SystemsPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">OneGodian Systems</h1>
        <p className="mt-2 text-slate-300">Architecture and infrastructure map.</p>
        <Link href="/dashboard" className="mt-3 inline-flex rounded-lg border border-cyan-400/70 px-4 py-2">Open Dashboard</Link>
      </section>
      <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
        <h2 className="text-xl font-semibold">Ecosystem Hierarchy</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">{hierarchy.map((item, idx) => <div key={item} className="rounded border border-cyan-500/20 p-3">{idx + 1}. {item}</div>)}</div>
      </section>
    </main>
  );
}
