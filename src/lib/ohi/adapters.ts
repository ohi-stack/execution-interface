export type OhiModelProvider = 'openai' | 'anthropic' | 'google-gemini' | 'xai';

export type OhiAdapterMode = 'simulation' | 'live';

export interface OhiModelRequest {
  question: string;
  cycleId: string;
  mode: OhiAdapterMode;
}

export interface OhiModelOutput {
  provider: OhiModelProvider;
  modelName: string;
  summary: string;
  keyIdeas: string[];
  risks: string[];
  novelInsight: string;
}

export interface OhiModelAdapter {
  provider: OhiModelProvider;
  displayName: string;
  mode: OhiAdapterMode;
  generate(request: OhiModelRequest): Promise<OhiModelOutput>;
}

const simulationOutputs: Record<OhiModelProvider, Omit<OhiModelOutput, 'provider'>> = {
  openai: {
    modelName: 'GPT simulation lane',
    summary: 'Frames the question as a structured decision problem, separating user intent, constraints, and measurable success criteria.',
    keyIdeas: ['Define the goal before choosing tactics', 'Use staged validation', 'Keep a human approval checkpoint'],
    risks: ['Over-optimizing for speed before values are explicit'],
    novelInsight: 'Convert the answer into an operating checklist the human can audit.',
  },
  anthropic: {
    modelName: 'Claude simulation lane',
    summary: 'Emphasizes careful interpretation, stakeholder impact, and a transparent explanation of tradeoffs before recommending action.',
    keyIdeas: ['Surface assumptions', 'Map stakeholder consequences', 'Name uncertainty clearly'],
    risks: ['Missing social context or downstream harms'],
    novelInsight: 'Use a dignity and harm-reduction lens as an explicit review pass.',
  },
  'google-gemini': {
    modelName: 'Gemini simulation lane',
    summary: 'Looks for breadth, alternative paths, and connections to surrounding systems that may affect implementation.',
    keyIdeas: ['Compare multiple solution paths', 'Identify dependencies', 'Plan feedback loops'],
    risks: ['Ignoring ecosystem constraints and hidden dependencies'],
    novelInsight: 'Treat the output as a living system that should be monitored after release.',
  },
  xai: {
    modelName: 'Grok simulation lane',
    summary: 'Stress-tests the premise, challenges weak claims, and looks for blunt contradictions or missing evidence.',
    keyIdeas: ['Challenge the premise', 'Find brittle claims', 'Ask what would falsify the answer'],
    risks: ['Consensus language can hide unresolved conflict'],
    novelInsight: 'Add an adversarial objection section before synthesis is accepted.',
  },
};

function createSimulationAdapter(provider: OhiModelProvider, displayName: string): OhiModelAdapter {
  return {
    provider,
    displayName,
    mode: 'simulation',
    async generate() {
      return { provider, ...simulationOutputs[provider] };
    },
  };
}

export const openAIAdapter = createSimulationAdapter('openai', 'GPT');
export const anthropicAdapter = createSimulationAdapter('anthropic', 'Claude');
export const googleGeminiAdapter = createSimulationAdapter('google-gemini', 'Gemini');
export const xAIAdapter = createSimulationAdapter('xai', 'Grok');

export const ohiModelAdapters: OhiModelAdapter[] = [openAIAdapter, anthropicAdapter, googleGeminiAdapter, xAIAdapter];

export async function runSimulatedOhiAdapters(question: string): Promise<OhiModelOutput[]> {
  const cycleId = `simulation-${Date.now()}`;
  return Promise.all(ohiModelAdapters.map((adapter) => adapter.generate({ question, cycleId, mode: 'simulation' })));
}
