import PageShell from '@/components/PageShell';

export default function DataRetentionPolicyPage() {
  return (
    <PageShell>
      <section className="hero">
        <p className="eyebrow">Policy</p>
        <h1>Data Retention Policy</h1>
        <p>
          This policy describes how retained records are managed, including disclosure records, ledger records,
          certificate records, and payment references.
        </p>
      </section>

      <section className="page-section card">
        <p>
          Access control, export requests, and deletion limitations must align with legal requirements and
          operational controls.
        </p>
        <p className="notice">Data retention settings require legal review before live use.</p>
      </section>
    </PageShell>
  );
}
