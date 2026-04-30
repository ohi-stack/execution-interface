import PageShell from '@/components/PageShell';

export default function LegalNoticesPage() {
  return (
    <PageShell>
      <section className="hero">
        <p className="eyebrow">Policy</p>
        <h1>Legal Notices</h1>
        <p>
          This site provides recordkeeping and workflow functions and should be reviewed in full alongside your
          organization&apos;s legal documentation.
        </p>
      </section>

      <section className="page-section card">
        <ul>
          <li>No legal advice is provided on this platform.</li>
          <li>No investment advice is provided on this platform.</li>
          <li>No guarantee is made regarding outcomes.</li>
          <li>Legal review is required before live use.</li>
          <li>The platform is intended to support recordkeeping functions.</li>
        </ul>
      </section>
    </PageShell>
  );
}
