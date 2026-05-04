import type { OneGodianIdCardRecord } from "@/lib/id-card/types";

export function OneGodianIdActions({
  record,
}: {
  record: OneGodianIdCardRecord;
}) {
  const actions = [
    {
      label: "View ID",
      href: `/dashboard/id-card`,
      description: "Review your active OneGodian ID Card record.",
    },
    {
      label: "Request Update",
      href: `/dashboard/id-card?mode=update`,
      description: "Submit a request to update your credential information.",
    },
    {
      label: "Download / Print",
      href: `/dashboard/id-card?mode=print`,
      description: "Prepare a printable version after approval.",
    },
    {
      label: "Verify QR-V Record",
      href: record.verificationUrl || "#",
      description: "Open public verification record.",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
        >
          <p className="font-bold text-white">{action.label}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{action.description}</p>
        </a>
      ))}
    </div>
  );
}
