import { appStatus } from '@/lib/onegodian-content';

export function AppStatusPanel() {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
      <h2 className="text-xl font-semibold">App Status</h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div><dt className="text-xs text-slate-400">App URL</dt><dd>{appStatus.appUrl}</dd></div>
        <div><dt className="text-xs text-slate-400">Store URL</dt><dd>{appStatus.store}</dd></div>
        <div><dt className="text-xs text-slate-400">Public site URL</dt><dd>{appStatus.publicSite}</dd></div>
        <div><dt className="text-xs text-slate-400">API URL</dt><dd>{appStatus.api}</dd></div>
        <div><dt className="text-xs text-slate-400">Active campaign</dt><dd>{appStatus.activeCampaign}</dd></div>
        <div><dt className="text-xs text-slate-400">System status</dt><dd>{appStatus.environment}</dd></div>
      </dl>
      <p className="mt-4 text-xs text-slate-400">Last updated: {appStatus.currentDateRecord}</p>
    </section>
  );
}
