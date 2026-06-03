import { CardGrid, InfoCard, OmosPage } from '../components/omos-docs-ui';

const cases = [
  ['Website content', 'Transform source notes into structured page drafts, summaries, cards, CTAs, and release-safe copy.'],
  ['AI governance docs', 'Document prompts, boundaries, status labels, endpoint behavior, and review checkpoints for AI-assisted systems.'],
  ['Developer tooling', 'Provide repeatable API examples, response schemas, operational notes, and status manifests for integration teams.'],
  ['Membership infrastructure', 'Support member-facing explanations, intake summaries, route maps, and dashboard documentation without overstating authority.'],
  ['Compliance-safe summaries', 'Create concise interpretations that preserve source intent while avoiding legal immunity, governmental, tax, or non-participant jurisdiction claims.'],
  ['Multi-model synthesis', 'Compare and distill outputs from multiple model workflows into one aligned, documented, reviewable result.']
];

export default function UseCasesPage() {
  return (
    <OmosPage eyebrow="Use cases" title="Practical OMOS deployment patterns." description="OMOS supports documentation-heavy workflows where clarity, repeatability, and boundary-safe interpretation matter.">
      <CardGrid>{cases.map(([title, detail], i) => <InfoCard key={title} title={title} accent={i % 2 ? 'green' : 'cyan'}><p>{detail}</p></InfoCard>)}</CardGrid>
    </OmosPage>
  );
}
