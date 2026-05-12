import { ReadinessItem } from '../data';

export function CapitalReadinessTable({ items }: { items: ReadinessItem[] }) {
  return <div className="overflow-x-auto rounded-xl border border-slate-700"><table className="min-w-full text-left text-sm"><thead className="bg-slate-800/60"><tr><th className="p-3">Layer</th><th className="p-3">Status</th><th className="p-3">Notes</th></tr></thead><tbody>{items.map((item) => <tr key={item.layer} className="border-t border-slate-700"><td className="p-3 font-medium">{item.layer}</td><td className="p-3">{item.status}</td><td className="p-3 text-slate-300">{item.detail}</td></tr>)}</tbody></table></div>;
}
