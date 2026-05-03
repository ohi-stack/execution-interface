import { CapitalStatusBadge } from '@/components/capital/status-badge';
import { getCapitalLicenses } from '@/lib/capital';

export default async function CapitalLicensingPage() {
  const plans = await getCapitalLicenses();
  return <main className="space-y-3"><h1 className="text-3xl font-semibold">Capital Licensing</h1><div className="grid gap-3 md:grid-cols-2">{plans.map((plan)=><article key={plan.name} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"><div className="flex items-center justify-between"><h2 className="font-semibold">{plan.name}</h2><CapitalStatusBadge status={plan.status} /></div><p className="text-sm text-slate-300">{plan.description}</p><p className="text-xs text-slate-400">Monthly: {plan.monthlyPrice}</p><p className="text-xs text-slate-400">API limit: {plan.apiLimit}</p><button className="mt-3 rounded-md border border-cyan-400/50 px-3 py-1 text-sm text-cyan-200">{plan.cta}</button></article>)}</div></main>;
}
