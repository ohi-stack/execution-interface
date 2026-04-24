export const runOhiPipeline = ({ candidates = [], filters = {}, requestId = 'unknown' }) => {
  const startedAt = new Date().toISOString();

  const compared = candidates.map((candidate) => ({
    ...candidate,
    confidence: Number(candidate.confidence ?? 0),
    source: candidate.source ?? 'PLACEHOLDER',
  }));

  const filtered = compared.filter((candidate) => {
    const minConfidence = Number(filters.minConfidence ?? 0);
    return candidate.confidence >= minConfidence;
  });

  const normalized = filtered.map((candidate) => ({
    model_id: candidate.model_id,
    source: candidate.source,
    confidence: Math.round(candidate.confidence * 1000) / 1000,
    output_text: String(candidate.output_text ?? '').trim(),
  }));

  const selected = [...normalized].sort((a, b) => b.confidence - a.confidence)[0] ?? null;

  const auditEvent = {
    event_type: 'ohi_pipeline_run',
    request_id: requestId,
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    compared_count: compared.length,
    filtered_count: filtered.length,
    selected_model_id: selected?.model_id ?? null,
    simulated: true,
  };

  return {
    stages: {
      compare: compared,
      filter: filtered,
      normalize: normalized,
      output: selected,
    },
    auditEvent,
  };
};
