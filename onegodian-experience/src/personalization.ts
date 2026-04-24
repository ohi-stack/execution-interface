import type { JourneyStage } from './journey-stage.js';

export function personalizePrompt(stage: JourneyStage): string {
  return `Guidance profile for ${stage}`;
}
