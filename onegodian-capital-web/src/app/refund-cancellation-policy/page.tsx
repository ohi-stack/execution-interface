import PageShell from '@/components/PageShell';

export default function RefundCancellationPolicyPage() {
  return (
    <PageShell>
      <section className="hero">
        <p className="eyebrow">Policy</p>
        <h1>Refund &amp; Cancellation Policy</h1>
        <p>
          This policy framework outlines handling for test-mode transactions, cancellation requests, refund
          eligibility, and expected processing timelines.
        </p>
      </section>

      <section className="page-section card">
        <p>Offering-specific terms control where applicable and should be displayed with each offering record.</p>
        <p className="notice">Final refund and cancellation policy requires legal and operational review before live use.</p>
      </section>
    </PageShell>
  );
}
