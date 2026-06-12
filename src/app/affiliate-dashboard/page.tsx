import { ConsolePage } from '@/components/ConsolePage';
import { affiliateDashboardItems } from '@/lib/acc-content';

export default function Page() {
  return (
    <ConsolePage href="/affiliate-dashboard">
      <div className="grid gap-3 md:grid-cols-2">
        {affiliateDashboardItems.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 font-black text-white">{item}</div>)}
      </div>
      <p className="mt-5 text-slate-300">Payment, commission, and earnings logic is not active in this app surface unless a backend is connected.</p>
    </ConsolePage>
  );
}
