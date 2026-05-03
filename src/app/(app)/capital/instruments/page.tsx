import { CapitalStatusBadge } from '@/components/capital/status-badge';
import { capitalComplianceDisclaimer, getCapitalInstruments } from '@/lib/capital';

export default async function CapitalInstrumentsPage() {
  const items = await getCapitalInstruments();
  return <main className="space-y-4"><h1 className="text-3xl font-semibold">Capital Instruments</h1><p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">{capitalComplianceDisclaimer}</p><div className="grid gap-3 md:grid-cols-2">{items.map((it)=><article key={it.name} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"><div className="flex items-center justify-between"><h2 className="font-semibold">{it.name}</h2><CapitalStatusBadge status={it.status} /></div><p className="text-sm text-slate-300">{it.summary}</p>{it.registryCode && <p className="text-xs text-slate-400">Registry Code: {it.registryCode}</p>}{it.raised && <p className="text-xs text-slate-400">Raised: {it.raised}</p>}{it.allocation && <p className="text-xs text-slate-400">Allocation: {it.allocation}</p>}{it.target && <p className="text-xs text-slate-400">Target: {it.target}</p>}</article>)}</div></main>;
}
