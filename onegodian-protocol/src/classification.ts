export type Classification = 'unclassified' | 'candidate' | 'verified';

export function classifyFromSignals(signalCount: number): Classification {
  if (signalCount >= 3) return 'verified';
  if (signalCount >= 1) return 'candidate';
  return 'unclassified';
}
