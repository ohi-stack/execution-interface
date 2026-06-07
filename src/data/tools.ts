export type OmosTool = {
  name: string;
  href: string;
  description: string;
};

export const tools: OmosTool[] = [
  {
    name: 'Algorithm',
    href: '/algorithm',
    description: 'OneGodian Algorithm™ layers, decision sequence, and alignment rule.'
  },
  {
    name: 'Protocol',
    href: '/protocol',
    description: 'Human, semantic, agent, and interface standards for safe neutral interaction.'
  },
  {
    name: 'OHI Pipeline',
    href: '/ohi-pipeline',
    description: 'Operational synthesis process from source prompt to OMOS normalization.'
  },
  {
    name: 'Belief Mapper',
    href: '/belief-mapper',
    description: 'Journey-stage model for Seeker, Believer, OneGodian, and Elder pathways.'
  },
  {
    name: 'System Prompt',
    href: '/system-prompt',
    description: 'AI interaction standards for identity recognition, classification, conduct, and versions.'
  },
  {
    name: 'Documentation Hub',
    href: '/docs',
    description: 'Core specifications, developer materials, institutional materials, and version control.'
  }
];
