import { OneGodianIdActions } from "@/components/id-card/OneGodianIdActions";
import { OneGodianIdCardPreview } from "@/components/id-card/OneGodianIdCardPreview";
import { OneGodianIdComplianceNotice } from "@/components/id-card/OneGodianIdComplianceNotice";
import { OneGodianIdStatusBadge } from "@/components/id-card/OneGodianIdStatusBadge";
import { getOneGodianIdCardStatus } from "@/lib/id-card/client";

export default async function OneGodianIdDashboardPage() {
  const record = await getOneGodianIdCardStatus();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">Member Dashboard</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight">My OneGodian ID Card</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                View your credential status, verification record, issue dates, and available member actions.
              </p>
            </div>
            <OneGodianIdStatusBadge status={record.status} />
          </div>
        </section>
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <OneGodianIdCardPreview record={record} />
          <div className="space-y-6"><OneGodianIdActions record={record} /><OneGodianIdComplianceNotice /></div>
        </section>
      </div>
    </main>
  );
}
