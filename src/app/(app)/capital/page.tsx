import Link from 'next/link';
import { ModuleShellPage } from '@/components/module-shell-page';

const capitalWorkspaces = [
  {
    href: '/capital/funding-tracker',
    title: 'Funding Tracker',
    description: 'Lender database, capital commitments, funding status, deal-to-lender mapping, and relationship management.'
  },
  {
    href: '/capital/instruments',
    title: 'Capital Instruments',
    description: 'Notes, bonds, circulation pools, API plans, and platform licensing instruments.'
  },
  {
    href: '/capital/valuation',
    title: 'Capital Valuation',
    description: 'Strategic value ranges, allocation model, and infrastructure progress indicators.'
  },
  {
    href: '/capital/licensing',
    title: 'Capital Licensing',
    description: 'Developer preview, API plans, and institutional licensing tracks.'
  }
];

export default function CapitalPage() {
  return (
    <div className="space-y-6">
      <ModuleShellPage slug="capital" />
      <section className="mobile-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Capital Operations</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Capital workspaces</h2>
          </div>
          <Link href="/capital/funding-tracker" className="rounded-full border border-cyan-400/50 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/10">
            Open Funding Tracker
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {capitalWorkspaces.map((workspace) => (
            <Link key={workspace.href} href={workspace.href} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-cyan-400/50 hover:bg-cyan-400/10">
              <h3 className="font-semibold text-white">{workspace.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{workspace.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
