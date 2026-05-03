export type Moon = {
  name: string;
  designation: string;
  orbitalPeriod: string;
  category: 'habitable-candidate' | 'resource' | 'observatory' | 'frontier';
  status: 'active' | 'survey' | 'queued';
  summary: string;
};

export type MoonSystem = {
  id: string;
  hostPlanet: string;
  systemName: string;
  description: string;
  moons: Moon[];
};

export const ONEGODIAN_MOON_SYSTEMS: MoonSystem[] = [
  {
    id: 'OG-MS-01',
    hostPlanet: 'ODIN-PR-03',
    systemName: 'Aether Crown',
    description: 'Primary diplomatic corridor with synchronized relay moons for cultural, governance, and orientation missions.',
    moons: [
      { name: 'Seraph-1', designation: 'MS-01-A', orbitalPeriod: '9.2d', category: 'observatory', status: 'active', summary: 'Deep-space observatory and guidance beacon for academy fleets.' },
      { name: 'Lyra-2', designation: 'MS-01-B', orbitalPeriod: '14.8d', category: 'habitable-candidate', status: 'survey', summary: 'Temperate moon under biosphere compatibility studies.' }
    ]
  },
  {
    id: 'OG-MS-02',
    hostPlanet: 'ODIN-PR-08',
    systemName: 'Heliox Belt',
    description: 'Resource-forward system focused on long-horizon energy extraction and logistics stabilization.',
    moons: [
      { name: 'Brontes', designation: 'MS-02-A', orbitalPeriod: '6.1d', category: 'resource', status: 'active', summary: 'Helium-rich upper crust with autonomous extraction nodes.' },
      { name: 'Nyx Relay', designation: 'MS-02-C', orbitalPeriod: '20.4d', category: 'frontier', status: 'queued', summary: 'Future expansion moon for outer-belt routing and defense.' }
    ]
  },
  {
    id: 'OG-MS-03',
    hostPlanet: 'ODIN-PR-14',
    systemName: 'Vigil Arc',
    description: 'A security and education-aligned moon system supporting mentorship habitats and navigation sanctuaries.',
    moons: [
      { name: 'Ansel', designation: 'MS-03-A', orbitalPeriod: '11.5d', category: 'habitable-candidate', status: 'survey', summary: 'Low-radiation moon selected for youth orientation habitats.' },
      { name: 'Ketra', designation: 'MS-03-B', orbitalPeriod: '18.9d', category: 'observatory', status: 'active', summary: 'Telemetry and protocol validation moon for guardian fleets.' }
    ]
  }
];
