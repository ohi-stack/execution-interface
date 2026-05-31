import { rememberCampaign } from '@/lib/app-content';

export default function RememberPage() {
  return (
    <main className="space-y-6">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Remember Campaign</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">THE ONEGODIAN: Remember</h1>
        <p className="mt-3 max-w-3xl text-slate-300">{rememberCampaign.message}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="mobile-card">
          <h2 className="text-xl font-semibold text-white">Purpose</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">{rememberCampaign.purpose}</p>
        </article>
        <article className="mobile-card">
          <h2 className="text-xl font-semibold text-white">Campaign Functions</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
            {rememberCampaign.dashboardFunctions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
