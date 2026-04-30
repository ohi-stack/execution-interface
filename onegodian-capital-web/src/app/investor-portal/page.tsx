import PageShell from '@/components/PageShell';

export default function InvestorPortalPage() {
  return (
    <PageShell>
      <section className="hero">
        <p className="eyebrow">Capital Operations</p>
        <h1>Investor Portal</h1>
        <p>
          The Investor Portal dashboard is designed to display capital instruments, issued certificates,
          disclosure acceptances, and ledger records in one place for recordkeeping and review workflows.
        </p>
      </section>

      <section className="page-section card">
        <h2>Portal Readiness Notice</h2>
        <p>
          This portal currently operates in test mode and account-review status. Access may be limited while
          legal, compliance, and operational checks are finalized prior to any live use.
        </p>
        <p className="notice">No guarantee, yield, or profit representation is made on this page.</p>
      </section>
    </PageShell>
  );
}
