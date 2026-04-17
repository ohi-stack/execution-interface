export interface MatchInput {
  geography: string;
  tradition: string;
  stage: string;
}

export function matchScore(input: MatchInput): number {
  return [input.geography, input.tradition, input.stage].filter(Boolean).length / 3;
}
