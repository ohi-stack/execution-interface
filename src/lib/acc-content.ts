export type AccStatus = 'live' | 'external-authority' | 'watch' | 'planned';

export const accRepository = {
  owner: 'ohi-stack',
  name: 'acc',
  url: 'https://github.com/ohi-stack/acc',
  deployTarget: 'https://acc.onegodian.com',
  canonicalHost: 'acc.onegodian.com'
};

export const accPositioning = {
  name: 'ACC™ Agent Command Console',
  shortName: 'ACC™',
  eyebrow: 'OPERATOR-FACING COMMAND CONSOLE',
  summary:
    'ACC™ is the dedicated operator interface for observing agents, coordinating workflows, opening approvals, and viewing operational telemetry across OneGodian systems.',
  boundary:
    'ACC is an interface only. Authority remains with OSCC, OCP, OEG, identity, registry, and audit services. ACC does not self-authorize agents, mint identity, write registry truth, or replace audit systems.'
};

export const authorityServices = [
  {
    key: 'oscc',
    name: 'OSCC',
    role: 'Source-of-control coordination and command authority.',
    ownership: 'external-authority' as AccStatus
  },
  {
    key: 'ocp',
    name: 'OCP',
    role: 'Policy authorization, privileged-action decisions, and approval gates.',
    ownership: 'external-authority' as AccStatus
  },
  {
    key: 'oeg',
    name: 'OEG',
    role: 'Execution gateway for authorized operational tasks and routes.',
    ownership: 'external-authority' as AccStatus
  },
  {
    key: 'identity',
    name: 'Identity Service',
    role: 'Operator identity, roles, sessions, and access claims.',
    ownership: 'external-authority' as AccStatus
  },
  {
    key: 'registry',
    name: 'Registry Service',
    role: 'Canonical records, entity references, agent registrations, and route metadata.',
    ownership: 'external-authority' as AccStatus
  },
  {
    key: 'audit',
    name: 'Audit Service',
    role: 'Immutable evidence, event trails, decision logs, and compliance records.',
    ownership: 'external-authority' as AccStatus
  }
];

export const consoleModules = [
  {
    title: 'Operator Dashboard',
    href: '/dashboard',
    status: 'live' as AccStatus,
    description: 'At-a-glance operational posture, pending approvals, agent health, route readiness, and external authority status.'
  },
  {
    title: 'Agents',
    href: '/agents',
    status: 'live' as AccStatus,
    description: 'Operator registry view for agent records, health states, assigned capabilities, and control-plane bindings.'
  },
  {
    title: 'Tasks',
    href: '/tasks',
    status: 'live' as AccStatus,
    description: 'Queue-facing task triage for work items awaiting authorization, assignment, execution, verification, or audit closeout.'
  },
  {
    title: 'Workflows',
    href: '/workflows',
    status: 'watch' as AccStatus,
    description: 'Workflow run visibility, policy checkpoints, delegated steps, and handoffs between OSCC, OCP, and OEG.'
  },
  {
    title: 'OCP Decisions',
    href: '/ocp',
    status: 'external-authority' as AccStatus,
    description: 'Read-only policy and decision surface. OCP remains the authoritative system for approvals.'
  },
  {
    title: 'OEG Routes',
    href: '/oeg',
    status: 'external-authority' as AccStatus,
    description: 'Execution gateway route state, enabled tools, and authorized command paths. OEG remains the execution authority.'
  },
  {
    title: 'Adapters',
    href: '/adapters',
    status: 'watch' as AccStatus,
    description: 'Connector readiness for supported services without merging ACC into any downstream application or plugin repository.'
  },
  {
    title: 'Approvals',
    href: '/approvals',
    status: 'live' as AccStatus,
    description: 'Human operator review queues for privileged actions, policy exceptions, and deployment gates.'
  },
  {
    title: 'Audit',
    href: '/audit',
    status: 'external-authority' as AccStatus,
    description: 'Evidence and event viewer backed by the external audit service; ACC never becomes the audit source of truth.'
  },
  {
    title: 'Deployments',
    href: '/deployments',
    status: 'live' as AccStatus,
    description: 'Deployment posture for acc.onegodian.com, release markers, environment checks, and repository separation.'
  }
];

export const separationRules = [
  'Do not merge ACC into QRV repositories.',
  'Do not merge ACC into the OneGodian App repository.',
  'Do not merge ACC into Capital repositories.',
  'Do not merge ACC into OMOS repositories.',
  'Do not merge ACC into WordPress plugin repositories.',
  'Keep ACC operator-facing, noindex, and separate from public/member-facing products.'
];
