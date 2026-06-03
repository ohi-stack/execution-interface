import { CardGrid, InfoCard, OmosPage } from '@/app/components/omos-docs-ui';

const layers = [
  ['Human layer', 'Voluntary participants, operators, reviewers, and readers remain the accountable context source for interpretation and publication.'],
  ['Semantic layer', 'Terms, claims, content labels, safety notes, and route names are normalized before execution so outputs remain understandable.'],
  ['Agent layer', 'AI and automation may assist with summaries, classification, routing, and checks only inside documented constraints.'],
  ['Interface layer', 'Pages, APIs, dashboards, and manifests expose the system in consistent, inspectable forms for humans and software.'],
  ['Compliance rule', 'Every output must preserve public boundary language and avoid implying legal immunity, governmental authority, tax exemption, or control over non-participants.']
];

export default function ProtocolPage() {
  return (
    <OmosPage eyebrow="Protocol" title="The OMOS protocol defines layers, boundaries, and claims discipline." description="Protocol pages turn the operating model into explicit rules that can be read, implemented, reviewed, and repeated.">
      <CardGrid cols="lg:grid-cols-5">
        {layers.map(([title, detail], index) => <InfoCard key={title} title={title} accent={index === 4 ? 'green' : 'cyan'}><p>{detail}</p></InfoCard>)}
      </CardGrid>
      <InfoCard title="Protocol acceptance criteria" accent="gold">
        <ul className="list-disc space-y-2 pl-5">
          <li>Each route names its purpose and operational boundary.</li>
          <li>Each API example includes authentication and response shape.</li>
          <li>Each non-operational capability is labeled planned, not active.</li>
        </ul>
      </InfoCard>
    </OmosPage>
  );
}
