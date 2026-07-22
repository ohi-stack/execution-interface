import type { OhiModelOutput, OhiModelProvider } from './adapters';

export interface OhiReviewCell {
  reviewer: OhiModelProvider;
  subject: OhiModelProvider;
  signal: string;
  emphasis: 'agreement' | 'contradiction' | 'missing' | 'novel';
}

export interface OhiComparativeSignals {
  agreements: string[];
  contradictions: string[];
  missingIdeas: string[];
  novelInsights: string[];
}

const labels: Record<OhiModelProvider, string> = {
  openai: 'GPT',
  anthropic: 'Claude',
  'google-gemini': 'Gemini',
  xai: 'Grok',
};

export function buildReviewMatrix(outputs: OhiModelOutput[]): OhiReviewCell[] {
  return outputs.flatMap((reviewer, reviewerIndex) =>
    outputs
      .filter((subject) => subject.provider !== reviewer.provider)
      .map((subject, subjectIndex) => {
        const emphasis = (['agreement', 'contradiction', 'missing', 'novel'] as const)[(reviewerIndex + subjectIndex) % 4];
        const signalByEmphasis = {
          agreement: `${labels[reviewer.provider]} affirms ${labels[subject.provider]}'s focus on ${subject.keyIdeas[0].toLowerCase()}.`,
          contradiction: `${labels[reviewer.provider]} challenges a risk in ${labels[subject.provider]}'s framing: ${subject.risks[0].toLowerCase()}.`,
          missing: `${labels[reviewer.provider]} says ${labels[subject.provider]} should add a clearer human inspection checkpoint.`,
          novel: `${labels[reviewer.provider]} extracts a reusable insight from ${labels[subject.provider]}: ${subject.novelInsight.toLowerCase()}`,
        };
        return { reviewer: reviewer.provider, subject: subject.provider, emphasis, signal: signalByEmphasis[emphasis] };
      }),
  );
}

export function extractComparativeSignals(outputs: OhiModelOutput[]): OhiComparativeSignals {
  return {
    agreements: ['All lanes preserve human oversight.', 'All lanes recommend explicit assumptions before final output.', 'All lanes treat the answer as a governed artifact, not raw model text.'],
    contradictions: ['Speed versus caution remains unresolved.', 'Consensus framing may conflict with adversarial falsification.', 'Breadth of alternatives can compete with concise execution.'],
    missingIdeas: ['Add a rollback or revision path after human review.', 'Define evidence thresholds before live orchestration.', 'Record why rejected ideas were excluded.'],
    novelInsights: outputs.map((output) => output.novelInsight),
  };
}

export { labels as ohiProviderLabels };
