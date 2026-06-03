import Link from 'next/link';
import { CardGrid, InfoCard, OmosPage, StatusPill } from './components/omos-docs-ui';

const systems = [
  ['Protocol kernel', 'Defines human, semantic, agent, interface, and compliance boundaries before any automation is labeled active.'],
  ['Runtime model', 'Observe, distill, align, select, execute, and verify steps convert raw context into repeatable system outputs.'],
  ['Developer surface', 'Documents base URL, x-omos-key authentication, endpoint classes, examples, errors, and deployment notes.'],
  ['Governance layer', 'Separates operational documentation from legal, governmental, tax, or participant-jurisdiction claims.'],
  ['Status discipline', 'Publishes active versus planned features with a rule that only operational, documented, repeatable functions are active.'],
  ['Integration node', 'Normalizes public process documentation to POST /api/process while preserving the existing /process runtime concept.']
];

export default function HomePage() {
  return (
    <OmosPage
      eyebrow="OMOS.ONEGODIAN.COM"
      title="Production systems documentation for the OMOS runtime."
      description="OMOS™ is a documentation and integration node for operational interpretation, API-assisted processing, semantic alignment, and compliance-safe system summaries."
      cta={[{ href: '/docs', label: 'Read docs' }, { href: '/dashboard', label: 'Open dashboard' }]}
    >
      <CardGrid>
        {systems.map(([title, detail], index) => (
          <InfoCard key={title} title={title} accent={index % 3 === 0 ? 'gold' : index % 3 === 1 ? 'cyan' : 'green'}>
            <p>{detail}</p>
          </InfoCard>
        ))}
      </CardGrid>
      <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <article className="glass-panel p-5 sm:p-6">
          <StatusPill active>Documentation node active</StatusPill>
          <h2 className="mt-4 text-2xl font-black text-white">Built for readers, builders, and governance reviewers.</h2>
          <p className="mt-3 leading-7 text-slate-300">The node explains what OMOS does, how requests are shaped, where compliance boundaries live, and which capabilities are available today versus planned for later phases.</p>
        </article>
        <article className="rounded-3xl border border-cyan-300/25 bg-cyan-300/10 p-5 sm:p-6">
          <h2 className="text-xl font-black text-white">Primary actions</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="/api" className="premium-button">Integrate API</Link>
            <Link href="/roadmap" className="premium-button-secondary">Review roadmap</Link>
          </div>
        </article>
      </section>
    </OmosPage>
  );
}
