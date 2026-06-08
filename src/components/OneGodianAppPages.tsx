import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  affiliateDashboardItems,
  appPositioning,
  contributorDescription,
  contributorLegalNotice,
  contributorTiers,
  dashboardModules,
  membershipShortcodeMap,
  pluginBridgeShortcodes,
  productionDomainRoles,
  type OneGodianModule
} from '@/lib/onegodian-app-content';

export function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-gold-300/40 bg-gold-300/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.14em] text-gold-100">{children}</span>;
}

export function ModuleCard({ module }: { module: OneGodianModule }) {
  return (
    <article className="mobile-card flex min-h-full min-w-0 flex-col">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-xl font-black tracking-[-0.02em] text-white">{module.title}</h3>
        <Badge>{module.status}</Badge>
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-slate-300">{module.description}</p>
      <Link href={module.route} className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-gold-300/45 bg-gold-300 px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-obsidian shadow-gold transition hover:bg-gold-200 sm:w-auto">
        Open
      </Link>
    </article>
  );
}

export function PageHero({ eyebrow, title, body, cta }: { eyebrow: string; title: string; body: string; cta?: { label: string; href: string } }) {
  return (
    <section className="glass-panel overflow-hidden p-5 sm:p-7 lg:p-10">
      <div className="max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300 sm:tracking-[0.3em]">{eyebrow}</p>
        <h1 className="mt-4 text-[clamp(2.25rem,11vw,4.9rem)] font-black leading-[0.92] tracking-[-0.055em] text-white">{title}</h1>
        <p className="mt-5 text-lg font-bold leading-8 text-gold-100 sm:text-2xl sm:leading-9">{body}</p>
      </div>
      {cta ? <div className="mt-7"><Link href={cta.href} className="premium-button">{cta.label}</Link></div> : null}
    </section>
  );
}

export function DashboardModules() {
  return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{dashboardModules.map((module) => <ModuleCard key={module.route} module={module} />)}</section>;
}

export function DomainRoleGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {productionDomainRoles.map((domain) => (
        <Link key={domain.domain} href={domain.url} className="mobile-card block">
          <Badge>{domain.domain}</Badge>
          <h3 className="mt-4 text-xl font-black text-white">{domain.domain}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">{domain.role}</p>
        </Link>
      ))}
    </section>
  );
}

export function PluginBridgeGrid() {
  return (
    <section className="glass-panel p-5 sm:p-7">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-purple-200">WordPress plugin bridge</p>
      <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">Current merged plugin shortcodes referenced by the app</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pluginBridgeShortcodes.map((shortcode) => (
          <code key={shortcode} className="overflow-x-auto rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-gold-100">{shortcode}</code>
        ))}
      </div>
    </section>
  );
}

export function MembershipBridge() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {membershipShortcodeMap.map((item) => (
        <article key={item.shortcode} className="mobile-card">
          <Badge>{item.shortcode}</Badge>
          <h2 className="mt-4 text-xl font-black tracking-[-0.02em] text-white">{item.label}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
        </article>
      ))}
    </section>
  );
}

export function ContributorsContent() {
  return (
    <>
      <section className="mobile-card">
        <p className="text-lg font-bold leading-8 text-gold-100">{contributorDescription}</p>
        <p className="mt-4 rounded-2xl border border-purple-300/25 bg-purple-300/10 p-4 text-sm leading-6 text-purple-100">{contributorLegalNotice}</p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {contributorTiers.map((tier) => (
          <article key={tier.name} className="mobile-card">
            <Badge>{tier.amount}</Badge>
            <h2 className="mt-4 text-2xl font-black tracking-[-0.03em] text-white">{tier.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Voluntary support tier for public-facing OneGodian products, education, media, technology, membership, and community infrastructure.</p>
          </article>
        ))}
      </section>
    </>
  );
}

export function CreatorNetworkContent() {
  return (
    <section className="mobile-card">
      <p className="text-lg font-bold leading-8 text-gold-100">Creators, affiliates, educators, and community voices can help share OneGodian identity, education, public resources, products, and campaigns.</p>
      <Link href="/affiliate-dashboard" className="premium-button mt-6">Apply to Creator Network</Link>
    </section>
  );
}

export function AffiliateDashboardContent() {
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {affiliateDashboardItems.map((item) => (
          <article key={item} className="mobile-card">
            <Badge>Structured</Badge>
            <h2 className="mt-4 text-xl font-black tracking-[-0.02em] text-white">{item}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Real app-side placeholder structure for {item.toLowerCase()} while backend integrations are connected.</p>
          </article>
        ))}
      </section>
      <section className="rounded-3xl border border-gold-300/25 bg-gold-300/10 p-5 text-sm leading-6 text-gold-100">
        No payment, commission, or earnings logic is active in this app surface until an approved backend exists. Commerce and payment flows remain on OneGodian.com.
      </section>
    </>
  );
}

export function GenericModulePage({ title, eyebrow, body, modules }: { title: string; eyebrow: string; body: string; modules: OneGodianModule[] }) {
  return (
    <main className="space-y-6 sm:space-y-8">
      <PageHero eyebrow={eyebrow} title={title} body={body} />
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{modules.map((module) => <ModuleCard key={module.route} module={module} />)}</section>
    </main>
  );
}

export const appComplianceNotice = `${appPositioning} The app links to OneGodian.org for identity, education, community, and documentation, and to OneGodian.com for commerce, products, services, and payments. The app does not process contributions directly without a payment backend.`;
