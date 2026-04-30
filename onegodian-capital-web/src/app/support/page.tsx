import PageShell from '@/components/PageShell';

const topics = [
  'Dashboard access',
  'Offering records',
  'Disclosure acceptance',
  'Certificate verification',
  'Payment/order support',
  'Record correction request',
];

export default function SupportPage() {
  return (
    <PageShell>
      <section className="hero">
        <p className="eyebrow">Operations Support</p>
        <h1>Support</h1>
        <p>
          Use this page for support pathways related to portal records, access issues, and administrative
          correction workflows.
        </p>
      </section>

      <section className="page-section grid">
        {topics.map((topic) => (
          <article key={topic} className="card">
            <h2>{topic}</h2>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
