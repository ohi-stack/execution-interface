import Link from 'next/link';
import type { Metadata } from 'next';
import { LiveVerifyForm } from './components/LiveVerifyForm';

export const metadata: Metadata = {
  title: 'QR-V™ Global Verification Network | qrv.network',
  description:
    'Registry-backed verification infrastructure for certificates, credentials, products, and records across the QR-V Global Verification Network.',
  openGraph: {
    title: 'QR-V™ — Registry-Backed Verification Infrastructure',
    description:
      'Verify records instantly through the QR-V Global Verification Network. Public verification, issuer onboarding, developer docs, and protocol access.',
    url: 'https://qrv.network',
    siteName: 'QR-V Network',
    type: 'website'
  },
  alternates: { canonical: 'https://qrv.network' }
};

const DEMO_RECORD_ID = 'QRV-PROD-CERT-000001';

const NETWORK_NODES = [
  { node: 'registry.qrv.network', purpose: 'Registry authority', href: 'https://registry.qrv.network' },
  { node: 'verify.qrv.network', purpose: 'Public verification', href: 'https://verify.qrv.network' },
  { node: 'issuer.qrv.network', purpose: 'Issuer portal', href: 'https://issuer.qrv.network' },
  { node: 'api.qrv.network', purpose: 'API gateway', href: 'https://api.qrv.network' },
  { node: 'docs.qrv.network', purpose: 'Standards/docs', href: 'https://docs.qrv.network' },
  { node: 'developers.qrv.network', purpose: 'SDK + onboarding', href: 'https://developers.qrv.network' },
  { node: 'status.qrv.network', purpose: 'System health', href: 'https://status.qrv.network' }
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">🟢 Live Network</p>
            <nav className="flex flex-wrap gap-2 text-sm" aria-label="Primary">
              <a className="rounded-lg border border-slate-700 px-3 py-1.5 hover:border-cyan-400/50" href="https://verify.qrv.network">Verify</a>
              <a className="rounded-lg border border-slate-700 px-3 py-1.5 hover:border-cyan-400/50" href="https://issuer.qrv.network">Issue</a>
              <a className="rounded-lg border border-slate-700 px-3 py-1.5 hover:border-cyan-400/50" href="https://developers.qrv.network">Developers</a>
              <a className="rounded-lg border border-slate-700 px-3 py-1.5 hover:border-cyan-400/50" href="https://status.qrv.network">Status</a>
            </nav>
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-500/40 bg-slate-900/80 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">QR-V GLOBAL VERIFICATION NETWORK</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-5xl">QR-V™ — Registry-Backed Verification Infrastructure</h1>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Verify certificates, credentials, products, and records instantly through the QR-V Global Verification Network.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/30" href="https://verify.qrv.network">Verify Record</a>
            <a className="rounded-xl border border-slate-500/60 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/50 hover:text-cyan-100" href="https://issuer.qrv.network">Issue Credentials</a>
            <a className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/20" href="https://developers.qrv.network">Developer Docs</a>
          </div>
        </section>

        <section id="live-verification" className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">Live Verification Demo</h2>
          <p className="mt-3 text-slate-300">Enter a QRVID and route directly to public verification results.</p>
          <LiveVerifyForm demoRecordId={DEMO_RECORD_ID} />
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">Operational Status</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['Registry Node: Operational', 'Verification Gateway: Operational', 'Issuer Services: Operational', 'API Gateway: Operational'].map((item) => (
              <div key={item} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{item}</div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">Public Use Cases</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {['Certificates', 'Membership IDs', 'Product Authenticity', 'Compliance Records', 'Financial Instruments'].map((item) => (
              <div key={item} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-100">{item}</div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">Network Nodes</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[580px] text-left text-sm">
              <thead className="text-cyan-200"><tr><th className="pb-3">Node</th><th className="pb-3">Purpose</th></tr></thead>
              <tbody>
                {NETWORK_NODES.map((item) => (
                  <tr key={item.node} className="border-t border-slate-800">
                    <td className="py-3"><a className="text-cyan-100 hover:underline" href={item.href}>{item.node}</a></td>
                    <td className="py-3 text-slate-300">{item.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 text-sm text-slate-300 sm:p-8">
          <p>Protocol Version: QRVP-1 · Verification Standard: QVS-1.0</p>
          <div className="mt-3 flex flex-wrap gap-4">
            <a href="https://status.qrv.network">Status</a>
            <a href="https://docs.qrv.network">Docs</a>
            <Link href="/legal">Legal</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
