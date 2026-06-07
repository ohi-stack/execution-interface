import Link from 'next/link';
import { DomainRoleGrid, ModuleCard, PluginBridgeGrid } from '@/components/OneGodianAppPages';
import { appPositioning, homepageSections } from '@/lib/onegodian-app-content';

export default function HomePage() {
  return (
    <main className="space-y-8 sm:space-y-10">
      <section className="glass-panel overflow-hidden p-5 sm:p-7 lg:p-10">
        <div className="max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300 sm:tracking-[0.3em]">ONEGODIAN APP™ · APP.ONEGODIAN.COM</p>
          <h1 className="mt-4 text-[clamp(2.6rem,11vw,5.7rem)] font-black leading-[0.9] tracking-[-0.06em] text-white">The OneGodian App™</h1>
          <p className="mt-5 max-w-4xl text-lg font-bold leading-8 text-gold-100 sm:text-2xl sm:leading-9">{appPositioning}</p>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            This is the current public and member-facing product surface for OneGodian identity, membership, contributor pathways, creator participation, affiliate structure, certificates, products, media, learning, tools, registry access, and ecosystem navigation.
          </p>
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/dashboard" className="premium-button">Open Dashboard</Link>
          <Link href="/members" className="premium-button-secondary">Membership</Link>
          <Link href="/contributors" className="premium-button-secondary">Contributors</Link>
          <Link href="/creator-network" className="premium-button-secondary">Creator Network</Link>
        </div>
      </section>

      <section>
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-purple-200">Public/member gateway</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">Current OneGodian app modules</h2>
          <p className="mt-3 text-base leading-7 text-slate-300">Each module is routed through app.onegodian.com and keeps the correct separation between .org identity/community/documentation, .com commerce/payments, capital operations, and console runtime administration.</p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {homepageSections.map((module) => <ModuleCard key={module.title} module={module} />)}
        </div>
      </section>

      <section>
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300">Production domain structure</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">Clear ecosystem separation</h2>
        </div>
        <div className="mt-5"><DomainRoleGrid /></div>
      </section>

      <PluginBridgeGrid />

      <section className="rounded-3xl border border-gold-300/25 bg-gold-300/10 p-5 text-sm leading-6 text-gold-100 sm:p-6">
        Compliance boundary: app.onegodian.com may link to OneGodian.org for education, community, and documentation and to OneGodian.com for commerce, products, services, and payments. Contributor language remains voluntary support language and is not investment, securities, loan, bond, or financial-return language.
      </section>
    </main>
  );
}
