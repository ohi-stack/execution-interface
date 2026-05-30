import Link from 'next/link';

const campaigns = [
  {
    title: 'Remember Campaign',
    description: 'Preserve memory, identity, origin, purpose, dignity, unity, and disciplined growth through the OneGodian Remember Campaign.',
    href: '/campaigns/remember',
    cta: 'Open Remember Campaign'
  },
  {
    title: 'Support Campaigns',
    description: 'Contribution drives and infrastructure support pathways for publishing, systems, media, and community tools.',
    href: '/support',
    cta: 'Support OneGodian'
  }
];

export default function CampaignsPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Campaign Access</p>
        <h1 className="mt-2 text-3xl font-bold">Campaigns</h1>
        <p className="mt-3 max-w-4xl text-slate-300">
          View active OneGodian support campaigns, contribution drives, Remember Campaign materials, and public outreach resources.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {campaigns.map((campaign) => (
          <article key={campaign.href} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
            <h2 className="text-xl font-semibold text-slate-100">{campaign.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{campaign.description}</p>
            <Link href={campaign.href} className="mt-4 inline-flex rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
              {campaign.cta}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
