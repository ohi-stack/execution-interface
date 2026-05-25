export type PluginRegistryEntry = {
  id: string;
  name: string;
  target: string;
  description: string;
};

export const pluginRegistry: PluginRegistryEntry[] = [
  { id: 'public-identity', name: 'Public Identity Plugin', target: 'app.onegodian.com/identity', description: 'Public/member identity and profile surfaces.' },
  { id: 'commerce', name: 'Commerce Plugin', target: 'onegodian.com', description: 'Commerce routing and storefront integrations.' },
  { id: 'lms', name: 'LMS Plugin', target: 'u.onegodian.com', description: 'Learning management and curriculum experiences.' },
  { id: 'galaxy', name: 'Galaxy Plugin', target: 'galaxy.onegodian.com', description: 'Galaxy world and planetary modules.' },
  { id: 'capital', name: 'Capital Plugin', target: 'capital.onegodian.com', description: 'Capital workflows and member tooling.' },
  { id: 'omos-bridge', name: 'OMOS Bridge Plugin', target: 'omos.onegodian.com', description: 'Spec/runtime bridge from app to OMOS.' },
  { id: 'quantumohi-platform', name: 'QuantumOHI Platform Plugin', target: 'quantumohi.com', description: 'QuantumOHI platform connection layer.' }
];
