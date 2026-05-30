import Link from 'next/link';

const supportAreas = [
  'Infrastructure development',
  'Publishing and documentation',
  'Systems and registry operations',
  'Media and campaign production',
  'Community tools and member resources'
];

export default function SupportPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-red-400/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-red-200">Support / Contributions</p>
        <h1 className="mt-2 text-3xl font-bold">Support OneGodian</h1>
        <p className="mt-3 max-w-4xl text-slate-300">Support the continued development of OneGodian infrastructure, publishing, systems, media, and community tools.</p>
        <Link href="/campaigns" className="mt-5 inline-flex rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">View Campaigns</Link>
      </section>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {supportAreas.map((area) => (
          <article key={area} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 text-slate-200">{area}</article>
        ))}
      </section>
    </main>
  );
}
