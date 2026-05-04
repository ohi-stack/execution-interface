import type { OneGodianIdCardStatus } from "@/lib/id-card/types";

const statusLabels: Record<OneGodianIdCardStatus, string> = {
  not_requested: "Not Requested",
  pending: "Pending Review",
  active: "Active",
  needs_update: "Needs Update",
  revoked: "Revoked",
  expired: "Expired",
};

const statusClasses: Record<OneGodianIdCardStatus, string> = {
  not_requested: "border-slate-500/30 bg-slate-900/70 text-slate-200",
  pending: "border-amber-400/40 bg-amber-950/40 text-amber-200",
  active: "border-emerald-400/40 bg-emerald-950/40 text-emerald-200",
  needs_update: "border-sky-400/40 bg-sky-950/40 text-sky-200",
  revoked: "border-red-400/40 bg-red-950/40 text-red-200",
  expired: "border-zinc-400/40 bg-zinc-950/40 text-zinc-200",
};

export function OneGodianIdStatusBadge({
  status,
}: {
  status: OneGodianIdCardStatus;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${statusClasses[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
