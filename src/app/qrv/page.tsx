import Link from 'next/link';

const liveNodes = [
  { label: 'Marketing Site', href: 'https://qrv.network', role: 'Public network home' },
  { label: 'Public Verify', href: 'https://verify.qrv.network', role: 'Scan-result trust surface' },
  { label: 'Issuer Portal', href: 'https://issuer.qrv.network', role: 'Issuer onboarding and certificate creation' },
  { label: 'Registry Node', href: 'https://registry.qrv.network', role: 'Canonical registry service' },
  { label: 'API Node', href: 'https://api.qrv.network', role: 'Programmatic verification API' },
  { label: 'ACC Console', href: 'https://acc.quantumohi.com', role: 'Operator command center' }
];

const productionChecks = [
  'Permanent demo certificate: QRV-PROD-CERT-000001',
  'Public VERIFIED page resolves through verify.qrv.network',
  'REVOKED state validates on a dedicated revoked demo record',
  'NOT_FOUND state returns cleanly for unknown QRVIDs',
  'Issuer dashboard can issue, list, copy, and revoke records',
  'Hostinger build/start/runtime configuration is documented',
  'Health, readiness, version, and metrics endpoints are monitored'
];

export default function QRVNetworkPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-cyan-500/30 bg-slate-900/80 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">QRV.NETWORK NODE</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-5xl">QR-V™ Global Verification Network</h1>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Production command surface for the QR-V certificate verification network: issuer onboarding, registry-backed
            records, public verification, API documentation, monitoring, and launch readiness.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/qrv/dashboard" className="rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-100">Open QRV Dashboard</Link>
            <Link href="/qrv/onboarding" className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-100">Issuer Onboarding</Link>
            <Link href="/qrv/production-checklist" className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-100">Production Checklist</Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Readiness</p>
            <p className="mt-3 text-4xl font-bold text-emerald-200">92%</p>
            <p className="mt-2 text-sm text-slate-300">Pre-launch commercialization stage; external smoke and first paying issuer remain the main proof points.</p>
          </article>
          <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Canonical Demo</p>
            <p className="mt-3 font-mono text-lg text-amber-100">QRV-PROD-CERT-000001</p>
            <p className="mt-2 text-sm text-slate-300">Permanent VERIFIED demonstration record for launch validation.</p>
          </article>
          <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Launch Focus</p>
            <p className="mt-3 text-2xl font-bold text-cyan-100">First Paid Issuer</p>
            <p className="mt-2 text-sm text-slate-300">Certificate verification pilot with founder-led onboarding and support.</p>
          </article>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">Live QRV Nodes</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveNodes.map((node) => (
              <a key={node.href} href={node.href} className="rounded-2xl border border-slate-700 bg-slate-950 p-5 transition hover:border-cyan-400/50">
                <h3 className="font-semibold text-slate-100">{node.label}</h3>
                <p className="mt-2 text-sm text-slate-300">{node.role}</p>
                <p className="mt-3 break-all text-xs text-cyan-200">{node.href}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">Production Proof Requirements</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {productionChecks.map((check) => (
              <li key={check} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200">✅ {check}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
