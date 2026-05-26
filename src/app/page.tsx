'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

const NETWORK_NODES = [
  { node: 'registry.qrv.network', purpose: 'Registry authority', href: 'https://registry.qrv.network' },
  { node: 'verify.qrv.network', purpose: 'Public verification', href: 'https://verify.qrv.network' },
  { node: 'issuer.qrv.network', purpose: 'Issuer portal', href: 'https://issuer.qrv.network' },
  { node: 'api.qrv.network', purpose: 'API gateway', href: 'https://api.qrv.network' },
  { node: 'docs.qrv.network', purpose: 'Standards/docs', href: 'https://docs.qrv.network' },
  { node: 'developers.qrv.network', purpose: 'SDK + onboarding', href: 'https://developers.qrv.network' },
  { node: 'status.qrv.network', purpose: 'System health', href: 'https://status.qrv.network' }
] as const;

const VERIFICATION_STATES = [
  { state: 'VERIFIED', detail: 'Record exists, signature matches, and status is valid.' },
  { state: 'REVOKED', detail: 'Record exists but has been revoked by an authorized issuer.' },
  { state: 'EXPIRED', detail: 'Record exists but is no longer valid after expiration.' },
  { state: 'NOT FOUND', detail: 'No deterministic match for the submitted QRVID.' }
] as const;

const USE_CASES = ['Certificates', 'Membership IDs', 'Product Authenticity', 'Compliance Records', 'Financial Instruments'];

const VERIFY_BASE_URL = process.env.NEXT_PUBLIC_VERIFY_BASE_URL ?? 'https://verify.qrv.network';
const DEMO_RECORD_ID = 'QRV-DEMO-0001';

export default function HomePage() {
  const [qrvid, setQrvid] = useState('');

  const handleVerify = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = qrvid.trim();
    if (!target) return;
    window.location.href = `${VERIFY_BASE_URL}/${encodeURIComponent(target)}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-cyan-500/40 bg-slate-900/80 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">QR-V GLOBAL VERIFICATION NETWORK</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-5xl">QR-V™ — Registry-Backed Verification Infrastructure</h1>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Verify certificates, credentials, products, and records instantly through the QR-V Global Verification Network.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/30" href="#live-verification">Verify Record</Link>
            <Link className="rounded-xl border border-slate-500/60 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/50 hover:text-cyan-100" href="https://issuer.qrv.network">Issue Credentials</Link>
            <Link className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/20" href="https://developers.qrv.network">Developer Docs</Link>
          </div>
        </section>

        <section id="live-verification" className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">Live Verification Demo</h2>
          <p className="mt-3 text-slate-300">Enter a QRVID and route directly to public verification results.</p>
          <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleVerify}>
            <input
              aria-label="Enter QRVID"
              className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-cyan-300/40 placeholder:text-slate-500 focus:ring"
              onChange={(event) => setQrvid(event.target.value)}
              placeholder="Enter QRVID"
              value={qrvid}
            />
            <button className="rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-100" type="submit">Verify</button>
            <Link className="rounded-xl border border-slate-500/60 px-5 py-3 text-sm font-semibold text-slate-100" href={`${VERIFY_BASE_URL}/${DEMO_RECORD_ID}`}>Try Demo Record</Link>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">Network Nodes</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[580px] text-left text-sm">
              <thead className="text-cyan-200">
                <tr>
                  <th className="pb-3">Node</th><th className="pb-3">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {NETWORK_NODES.map((item) => (
                  <tr key={item.node} className="border-t border-slate-800">
                    <td className="py-3"><Link className="text-cyan-100 hover:underline" href={item.href}>{item.node}</Link></td>
                    <td className="py-3 text-slate-300">{item.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {VERIFICATION_STATES.map((item) => (
            <article key={item.state} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
              <h3 className="text-lg font-semibold text-amber-100">{item.state}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">Use Cases</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {USE_CASES.map((item) => (
              <div key={item} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-100">{item}</div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">Infrastructure Positioning</h2>
          <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">QR-V is not a QR generator. It is a verification infrastructure layer that provides deterministic, registry-backed trust decisions across records and credential ecosystems.</p>
        </section>

        <section className="rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">Build on the Network</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-100" href="https://docs.qrv.network">Read Protocol</Link>
            <Link className="rounded-xl border border-slate-500/60 px-5 py-3 text-sm font-semibold text-slate-100" href="https://api.qrv.network">API Docs</Link>
            <Link className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-100" href="https://developers.qrv.network">Start Integrating</Link>
          </div>
        </section>

        <footer className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 text-sm text-slate-300 sm:p-8">
          <p>Protocol Version: QRVP-1</p>
          <p>Verification Standard: QVS-1.0</p>
          <div className="mt-3 flex flex-wrap gap-4">
            <Link href="https://status.qrv.network">Status</Link>
            <Link href="/legal">Legal</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
