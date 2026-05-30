import Link from 'next/link';
import { coreRoutes, routeStatusRows } from '@/lib/app-content';

export default function StatusPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">System Status</p>
        <h1 className="mt-2 text-3xl font-bold">OneGodian App Route Status</h1>
        <p className="mt-3 max-w-4xl text-slate-300">Production route table for the public OneGodian App content release. The manifest route list tracks these same public-safe routes for smoke testing and status review.</p>
      </section>
      <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/60">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-900 text-xs uppercase tracking-[0.16em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {routeStatusRows.map((row) => (
              <tr key={row.path} className="align-top">
                <td className="px-4 py-3 font-mono text-cyan-300"><Link href={row.path}>{row.path}</Link></td>
                <td className="px-4 py-3 text-slate-100">{row.title}</td>
                <td className="px-4 py-3 text-slate-300">{row.purpose}</td>
                <td className="px-4 py-3"><span className="rounded-full border border-emerald-400/40 px-2 py-1 text-xs text-emerald-200">{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
        <h2 className="text-xl font-semibold">Manifest Coverage</h2>
        <p className="mt-2 text-sm text-slate-300">Current route manifest: {coreRoutes.join(', ')}</p>
      </section>
    </main>
  );
}
