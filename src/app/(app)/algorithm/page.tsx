import { CardGrid, InfoCard, OmosPage } from '@/app/components/omos-docs-ui';

const stages = [
  ['Observe', 'Receive raw content, metadata, route context, and operator intent without expanding claims beyond the provided source.'],
  ['Distill', 'Extract purpose, audience, terms, risks, and required output format into a compact working context.'],
  ['Align', 'Apply protocol language, compliance-safe wording, production status rules, and participant boundaries.'],
  ['Select', 'Choose the appropriate endpoint class, template, summary mode, or documentation pattern for the request.'],
  ['Execute', 'Generate the repeatable output, response object, route content, or operational summary.'],
  ['Verify', 'Check authentication, input validation, response shape, wording boundaries, and active/planned status before publication.']
];

export default function AlgorithmPage() {
  return (
    <OmosPage eyebrow="Algorithm" title="Observe → Distill → Align → Select → Execute → Verify." description="The OMOS runtime model converts source material into structured, compliance-aware documentation and API responses through a six-step operating loop.">
      <CardGrid cols="lg:grid-cols-3">
        {stages.map(([title, detail], index) => <InfoCard key={title} title={`${index + 1}. ${title}`} accent={index < 2 ? 'cyan' : index < 4 ? 'gold' : 'green'}><p>{detail}</p></InfoCard>)}
      </CardGrid>
      <InfoCard title="Runtime invariant" accent="gold"><p>The algorithm is not a legal status engine. It is an operational interpretation loop that helps produce documented, reviewable, repeatable outputs.</p></InfoCard>
    </OmosPage>
  );
}
