import PageShell from '@/components/PageShell';

export default function DisclosuresPage() {
  return (
    <PageShell>
      <section className="hero">
        <p className="eyebrow">Governance</p>
        <h1>Disclosure Center</h1>
        <p>
          This section follows a disclosure-first workflow where disclosures are reviewed and accepted before
          related records proceed through internal platform steps.
        </p>
      </section>

      <section className="page-section card">
        <h2>Legal Boundary</h2>
        <p>
          Disclosure language, sequencing, and acceptance controls must be reviewed by qualified legal counsel
          before live deployment.
        </p>
        <p className="notice">Legal review required before live use.</p>
      </section>
    </PageShell>
  );
}
