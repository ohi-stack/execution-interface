import { CapitalIntakeForm } from '@/components/capital/intake-form';
import { capitalComplianceDisclaimer } from '@/lib/capital';

export default function CapitalIntakePage() {
  return <main className="space-y-4"><h1 className="text-3xl font-semibold">Capital Intake</h1><p className="text-sm text-slate-300">Submit an expression of interest for capital formation, platform license, or API subscription.</p><p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">{capitalComplianceDisclaimer}</p><CapitalIntakeForm /></main>;
}
