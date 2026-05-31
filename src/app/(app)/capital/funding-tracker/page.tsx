import { CapitalStatusBadge } from '@/components/capital/status-badge';
import { capitalComplianceDisclaimer, getFundingTracker, type FundingStage } from '@/lib/capital';

const stageToCapitalStatus: Record<FundingStage, Parameters<typeof CapitalStatusBadge>[0]['status']> = {
  Prospecting: 'Planned',
  Introduced: 'Development-stage',
  Diligence: 'Compliance Review',
  Commitment: 'Active',
  Funded: 'Closed',
  Paused: 'Paused'
};

export default async function FundingTrackerPage() {
  const tracker = await getFundingTracker();

  const relationshipActions = [
    'Log lender touchpoints and relationship owner accountability.',
    'Track diligence requests, closing blockers, and next-step commitments.',
    'Keep deal-to-lender mappings visible before capital committee review.'
  ];

  return (
    <main className="space-y-6 text-slate-100">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/40">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Capital Command Center</p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Funding Tracker</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Internal operating view for lender database coverage, capital commitments, funding status, deal-to-lender mapping, and relationship management.
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-5 text-amber-200 lg:max-w-md">
            {capitalComplianceDisclaimer}
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5" aria-label="Funding tracker totals">
        <MetricCard label="Lenders" value={String(tracker.totals.lenderCount)} />
        <MetricCard label="Target commitments" value={tracker.totals.targetCommitments} />
        <MetricCard label="Committed" value={tracker.totals.committedCapital} />
        <MetricCard label="Funded" value={tracker.totals.fundedCapital} />
        <MetricCard label="Active deals" value={String(tracker.totals.activeDeals)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Lender Database</h2>
              <p className="text-sm text-slate-400">Relationship records with priority, status, commitments, next steps, and mapped deals.</p>
            </div>
            <span className="rounded-full border border-cyan-400/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">CRM-ready</span>
          </div>

          <div className="grid gap-3">
            {tracker.lenders.map((lender) => (
              <article key={lender.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{lender.name}</h3>
                      <CapitalStatusBadge status={stageToCapitalStatus[lender.stage]} />
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{lender.id} · {lender.lenderType} · {lender.priority} priority</p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{lender.relationshipNotes}</p>
                  </div>
                  <div className="grid min-w-[15rem] gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm">
                    <FundingAmount label="Target" value={lender.targetCommitment} />
                    <FundingAmount label="Committed" value={lender.committedAmount} />
                    <FundingAmount label="Funded" value={lender.fundedAmount} />
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <InfoBlock label="Owner" value={lender.relationshipOwner} />
                  <InfoBlock label="Last touch" value={lender.lastTouch} />
                  <InfoBlock label="Next step" value={lender.nextStep} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lender.mappedDeals.map((dealId) => (
                    <span key={dealId} className="rounded-full border border-purple-300/30 bg-purple-300/10 px-3 py-1 text-xs text-purple-100">{dealId}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-xl font-semibold text-white">Deal-to-Lender Mapping</h2>
            <p className="mt-1 text-sm text-slate-400">Each capital need is mapped to one or more lender relationships.</p>
            <div className="mt-4 space-y-3">
              {tracker.deals.map((deal) => (
                <article key={deal.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{deal.name}</h3>
                      <p className="text-xs text-slate-500">{deal.id}</p>
                    </div>
                    <CapitalStatusBadge status={stageToCapitalStatus[deal.fundingStatus]} />
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-300">
                    <FundingAmount label="Need" value={deal.capitalNeed} />
                    <FundingAmount label="Target close" value={deal.targetClose} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {deal.mappedLenderIds.map((lenderId) => (
                      <span key={lenderId} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-100">{lenderId}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-xl font-semibold text-white">Relationship Management</h2>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
              {relationshipActions.map((action) => (
                <li key={action} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </article>
  );
}

function FundingAmount({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-100">{value}</span>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-200">{value}</p>
    </div>
  );
}
