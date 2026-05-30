import { ControlPlanePlaceholder } from '@/components/control-plane-placeholder';
import { certificates } from '../data';

export const metadata = {
  title: 'OneGodian App | Certificates',
  description: 'Production-safe control plane placeholder for OneGodian certificates.'
};

export default function CertificateRecordsPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10 text-slate-100">
      <ControlPlanePlaceholder
        title="Certificates"
        layer="certificate"
        description="Reserved operational layer for future certificate issuance, verification records, holder lookups, and audit-ready certificate administration."
        modules={['Certificate issuance', 'Verification records', 'Holder lookups', 'Certificate audit trail']}
      />

      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
        <h2 className="text-2xl font-bold">Existing certificate record references</h2>
        <p className="mt-2 text-slate-300">
          These existing records remain visible for documentation and audit review only. They do not create new issuance, payment, legal, or verification functionality.
        </p>
        <div className="mt-5 rounded-xl border border-amber-500/40 bg-amber-900/20 p-4 text-sm text-amber-100">
          Certificate records displayed in this portal are administrative records for documentation, verification support, and audit review. A listed record does not replace executed agreements, disclosure review, payment confirmation, legal review, or final internal acceptance.
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {certificates.map((record) => (
            <article key={record.recordId} className="rounded-xl border border-slate-700 bg-slate-950/70 p-5">
              <p><strong>Record ID:</strong> {record.recordId}</p>
              <p><strong>Instrument Reference:</strong> {record.instrumentReference}</p>
              <p><strong>Holder Reference:</strong> {record.holderReference}</p>
              <p><strong>Record Status:</strong> {record.recordStatus}</p>
              <p><strong>Issuance Status:</strong> {record.issuanceStatus}</p>
              <p><strong>Verification Metadata:</strong> {record.verificationMetadata}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
