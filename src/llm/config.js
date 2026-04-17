import { ONEGODIAN_DOCUMENTED_REFERENCES } from './onegodianReferences.js';

export const llmConfig = {
  promptVersion: process.env.ONEGODIAN_PROMPT_VERSION || 'v1.0',
  references: ONEGODIAN_DOCUMENTED_REFERENCES,
  policy: {
    documentedSourcesOnly: true,
    allowInstitutionalClaims: false,
    allowLegalClaims: false,
  },
};
