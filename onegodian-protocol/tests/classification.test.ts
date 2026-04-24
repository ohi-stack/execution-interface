import { describe, expect, it } from 'vitest';
import { classifyFromSignals } from '../src/classification.js';

describe('classifyFromSignals', () => {
  it('returns verified for three or more signals', () => {
    expect(classifyFromSignals(3)).toBe('verified');
  });
});
