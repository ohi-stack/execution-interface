import { describe, expect, it } from 'vitest';
import { matchScore } from '../src/matching.js';

describe('matchScore', () => {
  it('scores complete inputs as 1', () => {
    expect(matchScore({ geography: 'US', tradition: 'founder', stage: 'Seeker' })).toBe(1);
  });
});
