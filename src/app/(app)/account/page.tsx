import Link from 'next/link';

export default function AccountPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Account Systems</p>
        <h1 className="mt-2 text-3xl font-bold">Account</h1>
        <p className="mt-3 max-w-4xl text-slate-300">Manage your OneGodian account profile, access preferences, identity records, and connected member resources.</p>
      </section>
      <div className="flex flex-wrap gap-3">
        <Link href="/members" className="rounded-full border border-cyan-400/70 px-4 py-2 text-sm font-semibold text-cyan-200">Open Members</Link>
        <Link href="/settings" className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950">Open Settings</Link>
      </div>
    </main>
  );
}
