export type ModuleStatus = {
  module: string;
  status: string;
  readiness: 'active' | 'ready' | 'needs-work';
};

export const statusModules: ModuleStatus[] = [
  { module: 'OMOS Framework', status: 'Active content build', readiness: 'active' },
  { module: 'Algorithm Page', status: 'Ready', readiness: 'ready' },
  { module: 'Protocol Page', status: 'Ready', readiness: 'ready' },
  { module: 'OHI Pipeline', status: 'Ready for visual implementation', readiness: 'ready' },
  { module: 'Belief Mapper Lite', status: 'Needs interactive form', readiness: 'needs-work' },
  { module: 'System Prompt Page', status: 'Ready', readiness: 'ready' },
  { module: 'Docs Hub', status: 'Needs file routing', readiness: 'needs-work' },
  { module: 'API Manifest', status: 'Needed', readiness: 'needs-work' },
  { module: 'Health Endpoint', status: 'Needed', readiness: 'needs-work' },
  { module: 'Plugin Bridge', status: 'Needs WordPress integration testing', readiness: 'needs-work' }
];

export const statusSummary = {
  active: statusModules.filter((item) => item.readiness === 'active').length,
  ready: statusModules.filter((item) => item.readiness === 'ready').length,
  needsWork: statusModules.filter((item) => item.readiness === 'needs-work').length
};
