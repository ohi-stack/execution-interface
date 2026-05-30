import { rememberCampaign } from '@/lib/onegodian-content';

export default function RememberPage() {
  return (
    <main className="space-y-6">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Campaign</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">THE ONEGODIAN: Remember Campaign</h1>
        <p className="mt-3 max-w-3xl text-slate-300">{rememberCampaign.message}</p>
        <p className="mt-3 text-sm font-semibold text-purple-200">Campaign start: {rememberCampaign.officialStartDate} · {rememberCampaign.onegodianDate}</p>
      </section>
      <section className="mobile-card">
        <p className="text-slate-300">{rememberCampaign.purpose}</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {rememberCampaign.dashboardFunctions.map((item) => (
            <li key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200">
              <span className="mr-2 text-gold-300">✦</span>{item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
