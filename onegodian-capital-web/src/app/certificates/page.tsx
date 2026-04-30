import PageShell from '@/components/PageShell';

export default function CertificatesPage() {
  return (
    <PageShell>
      <section className="hero">
        <p className="eyebrow">Verification</p>
        <h1>Certificate Verification</h1>
        <p>
          Certificate verification records should present a certificate ID, instrument ID, current status,
          verification hash, and verification URL for traceable record checks.
        </p>
      </section>

      <section className="page-section card">
        <h2>Record Linkage Requirement</h2>
        <p>
          Certificate records must be tied to corresponding disclosure records and ledger records to maintain
          a complete audit trail.
        </p>
        <p className="notice">Verification is informational and does not constitute legal or investment advice.</p>
      </section>
    </PageShell>
  );
}
