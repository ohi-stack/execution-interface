export const createAgentEnvelope = ({ input, alignmentResult, decisionResult }) => ({
  input,
  alignment: alignmentResult,
  decision: decisionResult,
  status: alignmentResult?.pass ? 'ALIGNED' : 'REVIEW_REQUIRED',
});
