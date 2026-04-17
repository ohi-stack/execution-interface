import { describe, expect, it } from 'vitest';
import { AI_STANDARDS } from '../src/ai-standards.js';

describe('AI standards baseline', () => {
  it('includes no unsolicited reclassification', () => {
    expect(AI_STANDARDS).toContain('No unsolicited reclassification');
  });
});
