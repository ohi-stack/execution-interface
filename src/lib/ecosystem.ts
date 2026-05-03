export type EcosystemModule = {
  id: string;
  name: string;
  category: 'infrastructure' | 'identity' | 'commerce' | 'governance';
  status: 'active' | 'beta' | 'queued';
  summary: string;
};

export const ONEGODIAN_ECOSYSTEM: EcosystemModule[] = [
  {
    id: 'OG-ECO-01',
    name: 'OneGodian Identity Engine',
    category: 'identity',
    status: 'active',
    summary: 'Unified identity profiles, session trust, and role-ready account surfaces for app.onegodian.com.'
  },
  {
    id: 'OG-ECO-02',
    name: 'ODIN Registry Core',
    category: 'governance',
    status: 'active',
    summary: 'Canonical registration, validation, and indexing for ODIN records across all routes.'
  },
  {
    id: 'OG-ECO-03',
    name: 'Capital + Products Exchange',
    category: 'commerce',
    status: 'beta',
    summary: 'Commerce and product rails for delivery, licensing, and member-grade monetization.'
  },
  {
    id: 'OG-ECO-04',
    name: 'Planetary Infra Layer',
    category: 'infrastructure',
    status: 'queued',
    summary: 'Operational infrastructure for planets, moon systems, and cross-route data mirroring.'
  }
];
