import { CertificatePreview } from '@/components/belief-mapper/CertificatePreview';

export default function BeliefMapperCertificatePage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Certificate</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-100">Belief Mapper™ certificate preview</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">Preview certificate language before creating or verifying a credential record.</p>
      </header>
      <CertificatePreview />
    </main>
  );
}
