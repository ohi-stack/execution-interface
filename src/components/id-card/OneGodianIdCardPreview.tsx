import type { OneGodianIdCardRecord } from "@/lib/id-card/types";
import { OneGodianIdStatusBadge } from "./OneGodianIdStatusBadge";

export function OneGodianIdCardPreview({
  record,
}: {
  record: OneGodianIdCardRecord;
}) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-950 p-6 shadow-2xl shadow-cyan-950/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.16),transparent_35%)]" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
              OneGodian ID Card™
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
              {record.displayName}
            </h2>
            <p className="mt-1 text-sm text-slate-300">{record.memberId}</p>
          </div>

          <OneGodianIdStatusBadge status={record.status} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Identity Statement
            </p>
            <p className="mt-2 text-sm font-medium text-white">
              {record.identityStatement}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Issuer
            </p>
            <p className="mt-2 text-sm font-medium text-white">
              {record.issuer}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Issue Date
            </p>
            <p className="mt-2 text-sm font-medium text-white">
              {record.issueDateGregorian || "Pending"}
            </p>
            <p className="mt-1 text-xs text-cyan-200">
              {record.issueDateOT || "OT date pending"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Verification
            </p>
            <p className="mt-2 break-all text-sm font-medium text-white">
              {record.qrvRecordId || "QR-V pending"}
            </p>
            <p className="mt-1 break-all text-xs text-cyan-200">
              {record.obp1RecordId || "OBP-1 pending"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-24 w-24 rounded-2xl border border-white/20 bg-white p-3 text-center text-[10px] font-black uppercase text-slate-950">
            QR-V
            <br />
            Scan
            <br />
            Code
          </div>

          {record.verificationUrl ? (
            <a
              href={record.verificationUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-center text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20"
            >
              Verify QR-V Record
            </a>
          ) : (
            <span className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-bold text-slate-400">
              Verification Pending
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
