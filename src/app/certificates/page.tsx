import { certificates } from '../data';

export default function CertificateRecordsPage() {
  return (
    <main className="onegodian-surface mx-auto max-w-6xl px-4 py-10 text-slate-100">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Verification Records</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] text-white">Certificate Records</h1>
        <p className="mt-3 leading-7 text-slate-300">Review certificate record status, instrument references, and verification metadata.</p>
      </section>
      <div className="mt-5 rounded-3xl border border-gold-300/30 bg-gold-300/10 p-4 text-sm leading-6 text-gold-100 backdrop-blur-xl">
        Certificate records displayed in this portal are administrative records for documentation, verification support, and audit review. A listed record does not replace executed agreements, disclosure review, payment confirmation, legal review, or final internal acceptance.
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {certificates.map((record) => (
          <article key={record.recordId} className="mobile-card space-y-2 text-sm leading-6 text-slate-200">
            <p><strong className="text-gold-200">Record ID:</strong> {record.recordId}</p>
            <p><strong className="text-gold-200">Instrument Reference:</strong> {record.instrumentReference}</p>
            <p><strong className="text-gold-200">Holder Reference:</strong> {record.holderReference}</p>
            <p><strong className="text-gold-200">Record Status:</strong> {record.recordStatus}</p>
            <p><strong className="text-gold-200">Issuance Status:</strong> {record.issuanceStatus}</p>
            <p><strong className="text-gold-200">Verification Metadata:</strong> {record.verificationMetadata}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
