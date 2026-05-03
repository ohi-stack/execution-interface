export type CanonFilter =
  | 'all'
  | 'inner'
  | 'middle'
  | 'outer'
  | 'beings'
  | 'realms'
  | 'satellites'
  | 'lineages'
  | 'figures'
  | 'temporal'
  | 'cosmology'
  | 'canon';

export interface Moon {
  id: string;
  name: string;
  designation: string;
  valuation: string;
  surface: string;
  orbitBand: 'inner' | 'middle' | 'outer';
  description: string;
}

export interface Planet {
  id: string;
  name: string;
  valuation: string;
  tier: 'Inner Crown' | 'Middle Song' | 'Outer Veil';
  surface: string;
  atmosphere: string;
  textureType: string;
  ringType: string;
  description: string;
  moons: Moon[];
}

export interface CanonEntry {
  id: string;
  name: string;
  valuation: string;
  description: string;
  tags: CanonFilter[];
}

export interface CanonCategory {
  id: Exclude<CanonFilter, 'all' | 'inner' | 'middle' | 'outer' | 'satellites'>;
  label: string;
  entries: CanonEntry[];
}

const PLANET_NAMES = [
  'Onegodia™','Auralis™','Luminaris™','Elyndria™','Vaeloria™','Seraphi’el Prime™','Myka’thra™','Ka’zaen™','Vera’quon™','Umbryss™','Astra’Noema™','Chronora™','Garethuun™','Qelithon™','Vora’el™','Kaor’Myn™','Vorthun’Kai™','Oraelune™','Ignivar™','Auraleth™','Terranova One™','Kaelenar™','Solytheris™','Oraphine™','Auranthis™'
];

export const ATLAS: Planet[] = PLANET_NAMES.map((name, i) => ({
  id: `PR-${String(i + 1).padStart(3, '0')}`,
  name,
  valuation: `${(i + 1) * 40}B CR`,
  tier: i < 8 ? 'Inner Crown' : i < 17 ? 'Middle Song' : 'Outer Veil',
  surface: ['Crystalline continents', 'Oceanic mantle', 'Basalt plateaus'][i % 3],
  atmosphere: ['Nitrogen-light plasma', 'Aurora-rich oxygen blend', 'Ionized cloud canopy'][i % 3],
  textureType: ['Luminous marble', 'Storm-banded', 'Fractal biomes'][i % 3],
  ringType: ['No rings', 'Dust halo', 'Dual arc rings'][i % 3],
  description: `${name} is an ODIN-PR registered world with layered canon continuity and linked civilizational narratives.`,
  moons: [
    {
      id: `MS-${String(i + 1).padStart(3, '0')}-A`,
      name: `${name.replace('™', '')} I`,
      designation: `S-${i + 1}A`,
      valuation: `${(i + 1) * 4}B CR`,
      surface: ['Regolith ice', 'Basalt and mist', 'Crystalline dust'][i % 3],
      orbitBand: i < 8 ? 'inner' : i < 17 ? 'middle' : 'outer',
      description: `Primary satellite of ${name}; maintained in ODIN orbital records.`
    }
  ]
}));

export const SPECIES: CanonEntry[] = [
  { id: 'SP-001', name: 'Onegodians', valuation: 'Prime', description: 'Steward lineage linked to Onegodia™ and core continuity protocols.', tags: ['beings', 'canon'] },
  { id: 'SP-002', name: 'Luminari', valuation: 'Aural', description: 'Photonic beings known for signal translation and light harmonics.', tags: ['beings', 'cosmology'] }
];
export const REALMS: CanonEntry[] = [
  { id: 'RM-001', name: 'Threshold Veil', valuation: 'High', description: 'Transitional realm interfacing with Umbryss™ and Vorthun’Kai™.', tags: ['realms', 'cosmology'] }
];
export const LINEAGES: CanonEntry[] = [
  { id: 'LN-001', name: 'Elders of Continuum', valuation: 'Foundational', description: 'Continuity keepers maintaining canon laws and chronicle fidelity.', tags: ['lineages', 'canon'] }
];
export const FIGURES: CanonEntry[] = [
  { id: 'FG-001', name: 'Prime Architect', valuation: 'Symbolic', description: 'Foundational figure used in institutional and educational canon.', tags: ['figures', 'canon'] }
];
export const TEMPORAL: CanonEntry[] = [
  { id: 'TP-001', name: 'Chronora Current Index', valuation: 'Operational', description: 'Temporal framework used to classify era-shift and sequence continuity.', tags: ['temporal', 'cosmology'] }
];

export const CANON_CATEGORIES: CanonCategory[] = [
  { id: 'beings', label: 'Species', entries: SPECIES },
  { id: 'realms', label: 'Realms', entries: REALMS },
  { id: 'lineages', label: 'Lineages', entries: LINEAGES },
  { id: 'figures', label: 'Figures', entries: FIGURES },
  { id: 'temporal', label: 'Temporal', entries: TEMPORAL },
  { id: 'canon', label: 'Canon', entries: [...SPECIES, ...REALMS, ...LINEAGES, ...FIGURES, ...TEMPORAL] },
  { id: 'cosmology', label: 'Cosmology', entries: [...REALMS, ...TEMPORAL] }
];
