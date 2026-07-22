import { routes } from './omos-pages';
import { tools } from './tools';
import { ecosystemLinks } from './ecosystem';
import { capitalProducts, qrvNetwork } from './capital-products';

export const manifest = {
  siteName: 'OMOS.OneGodian.com',
  version: '1.1.0',
  domain: 'OMOS.OneGodian.com',
  routes,
  modules: tools.map((tool) => tool.title),
  orchestration: {
    defaultMode: 'simulation',
    modes: {
      simulation: 'Public-safe simulated OHI cross-model review with no external provider calls.',
      live: 'Future live orchestration mode for real OpenAI, Anthropic, Google Gemini, and xAI adapters.',
    },
    adapters: ['OpenAI', 'Anthropic', 'Google Gemini', 'xAI'],
  },
  ecosystemLinks,
  capitalProducts,
  qrvNetwork,
};
