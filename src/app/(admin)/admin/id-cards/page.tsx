import { OneGodianIdComplianceNotice } from "@/components/id-card/OneGodianIdComplianceNotice";
import { OneGodianIdStatusBadge } from "@/components/id-card/OneGodianIdStatusBadge";
import { getOneGodianIdAdminRows, getOneGodianIdStats } from "@/lib/id-card/client";

export default async function OneGodianIdCardsAdminPage() {
  const [rows, stats] = await Promise.all([getOneGodianIdAdminRows(), getOneGodianIdStats()]);
  const statCards = [
    ["Total Records", stats.total],
    ["Active", stats.active],
    ["Pending", stats.pending],
    ["Needs Update", stats.needsUpdate],
    ["Revoked", stats.revoked],
    ["Expired", stats.expired],
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">Admin Console</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">OneGodian ID Card Records</h1>
        </section>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">{statCards.map(([label, value]) => <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p><p className="mt-3 text-3xl font-black text-white">{value}</p></div>)}</section>
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-white/10 text-left text-sm"><thead className="bg-white/[0.04] text-xs uppercase tracking-[0.2em] text-slate-400"><tr><th className="px-5 py-4">Member</th><th className="px-5 py-4">Member ID</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Issued</th><th className="px-5 py-4">Verification</th><th className="px-5 py-4">Actions</th></tr></thead><tbody className="divide-y divide-white/10">{rows.map((row) => <tr key={row.id} className="align-top"><td className="px-5 py-5 font-semibold text-white">{row.displayName}</td><td className="px-5 py-5 text-slate-300">{row.memberId}</td><td className="px-5 py-5"><OneGodianIdStatusBadge status={row.status} /></td><td className="px-5 py-5 text-slate-300"><p>{row.issueDateGregorian || "Pending"}</p><p className="text-xs text-cyan-200">{row.issueDateOT || "OT pending"}</p></td><td className="px-5 py-5">{row.verificationUrl ? <a href={row.verificationUrl} target="_blank" rel="noreferrer" className="break-all text-cyan-200 underline underline-offset-4">{row.qrvRecordId}</a> : <span className="text-slate-400">Pending</span>}</td><td className="px-5 py-5"><div className="flex flex-wrap gap-2">{["Approve", "Pending", "Revoke", "Regenerate"].map((action) => <button key={action} type="button" className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10">{action}</button>)}</div></td></tr>)}</tbody></table></div></section>
        <OneGodianIdComplianceNotice />
      </div>
    </main>
  );
}
