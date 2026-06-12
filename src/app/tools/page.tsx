import { ConsolePage } from '@/components/ConsolePage';
import { tools } from '@/lib/acc-content';

export default function Page() {
  return (
    <ConsolePage href="/tools">
      <div className="grid gap-3">
        {tools.map((tool) => <div key={tool.name} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4"><p className="font-black text-white">{tool.name}</p><p className="mt-1 text-slate-300">{tool.description}</p></div>)}
      </div>
    </ConsolePage>
  );
}
