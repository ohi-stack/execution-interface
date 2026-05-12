import { CapitalReadinessTable } from './components/CapitalReadinessTable';
import { readinessItems } from './data';

const boundaryCards = [
  { title: 'WordPress / WooCommerce', detail: 'Checkout and marketing layer.' },
  { title: 'Hostinger Node App', detail: 'Capital portal application layer.' },
  { title: 'API / Database', detail: 'Records, ledgers, disclosures, and certificates.' },
  { title: 'QR-V Network', detail: 'Verification infrastructure layer.' }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">capital.onegodian.com · Hostinger Node</p>
          <h1 className="mt-3 text-4xl font-bold">ONEGODIAN Capital Infrastructure Portal</h1>
          <p className="mt-4 max-w-4xl text-slate-300">Disclosure-first administrative surface for offerings, certificate records, investor workflows, and verification-support operations.</p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Operating Boundary</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {boundaryCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-slate-300">{card.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Production Readiness Snapshot</h2>
          <CapitalReadinessTable items={readinessItems} />
        </section>
      </div>
    </main>
  );
}
