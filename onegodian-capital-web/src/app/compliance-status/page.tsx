import PageShell from '@/components/PageShell';

const checks = [
  'Legal review of offering terms',
  'Disclosure packet approval',
  'Investor eligibility rules',
  'Stripe live-mode review',
  'Refund/cancellation policy',
  'Data retention policy',
  'Backup/export testing',
  'Admin permissions testing',
  'Certificate verification testing',
  'Tax/accounting review',
];

export default function ComplianceStatusPage() {
  return (
    <PageShell>
      <section className="hero">
        <p className="eyebrow">Compliance</p>
        <h1>Compliance Status</h1>
        <p>
          This checklist tracks required pre-launch governance and controls before any production use of the
          capital portal.
        </p>
      </section>

      <section className="page-section grid">
        {checks.map((item) => (
          <article key={item} className="card">
            <h2>{item}</h2>
            <p className="status-badge">Required before live use</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
