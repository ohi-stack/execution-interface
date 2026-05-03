import { getCapitalSummary, capitalComplianceDisclaimer } from '@/lib/capital';

export default async function CapitalPage() {
  const data = await getCapitalSummary();
  const cards = [
    ['Estimated Current Strategic Platform Value', `${data.estimatedStrategicValue} (${data.valuationLabel})`],
    ['Capital Raised to Date', `Notes ${data.notesRaised} · Bonds ${data.bondsRaised}`],
    ['Active Capital Programs', String(data.activePrograms)],
    ['Stripe Revenue', data.stripeRevenue], ['WooCommerce Revenue', data.wooCommerceRevenue], ['API Subscription Revenue', data.apiSubscriptionRevenue],
    ['Licensing Pipeline', data.licensingPipeline], ['Compliance Readiness', data.complianceReadiness], ['Certificate Queue', data.certificateQueue]
  ];
  return <main className="space-y-4"><h1 className="text-3xl font-semibold">Capital Dashboard</h1><p className="text-sm text-slate-300">3-Year Strategic Target Range: {data.threeYearRange} · 5-Year Projection Range: {data.fiveYearRange} · Execution Readiness Index: {data.executionReadinessIndex}</p><p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">{capitalComplianceDisclaimer}</p><section className="grid gap-3 md:grid-cols-3">{cards.map(([k,v])=><article key={k} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"><p className="text-xs text-slate-400">{k}</p><p className="mt-2 text-sm font-semibold">{v}</p></article>)}</section><p className="text-sm text-slate-300">OCA™ Circulation Pool Allocation: {data.ocaAllocation}</p></main>;
}
