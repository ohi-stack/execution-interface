import PageShell from '@/components/PageShell';

const risks = [
  'Business risk',
  'Payment risk',
  'Liquidity risk',
  'Regulatory risk',
  'Technology risk',
  'Operational risk',
];

export default function RiskDisclosuresPage() {
  return (
    <PageShell>
      <section className="hero">
        <p className="eyebrow">Disclosure</p>
        <h1>Risk Disclosures</h1>
        <p>Review the following non-exhaustive risk categories before proceeding with any live deployment plans.</p>
      </section>

      <section className="page-section grid">
        {risks.map((risk) => (
          <article key={risk} className="card">
            <h2>{risk}</h2>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
