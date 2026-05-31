type Deal = {
  id: string;
  title: string;
  company: string;
  value: string;
  owner: string;
  probability: string;
  lastActivity: string;
  notes: string;
};

type Stage = {
  name: string;
  summary: string;
  tone: string;
  deals: Deal[];
};

const stages: Stage[] = [
  {
    name: 'Lead In',
    summary: 'New opportunities waiting for qualification.',
    tone: 'border-sky-400/40 bg-sky-500/10 text-sky-100',
    deals: [
      {
        id: 'CRM-1042',
        title: 'Membership onboarding bundle',
        company: 'OneGodian Members',
        value: '$8,400',
        owner: 'A. Rivera',
        probability: '35%',
        lastActivity: 'Inbound form reviewed',
        notes: 'Needs scope confirmation and assignment to implementation.'
      },
      {
        id: 'CRM-1049',
        title: 'Creator campaign intake',
        company: 'Remember Studio',
        value: '$4,200',
        owner: 'M. Chen',
        probability: '28%',
        lastActivity: 'Intro email logged',
        notes: 'Capture social handles before moving to Discovery.'
      }
    ]
  },
  {
    name: 'Discovery',
    summary: 'Active calls, requirement gathering, and fit checks.',
    tone: 'border-violet-400/40 bg-violet-500/10 text-violet-100',
    deals: [
      {
        id: 'CRM-1051',
        title: 'Education license pilot',
        company: 'U OneGodian',
        value: '$18,000',
        owner: 'J. Stone',
        probability: '52%',
        lastActivity: 'Requirements call completed',
        notes: 'Decision committee wants audit history export.'
      }
    ]
  },
  {
    name: 'Proposal',
    summary: 'Pricing, scope, and stakeholder review.',
    tone: 'border-amber-400/40 bg-amber-500/10 text-amber-100',
    deals: [
      {
        id: 'CRM-1058',
        title: 'Verification workflow upgrade',
        company: 'QRV Network',
        value: '$27,500',
        owner: 'S. Patel',
        probability: '68%',
        lastActivity: 'Proposal sent',
        notes: 'Add SLA appendix and security review owner.'
      },
      {
        id: 'CRM-1060',
        title: 'Commerce fulfillment bridge',
        company: 'OneGodian Store',
        value: '$12,750',
        owner: 'D. Brooks',
        probability: '61%',
        lastActivity: 'Pricing note added',
        notes: 'Waiting on warehouse integration credentials.'
      }
    ]
  },
  {
    name: 'Won / Handoff',
    summary: 'Closed deals moving into delivery and account care.',
    tone: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100',
    deals: [
      {
        id: 'CRM-1063',
        title: 'Identity dashboard rollout',
        company: 'App Operations',
        value: '$31,200',
        owner: 'K. Morgan',
        probability: '100%',
        lastActivity: 'Handoff accepted',
        notes: 'Delivery owner assigned; first milestone due Friday.'
      }
    ]
  }
];

const activityLog = [
  { time: '09:12', actor: 'M. Chen', event: 'added a note to Creator campaign intake', type: 'Deal notes' },
  { time: '10:05', actor: 'S. Patel', event: 'moved Verification workflow upgrade to Proposal', type: 'Drag-and-drop stages' },
  { time: '11:30', actor: 'A. Rivera', event: 'assigned Membership onboarding bundle to implementation', type: 'Assignment tracking' },
  { time: '13:45', actor: 'System', event: 'recorded probability change from 60% to 68%', type: 'Audit history' }
];

const auditEvents = [
  'Stage changes are timestamped and attributed to the editor.',
  'Owner changes preserve the previous assignee for accountability.',
  'Deal notes are appended, never overwritten, to maintain context.',
  'Value and probability edits are tracked for pipeline forecasting.'
];

export default function PipelinePage() {
  const totalDeals = stages.reduce((count, stage) => count + stage.deals.length, 0);
  const totalPipelineValue = '$102,050';

  return (
    <main className="space-y-8 p-6 text-slate-100 lg:p-8">
      <section className="glass-panel overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Pipeline CRM</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">Kanban Deal Command Center</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
              Track every opportunity from first contact through handoff with drag-and-drop stage intent, activity context, notes, assignments, and audit-ready history.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-80">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Open deals</p>
              <p className="mt-2 text-3xl font-black text-white">{totalDeals}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pipeline value</p>
              <p className="mt-2 text-3xl font-black text-gold-200">{totalPipelineValue}</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="kanban-board" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-200/80">Kanban board</p>
            <h2 id="kanban-board" className="mt-1 text-2xl font-bold text-white">Drag-and-drop stages</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Cards are designed as draggable deal units with visible owner, value, probability, notes, and latest activity for quick sales operations review.
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-4">
          {stages.map((stage) => (
            <article key={stage.name} className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 shadow-sovereign backdrop-blur-xl">
              <div className={`rounded-2xl border p-4 ${stage.tone}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-white">{stage.name}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-300">{stage.summary}</p>
                  </div>
                  <span className="rounded-full bg-black/20 px-2.5 py-1 text-xs font-bold text-white">{stage.deals.length}</span>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {stage.deals.map((deal) => (
                  <div key={deal.id} className="cursor-grab rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:-translate-y-1 hover:border-gold-300/40 active:cursor-grabbing">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-300">{deal.id}</span>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-300">{deal.probability}</span>
                    </div>
                    <h4 className="mt-3 text-base font-bold text-white">{deal.title}</h4>
                    <p className="mt-1 text-sm text-slate-400">{deal.company}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-white/[0.06] p-3">
                        <p className="uppercase tracking-[0.16em] text-slate-500">Value</p>
                        <p className="mt-1 font-bold text-gold-100">{deal.value}</p>
                      </div>
                      <div className="rounded-xl bg-white/[0.06] p-3">
                        <p className="uppercase tracking-[0.16em] text-slate-500">Owner</p>
                        <p className="mt-1 font-bold text-white">{deal.owner}</p>
                      </div>
                    </div>
                    <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-slate-300">
                      <span className="font-semibold text-purple-200">Deal notes:</span> {deal.notes}
                    </p>
                    <p className="mt-3 text-xs text-slate-500">Latest activity: {deal.lastActivity}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="mobile-card">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-300">Activity log</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Recent CRM movement</h2>
          <div className="mt-5 space-y-3">
            {activityLog.map((activity) => (
              <div key={`${activity.time}-${activity.event}`} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-gold-200">{activity.time}</span>
                  <span className="rounded-full border border-purple-300/30 px-2 py-1 text-purple-100">{activity.type}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300"><span className="font-semibold text-white">{activity.actor}</span> {activity.event}.</p>
              </div>
            ))}
          </div>
        </article>

        <article className="mobile-card">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-300">Audit history</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Governed sales records</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
            {auditEvents.map((event) => (
              <li key={event} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-gold-300 shadow-gold" />
                <span>{event}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
