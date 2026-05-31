import { automationActionLabels, automationRules, getAutomationSummary } from '@/lib/automation-engine';

const statusClassName = {
  active: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100',
  paused: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
  draft: 'border-slate-300/30 bg-slate-300/10 text-slate-100'
};

export default function Page() {
  const summary = getAutomationSummary();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-slate-100">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-gold-300">Automation Engine</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">Trigger/action workflows for status operations</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              Operator-ready automation rules coordinate status changes, email notifications, document generation, and closeout workflows without exposing production credentials.
            </p>
          </div>
          <a
            className="inline-flex items-center justify-center rounded-full border border-gold-300/50 bg-gold-300 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950 shadow-lg shadow-gold-300/10"
            href="/api/workflows?pretty=1"
          >
            View API
          </a>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <SummaryCard label="Rules" value={summary.totalRules} />
          <SummaryCard label="Active" value={summary.activeRules} />
          <SummaryCard label="Paused" value={summary.pausedRules} />
          <SummaryCard label="Email actions" value={summary.emailNotifications} />
          <SummaryCard label="Docs" value={summary.documentTriggers} />
          <SummaryCard label="Closeouts" value={summary.closeoutWorkflows} />
        </dl>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-5">
          {automationRules.map((rule) => (
            <article key={rule.id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 shadow-xl shadow-black/20">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-black text-white">{rule.name}</h2>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${statusClassName[rule.status]}`}>
                      {rule.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{rule.description}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
                  <div className="font-bold text-white">{rule.runCount} runs</div>
                  <div>Last run {new Date(rule.lastRunUtc).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-2xl border border-purple-300/20 bg-purple-300/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-100">Trigger</p>
                  <p className="mt-2 text-sm font-semibold text-white">{rule.trigger.type.replaceAll('_', ' ')}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    {rule.trigger.fromStatus ? `${rule.trigger.fromStatus} → ${rule.trigger.toStatus}` : rule.trigger.documentType ?? rule.trigger.toStatus}
                  </p>
                </div>
                <div className="rounded-2xl border border-gold-300/20 bg-gold-300/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gold-100">Actions</p>
                  <ul className="mt-3 space-y-3">
                    {rule.actions.map((action) => (
                      <li key={`${rule.id}-${action.type}-${action.template}`} className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-slate-950/40 p-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="font-semibold text-white">{action.label}</span>
                        <span className="text-xs uppercase tracking-[0.14em] text-slate-400">{automationActionLabels[action.type]} · {action.audience}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-xl shadow-black/20">
          <h2 className="text-2xl font-black text-white">Closeout control path</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Closeout automations keep a consistent handoff from intake review to document preparation, operator signoff, and final member communication.
          </p>
          <ol className="mt-6 space-y-4">
            {['Status reaches closeout requested', 'Operator checklist is created', 'Closeout summary is generated', 'Member receives next-step email', 'Records queue receives archive reminder'].map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-300 text-sm font-black text-slate-950">{index + 1}</span>
                <span className="text-sm font-semibold text-slate-100">{step}</span>
              </li>
            ))}
          </ol>
        </aside>
      </section>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <dt className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{label}</dt>
      <dd className="mt-2 text-3xl font-black text-white">{value}</dd>
    </div>
  );
}
