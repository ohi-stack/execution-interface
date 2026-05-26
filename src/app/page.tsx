import Link from 'next/link';

const issuerUrl = process.env.NEXT_PUBLIC_ISSUER_URL ?? 'https://issuer.qrv.network';
const developerUrl = process.env.NEXT_PUBLIC_DEVELOPER_URL ?? 'https://developers.qrv.network';
const statusUrl = process.env.NEXT_PUBLIC_STATUS_URL ?? 'https://status.qrv.network';
const demoCertId = process.env.NEXT_PUBLIC_DEMO_CERT_ID ?? 'QRV-PROD-CERT-000001';

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10">
      <section className="rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">QRV Production Node</p>
        <h1 className="mt-3 text-4xl font-bold">Instant Trust Verification for Certificates, Identity, and Assets</h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          qrv.network verifies credentials in seconds using tamper-evident proofs and QR-native workflows.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-100" href={issuerUrl} target="_blank" rel="noreferrer">Issuer Onboarding</a>
          <a className="rounded-xl border border-slate-500/60 px-5 py-3 text-sm font-semibold text-slate-100" href={developerUrl} target="_blank" rel="noreferrer">Developer Docs</a>
          <a className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-100" href={statusUrl} target="_blank" rel="noreferrer">System Status</a>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900/70 p-8">
        <h2 className="text-2xl font-semibold text-cyan-200">Live Verification Demo</h2>
        <p className="mt-2 text-slate-300">Demo Certificate ID: <span className="font-mono text-amber-200">{demoCertId}</span></p>
        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
          <p>Status: <span className="text-emerald-300">Verified</span></p>
          <p>Issuer: QRV Production Authority</p>
          <p>Type: Production Readiness Certificate</p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5" href="/pricing">
          <h3 className="text-lg font-semibold">Explore Pricing</h3>
          <p className="mt-2 text-sm text-slate-300">Starter, Pro, and Institution issuer plans.</p>
        </Link>
        <Link className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5" href="/use-cases">
          <h3 className="text-lg font-semibold">Explore Use Cases</h3>
          <p className="mt-2 text-sm text-slate-300">Certificate, identity, product, and property verification workflows.</p>
        </Link>
      </section>
    </main>
  );
}
