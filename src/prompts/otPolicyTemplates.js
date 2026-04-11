export const OT_POLICY_PRIMER_TEMPLATE = [
  'Policy Baseline:',
  '1) Gregorian dates and timestamps are the legal controlling record in all formal artifacts.',
  '2) Onegodian Time (OT) is supplemental and used for internal governance interpretation only.',
  '3) Day Order is fixed to Sunday-start and must be sourced from onegodian-api authority outputs.',
  '4) Do not infer OT leap handling, month transitions, or year rollover locally when canonical API data is available.',
].join('\n');

export const OT_ASSISTANT_RESPONSE_TEMPLATE = [
  'Institutional Response Pattern:',
  '- State Gregorian legal date first.',
  '- Provide OT as supplemental/internal governance layer.',
  '- Explicitly note Day Order is Sunday-start fixed.',
  '- If onegodian-api is unavailable, withhold non-canonical OT specifics and communicate deterministic fallback language.',
].join('\n');
