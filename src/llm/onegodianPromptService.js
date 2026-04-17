import { ONEGODIAN_DOCUMENTED_REFERENCES, SUPPORTED_STAGES } from './onegodianReferences.js';

const PROMPTS = {
  'v1.0': {
    id: 'v1.0',
    title: 'Onegodian AI System Prompt v1.0',
    stages: SUPPORTED_STAGES,
    references: ONEGODIAN_DOCUMENTED_REFERENCES,
  },
};

export const loadPromptVersion = (version = 'v1.0') => {
  const prompt = PROMPTS[version];
  if (!prompt) {
    throw new Error(`Unsupported prompt version: ${version}`);
  }

  return prompt;
};

export const enforceDocumentedSourceGuardrails = ({ claims = [], references = [] }) => {
  const allowedRefs = new Set(Object.values(ONEGODIAN_DOCUMENTED_REFERENCES));
  const unsupportedClaims = claims.filter((claim) => claim.type === 'institutional' || claim.type === 'legal');
  const unsupportedReferences = references.filter((reference) => !allowedRefs.has(reference));

  if (unsupportedClaims.length > 0 || unsupportedReferences.length > 0) {
    return {
      allowed: false,
      reasons: [
        ...(unsupportedClaims.length > 0 ? ['Unsupported institutional or legal claims detected'] : []),
        ...(unsupportedReferences.length > 0 ? ['Undocumented source references detected'] : []),
      ],
    };
  }

  return { allowed: true, reasons: [] };
};

export const buildStageAwareResponseFrame = ({ stage, userRequest }) => {
  if (!SUPPORTED_STAGES.includes(stage)) {
    throw new Error(`Unsupported stage: ${stage}`);
  }

  return {
    stage,
    request: userRequest,
    responseTemplate: {
      context: `Stage: ${stage}`,
      answer: '',
      citations: [],
      constraints: [
        'Use documented Onegodian sources only.',
        'Do not make unsupported institutional or legal claims.',
      ],
    },
  };
};
