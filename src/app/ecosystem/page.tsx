import { PageHeader } from '@/components/PageHeader';
import { domainStructure } from '@/lib/acc-content';

export default function Page() {
  return (
    <main className="space-y-6">
      <PageHeader eyebrow="Ecosystem" title="OneGodian production domain structure" description="The app keeps public/member access, operator runtime, capital operations, education/community, and commerce/payments on the correct production surfaces." />
      <section className="grid gap-4 md:grid-cols-2">
        {domainStructure.map((domain) => <article key={domain.host} className="rounded-3xl border border-white/10 bg-white/[0.055] p-5"><h2 className="break-words text-2xl font-black text-white">{domain.host}</h2><p className="mt-3 text-sm leading-6 text-slate-300">{domain.role}</p></article>)}
      </section>
    </main>
  );
}
