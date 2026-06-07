import Link from 'next/link';
import { latestDeployments, platformStatus, productionMetrics, verificationStatus } from '@/data/onegodianContent';
import { DashboardModules, PageHero } from '@/components/OneGodianAppPages';

export default function DashboardPage() {
  return (
    <main className="space-y-6 sm:space-y-8">
      <section className="glass-panel overflow-hidden p-5 sm:p-7 lg:p-10">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300 sm:tracking-[0.3em]">Command Center</p>
          <h1 className="mt-4 text-[clamp(2rem,10vw,4.6rem)] font-black leading-[0.95] tracking-[-0.055em] text-white">OneGodian Dashboard</h1>
          <p className="mt-5 text-xl font-bold leading-8 text-gold-100 sm:text-2xl sm:leading-9">Dynamic production dashboard for platform status, deployments, metrics, and verification readiness.</p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">The dashboard consumes the shared content source and routes members toward registry, learning, capital, OMOS, QRV, and API surfaces without placeholder cards.</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Platform Status</p>
            <h2 className="mt-2 text-2xl font-black text-white">Operational surfaces</h2>
          </div>
          <Link href="/api/health" className="premium-button-secondary">Health API</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {platformStatus.map((item) => (
            <Link key={item.title} href={item.href} className="mobile-card min-w-0">
              <span className="rounded-full border border-gold-300/30 bg-gold-300/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-gold-100">{item.status}</span>
              <h3 className="mt-4 text-xl font-black tracking-[-0.02em] text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="mobile-card">
          <h2 className="text-2xl font-black text-white">Latest Deployments</h2>
          <div className="mt-4 space-y-3">
            {latestDeployments.map((deployment) => (
              <Link key={deployment.title} href={deployment.href} className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-gold-300/40">
                <h3 className="font-bold text-white">{deployment.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-300">{deployment.detail}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="mobile-card">
          <h2 className="text-2xl font-black text-white">Verification</h2>
          <div className="mt-4 space-y-3">
            {verificationStatus.map((item) => (
              <Link key={item.title} href={item.href} className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-cyan-300/40">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-100">{item.status}</span>
                <h3 className="mt-1 font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-300">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mobile-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-purple-100">Metrics</p>
            <h2 className="mt-2 text-2xl font-black text-white">Production content metrics</h2>
          </div>
          <Link href="/api/stats" className="premium-button-secondary">Stats API</Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {productionMetrics.map((metric) => (
            <article key={metric.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-gold-100">{metric.label}</p>
              <p className="mt-2 text-3xl font-black text-white">{metric.value}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{metric.detail}</p>
            </article>
          ))}
        </div>
      </section>
      <PageHero
        eyebrow="Member dashboard"
        title="OneGodian App Dashboard"
        body="Open real OneGodian member, contributor, creator, affiliate, certificate, product, media, learning, registry, tools, and settings modules from one mobile-first gateway."
      />
      <DashboardModules />
    </main>
  );
}
