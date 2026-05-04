import { oneGodianIdComplianceText } from "@/lib/id-card/mock";

export function OneGodianIdComplianceNotice() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-300 shadow-2xl shadow-black/20">
      <p className="font-semibold text-white">Compliance Notice</p>
      <p className="mt-2">{oneGodianIdComplianceText}</p>
    </section>
  );
}
