import test from 'node:test';
import assert from 'node:assert/strict';
import { runOhiPipeline } from '../pipeline/index.js';

test('runOhiPipeline returns deterministic output and audit event', () => {
  const result = runOhiPipeline({
    requestId: 'req-1001',
    filters: { minConfidence: 0.7 },
    candidates: [
      { model_id: 'model-a', source: 'provider-a', confidence: 0.72, output_text: 'A' },
      { model_id: 'model-b', source: 'provider-b', confidence: 0.65, output_text: 'B' },
    ],
  });

  assert.equal(result.stages.filter.length, 1);
  assert.equal(result.stages.output.model_id, 'model-a');
  assert.equal(result.auditEvent.event_type, 'ohi_pipeline_run');
  assert.equal(result.auditEvent.simulated, true);
});
