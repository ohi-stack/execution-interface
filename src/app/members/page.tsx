import { ConsolePage } from '@/components/ConsolePage';
import { membershipShortcodeMap } from '@/lib/acc-content';

export default function Page() {
  return (
    <ConsolePage href="/members">
      <div className="grid gap-3 md:grid-cols-2">
        {membershipShortcodeMap.map((item) => (
          <div key={item.shortcode} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
            <p className="font-black text-white">{item.label}</p>
            <code className="mt-2 block break-words text-xs text-amber-100">{item.shortcode}</code>
          </div>
        ))}
      </div>
    </ConsolePage>
  );
}
