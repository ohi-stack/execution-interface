const metrics = [
  { label: 'Public Verify Status', value: 'Operational' },
  { label: 'Registry Database', value: 'Connected' },
  { label: 'Issuer Provisioning', value: 'Pilot Ready' },
  { label: 'Health Checks', value: 'Enabled' },
  { label: 'Stripe Billing', value: 'In Progress' },
  { label: 'Production Security', value: 'Applying' }
];

const tasks = [
  'Finish Hostinger production runtime validation',
  'Confirm external smoke:e2e pass on live domains',
  'Publish REVOKED demonstration record',
  'Complete first issuer onboarding walkthrough',
  'Enable uptime alerts and incident notifications',
  'Launch public API documentation portal'
];

export default function QRVDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-cyan-500/30 bg-slate-900/80 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">QRV OPERATOR DASHBOARD</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-5xl">QRV Launch Command Center</h1>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Central operator dashboard for launch readiness, issuer activation, verification routing, uptime, deployment status, and pilot execution.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <article key={metric.label} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{metric.label}</p>
              <p className="mt-3 text-lg font-semibold text-emerald-200">{metric.value}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">Next Production Tasks</h2>
          <div className="mt-5 grid gap-3">
            {tasks.map((task) => (
              <div key={task} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200">• {task}</div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
