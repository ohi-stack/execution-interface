import Link from 'next/link';

const registryAreas = [
  { title: 'ODIN Records', description: 'Access ODIN records and registry references.', href: '/odin-registry' },
  { title: 'Verification Entries', description: 'Review verification pathways and public record checks.', href: '/verify' },
  { title: 'Certificates', description: 'Open certificate records and digital credential references.', href: '/certificates' },
  { title: 'Archived Filings', description: 'Organize archived filings and system records for audit review.', href: '/records' }
];

export default function RegistryPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-emerald-400/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Registry</p>
        <h1 className="mt-2 text-3xl font-bold">OneGodian Registry</h1>
        <p className="mt-3 max-w-4xl text-slate-300">Access ODIN records, verification entries, certificates, archived filings, and system records.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {registryAreas.map((area) => (
          <Link key={area.href} href={area.href} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 hover:border-emerald-400/60">
            <h2 className="text-xl font-semibold text-slate-100">{area.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{area.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
