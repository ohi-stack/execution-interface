import Link from 'next/link';

const issuerUrl = process.env.NEXT_PUBLIC_ISSUER_URL ?? 'https://issuer.qrv.network';
const developerUrl = process.env.NEXT_PUBLIC_DEVELOPER_URL ?? 'https://developers.qrv.network';
const statusUrl = process.env.NEXT_PUBLIC_STATUS_URL ?? 'https://status.qrv.network';
const demoCertId = process.env.NEXT_PUBLIC_DEMO_CERT_ID ?? 'QRV-PROD-CERT-000001';
type LinkCard = {
  title: string;
  description: string;
  href?: string;
  status?: string;
};

const heroActions = [
  { label: 'Open Dashboard', href: '/dashboard' },
  { label: 'Open Time System', href: '/time' },
  { label: 'View OMOS Status', href: '/omos' },
  { label: 'View Sitemap', href: '/sitemap' }
];

const platformNetwork: LinkCard[] = [
  { title: 'OneGodian.org', description: 'Organization, public identity, education, cultural records, and institutional home.', href: 'https://onegodian.org' },
  { title: 'OneGodian.com', description: 'Store, product commerce, certificates, digital downloads, and campaign collections.', href: 'https://onegodian.com' },
  { title: 'u.OneGodian.com', description: 'Education platform, LMS, courses, learning modules, and training access.', href: 'https://u.onegodian.org' },
  { title: 'app.OneGodian.com', description: 'Public/member app node, dashboard, registry access, tools, time system, OMOS status, and records.', href: 'https://app.onegodian.com' },
  { title: 'OMOS.OneGodian.com', description: 'Protocol and specification node for OMOS, manifest data, algorithm framework, and runtime architecture.', href: 'https://omos.onegodian.com' },
  { title: 'Capital.OneGodian.com', description: 'Capital, valuation, contributor, product, payment, and finance-related platform layer.', href: 'https://capital.onegodian.com' },
  { title: 'Galaxy.OneGodian.com', description: 'Planetary canon, galaxy navigation, world-building, media, and lore-linked app layer.', href: 'https://galaxy.onegodian.com' },
  { title: 'QuantumOHI.com', description: 'Quantum-OHI, advanced system architecture, intelligence infrastructure, and protocol positioning.', href: 'https://quantumohi.com' }
];

const capabilities: LinkCard[] = [
  { title: 'Open the Dashboard', description: 'View live system cards, OMOS sync indicators, app modules, production status, and platform routing.', href: '/dashboard' },
  { title: 'Use OneGodian Time™', description: 'Access the live clock, dual dating system, OTS-V5 references, timestamps, calendar tools, and date conversion.', href: '/time' },
  { title: 'View Registry Records', description: 'Browse ODIN records, certificates, systems, products, identity records, planetary records, and verified entries.', href: '/registry' },
  { title: 'Explore OMOS', description: 'View OMOS manifest status, page registry, sync health, plugins, properties, runtime checks, and bridge readiness.', href: '/omos' },
  { title: 'Review System Architecture', description: 'Access the OneGodian hierarchy, OHI/OMOS architecture, app structure, plugin bridge model, and platform layers.', href: '/architecture' },
  { title: 'Access Tools', description: 'Use registry lookup, certificate verification, system status tools, API diagnostics, converters, and platform utilities.', href: '/tools' },
  { title: 'Open Education Pathways', description: 'Connect to OneGodian Learn and u.OneGodian.com for learning modules, courses, guides, and educational records.', href: '/learning' },
  { title: 'Review Public Records', description: 'Access founder records, authorship, chronology, institutional positioning, platform history, and portfolio documentation.', href: '/records' }
];

const productionStatus: LinkCard[] = [
  { title: 'App Node: Live', description: 'app.onegodian.com is active as the public/member app surface.', status: 'Live' },
  { title: 'Deployment: Active', description: 'Hostinger Node/Next.js deployment.', status: 'Active' },
  { title: 'OMOS Sync Layer: Active', description: 'app APIs can read OMOS manifest, health, pages, plugin registry, property registry, and system-health data.', status: 'Active' },
  { title: 'Public Sitemap: Pending Merge', description: 'PR #237 adds the structured public sitemap, OMOS pages, architecture pages, and system-health surface.', status: 'Pending Merge' },
  { title: 'Console Separation: Documented', description: 'console.onegodian.com remains the operator/admin runtime surface and should not be mixed with app.onegodian.com public/member routes.', status: 'Documented' },
  { title: 'Next Priority', description: 'Fix and merge PR #237, then redeploy app.onegodian.com from latest main.', status: 'Action Required' }
];

function SectionCard({ card }: { card: LinkCard }) {
  const body = (
    <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
      <h3 className="text-lg font-semibold text-cyan-100">{card.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{card.description}</p>
      {card.status ? <p className="mt-3 text-xs uppercase tracking-[0.2em] text-amber-200">{card.status}</p> : null}
    </article>
  );

  if (!card.href) return body;
  const isExternal = card.href.startsWith('http');
  return isExternal ? (
    <a href={card.href} target="_blank" rel="noreferrer" className="block transition hover:opacity-90">
      {body}
    </a>
  ) : (
    <Link href={card.href} className="block transition hover:opacity-90">
      {body}
    </Link>
  );
}

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
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">ONEGODIAN PLATFORM · PUBLIC / MEMBER NODE</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">OneGodian App</h1>
          <p className="mt-4 max-w-5xl text-base leading-relaxed text-slate-300 sm:text-lg">
            The OneGodian App is the public/member-facing node of the OneGodian ecosystem. It connects app.onegodian.com with OMOS.OneGodian.com, OneGodian.org, OneGodian.com, u.OneGodian.com, Capital.OneGodian.com, Galaxy.OneGodian.com, and QuantumOHI.com through structured modules, public records, system health checks, and synchronized platform data.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {heroActions.map((action) => (
              <Link key={action.href} className="rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/30" href={action.href}>
                {action.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-cyan-200">Live Platform Network</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {platformNetwork.map((card) => (
              <SectionCard key={card.title} card={card} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-cyan-200">What You Can Do Here</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((card) => (
              <SectionCard key={card.title} card={card} />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">Entity Structure</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">ONEGODIAN, LLC is the commercial, technology, publishing, intellectual property, software, education, and platform-development entity.</p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">The Indigenous Nation of Onegodia™ is separate from ONEGODIAN, LLC and should only be referenced in the app where membership, religious society records, internal governance, or cultural/community records require that distinction.</p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">The OneGodian App is not a government portal. It is a public/member-facing digital interface operated as part of the OneGodian platform ecosystem.</p>
        </section>

        <section className="space-y-4 pb-4">
          <h2 className="text-2xl font-semibold text-cyan-200">Current Production Status</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {productionStatus.map((card) => (
              <SectionCard key={card.title} card={card} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
