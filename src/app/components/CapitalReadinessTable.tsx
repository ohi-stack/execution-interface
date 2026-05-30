import { ReadinessItem } from '../data';

export function CapitalReadinessTable({ items }: { items: ReadinessItem[] }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.045] shadow-sovereign backdrop-blur-xl">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gold-300/20 bg-gold-300/10 text-gold-100">
          <tr><th className="p-3">Layer</th><th className="p-3">Status</th><th className="p-3">Notes</th></tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.layer} className="border-t border-white/10">
              <td className="p-3 font-semibold text-white">{item.layer}</td>
              <td className="p-3 text-gold-200">{item.status}</td>
              <td className="p-3 text-slate-300">{item.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
