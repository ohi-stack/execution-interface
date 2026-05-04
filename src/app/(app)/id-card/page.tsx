import { OneGodianIdComplianceNotice } from "@/components/id-card/OneGodianIdComplianceNotice";
import { OneGodianIdHero } from "@/components/id-card/OneGodianIdHero";
import { OneGodianIdCardPreview } from "@/components/id-card/OneGodianIdCardPreview";
import { mockOneGodianIdRecord } from "@/lib/id-card/mock";

export default function OneGodianIdCardPublicPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <OneGodianIdHero />
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <h2 className="text-3xl font-black tracking-tight">Tangible identity. Verified record. Institutional clarity.</h2>
            <p className="text-base leading-8 text-slate-300">
              The OneGodian ID Card is designed as a bridge between personal belief identity, internal membership records, and verifiable digital credential infrastructure.
            </p>
            <div className="grid gap-4">
              {[
                "Documents sincerely held belief identity",
                "Supports internal membership affiliation",
                "Connects to QR-V verification records",
                "Maintains clear institutional-safe language",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-slate-100">{item}</div>
              ))}
            </div>
            <OneGodianIdComplianceNotice />
          </div>
          <OneGodianIdCardPreview record={mockOneGodianIdRecord} />
        </section>
      </div>
    </main>
  );
}
