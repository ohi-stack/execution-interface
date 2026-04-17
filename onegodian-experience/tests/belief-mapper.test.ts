import { describe, expect, it } from 'vitest';
import type { JourneyStage } from '../src/journey-stage.js';

describe('journey stage typing', () => {
  it('accepts declared journey stages', () => {
    const stage: JourneyStage = 'Seeker';
    expect(stage).toBe('Seeker');
  });
});
