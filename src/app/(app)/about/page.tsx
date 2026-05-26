import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About QR-V™ | Global QR Verification Network',
  description:
    'QR-V™ is a registry-based verification infrastructure that transforms QR codes into verifiable references through the QRVP-1 protocol.'
};

const coreArchitecture = [
  { title: 'Identifier', description: 'QR-V reference embedded in QR.' },
  { title: 'Resolver', description: 'Routes verification request.' },
  { title: 'API', description: 'Processes verification logic.' },
  { title: 'Registry', description: 'Stores canonical records.' },
  { title: 'Result', description: 'Verification response.' }
];

const enablementAreas = [
  { title: 'Certificates', description: 'Diplomas, credentials, training records.' },
  { title: 'Identity', description: 'Memberships, IDs, access credentials.' },
  { title: 'Products', description: 'Authenticity and supply-chain verification.' },
  { title: 'Documents', description: 'Contracts, records, compliance artifacts.' }
];

const statusChecks = [
  'Verification API responding to live requests',
  'Registry database initialized and queryable',
  'QR-V identifier format implemented',
  'Public verification endpoint active'
];

export default function AboutPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 p-8 shadow-2xl shadow-cyan-950/20">
        <p className="text-xs font-semibold tracking-[0.3em] text-cyan-300">ABOUT QR-V™</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">ABOUT QR-V™ • GLOBAL VERIFICATION NETWORK</h1>
        <p className="mt-3 text-lg text-cyan-100">A Verification Layer for QR-Based Systems</p>
        <p className="mt-6 max-w-3xl text-slate-200">
          QR-V™ is a registry-based verification infrastructure that transforms QR codes into verifiable references. Each QR-V identifier
          resolves to a canonical registry record, enabling independent validation of authenticity, issuer identity, record integrity, and
          current status.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
        <h2 className="text-2xl font-semibold text-white">What QR-V™ Does</h2>
        <p className="mt-4 text-slate-200">
          Traditional QR codes provide access to a destination, but they do not verify the authenticity of that destination or the integrity
          of the underlying record.
        </p>
        <p className="mt-4 text-slate-200">
          QR-V™ introduces a verification layer that connects QR identifiers to a registry-backed system. Instead of resolving to an arbitrary
          URL, each QR-V identifier resolves through a structured verification process.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {['Authenticity validation', 'Issuer identification', 'Record integrity verification', 'Status awareness: valid, revoked, expired, or not found'].map((item) => (
            <li key={item} className="rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100">{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
        <h2 className="text-2xl font-semibold text-white">Verification Flow</h2>
        <p className="mt-4 text-lg font-medium text-cyan-200">QR Scan → Identifier Resolution → Registry Lookup → Validation → Result</p>
        <p className="mt-4 text-slate-200">
          Verification results are derived from authoritative registry records, not from user-controlled endpoints.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
        <h2 className="text-2xl font-semibold text-white">Core Architecture</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coreArchitecture.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-700 bg-slate-950/70 p-5">
              <h3 className="text-lg font-semibold text-cyan-200">{item.title}</h3>
              <p className="mt-2 text-slate-200">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
        <h2 className="text-2xl font-semibold text-white">System Status</h2>
        <p className="mt-4 text-slate-200">
          The QR-V™ network is operating as live verification infrastructure with active registry and API layers.
        </p>
        <ul className="mt-6 space-y-3">
          {statusChecks.map((item) => (
            <li key={item} className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-slate-100">{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
        <h2 className="text-2xl font-semibold text-white">Protocol Foundation</h2>
        <p className="mt-4 text-slate-200">
          QR-V™ operates on the QRVP-1 protocol, which defines how QR-based identifiers are resolved into verifiable records through a
          registry-backed network.
        </p>
        <p className="mt-4 text-slate-200">
          The protocol establishes a deterministic verification process, ensuring that results are derived from authoritative data sources and
          not from uncontrolled redirects.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
        <h2 className="text-2xl font-semibold text-white">What QR-V™ Enables</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {enablementAreas.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-700 bg-slate-950/70 p-5">
              <h3 className="text-lg font-semibold text-cyan-200">{item.title}</h3>
              <p className="mt-2 text-slate-200">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
        <h2 className="text-2xl font-semibold text-white">Explore the QR-V™ Network</h2>
        <p className="mt-4 text-slate-200">Access verification tools, developer APIs, and issuer workflows.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="https://verify.qrv.network" target="_blank" rel="noreferrer" className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">Verify a Record</a>
          <a href="https://docs.qrv.network" target="_blank" rel="noreferrer" className="rounded-lg border border-cyan-400/50 px-5 py-3 font-semibold text-cyan-100 transition hover:border-cyan-300 hover:text-cyan-50">Developer Docs</a>
          <Link href="/institutional" className="rounded-lg border border-amber-400/50 px-5 py-3 font-semibold text-amber-200 transition hover:border-amber-300 hover:text-amber-100">Enterprise Access</Link>
        </div>
      </section>

      <footer className="pb-2 text-center text-sm text-slate-400">
        QR-V™ Global Verification Network • Protocol: QRVP-1 • Registry-Based Verification Infrastructure
      </footer>
    </main>
  );
}
