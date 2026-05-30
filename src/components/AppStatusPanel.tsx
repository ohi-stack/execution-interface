import { appStatus } from '@/lib/onegodian-content';

export function AppStatusPanel() {
  return (
    <section className="mobile-card p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-300">Runtime Status</p>
      <h2 className="mt-2 text-xl font-black text-white">App Status</h2>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div><dt className="text-xs uppercase tracking-[0.16em] text-purple-100/70">App URL</dt><dd className="break-all text-white">{appStatus.appUrl}</dd></div>
        <div><dt className="text-xs uppercase tracking-[0.16em] text-purple-100/70">Store URL</dt><dd className="break-all text-white">{appStatus.store}</dd></div>
        <div><dt className="text-xs uppercase tracking-[0.16em] text-purple-100/70">Public site URL</dt><dd className="break-all text-white">{appStatus.publicSite}</dd></div>
        <div><dt className="text-xs uppercase tracking-[0.16em] text-purple-100/70">API URL</dt><dd className="break-all text-white">{appStatus.api}</dd></div>
        <div><dt className="text-xs uppercase tracking-[0.16em] text-purple-100/70">Active campaign</dt><dd className="text-white">{appStatus.activeCampaign}</dd></div>
        <div><dt className="text-xs uppercase tracking-[0.16em] text-purple-100/70">System status</dt><dd className="text-white">{appStatus.environment}</dd></div>
      </dl>
      <p className="mt-5 text-xs text-slate-400">Last updated: {appStatus.currentDateRecord}</p>
    </section>
  );
}
