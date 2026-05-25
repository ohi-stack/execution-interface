export type PropertyRegistryEntry = {
  name: string;
  domain: string;
  role: string;
  visibility: 'public' | 'member' | 'protocol';
  commerceRoutedTo?: string;
};

export const propertyRegistry: PropertyRegistryEntry[] = [
  { name: 'OneGodian.org', domain: 'onegodian.org', role: 'foundation-presence', visibility: 'public' },
  { name: 'OneGodian.com', domain: 'onegodian.com', role: 'commerce-hub', visibility: 'public' },
  { name: 'u.OneGodian.com', domain: 'u.onegodian.com', role: 'learning-campus', visibility: 'member' },
  { name: 'galaxy.OneGodian.com', domain: 'galaxy.onegodian.com', role: 'galaxy-experience', visibility: 'member' },
  { name: 'capital.OneGodian.com', domain: 'capital.onegodian.com', role: 'capital-operations', visibility: 'member', commerceRoutedTo: 'onegodian.com' },
  { name: 'OMOS.OneGodian.com', domain: 'omos.onegodian.com', role: 'protocol-spec-runtime-node', visibility: 'protocol' },
  { name: 'QuantumOHI.com', domain: 'quantumohi.com', role: 'quantum-platform', visibility: 'public' }
];
