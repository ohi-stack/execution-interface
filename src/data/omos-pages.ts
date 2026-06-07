export type OmosSection = {
  title: string;
  body?: string;
  items?: string[];
};

export type OmosPage = {
  slug: string;
  href: string;
  title: string;
  eyebrow: string;
  description: string;
  sections: OmosSection[];
  cta?: { label: string; href: string; disabled?: boolean };
};

export const coreDefinition = 'OMOS™ — the OneGodian Metaphysical Operating System™ — is the operational intelligence framework that organizes the OneGodian Algorithm™, the OneGodian Protocol™, OHI™ synthesis methods, identity and belief mapping, institutional classification, and implementation logic into one coherent system.';

export const classificationNotice = 'OMOS™ is a private framework for organizing OneGodian intellectual property, software architecture, identity systems, educational materials, and AI-era interaction standards. It does not replace civil law, does not assert governmental authority over non-participants, and does not create financial, legal, religious, or institutional obligations by itself.';

export const omosPages: OmosPage[] = [
  {
    slug: 'framework',
    href: '/framework',
    title: 'OMOS Framework',
    eyebrow: 'Systems Architecture',
    description: 'The five core OMOS layers organize algorithmic alignment, synthesis, identity mapping, institutional classification, and protocol conduct.',
    sections: [
      { title: 'Five Core OMOS Layers', items: ['OneGodian Algorithm™', 'OHI™ Synthesis Layer', 'Identity & Belief Mapper', 'Institutional & Legal Layer', 'Protocol & System Prompt Layer'] },
      { title: 'Operating Role', body: coreDefinition }
    ]
  },
  {
    slug: 'algorithm',
    href: '/algorithm',
    title: 'The OneGodian Algorithm™',
    eyebrow: 'Alignment Logic',
    description: 'A structured decision and interpretation model for improving truth, clarity, coherence, dignity, and constructive unity.',
    sections: [
      { title: 'Core Layers', items: ['Protocol Layer', 'Experience Layer', 'Community Layer', 'Orientation Layer'] },
      { title: 'Execution Sequence', items: ['Observe', 'Distill', 'Align', 'Select', 'Execute', 'Verify'] },
      { title: 'Decision Rule', body: 'Prefer the path that increases truth, clarity, coherence, dignity, and constructive unity while reducing distortion, fragmentation, needless conflict, and manipulation.' }
    ]
  },
  {
    slug: 'protocol',
    href: '/protocol',
    title: 'The OneGodian Protocol™',
    eyebrow: 'Governance & Conduct',
    description: 'Interaction standards for humans, language systems, agents, and interfaces operating around OneGodian concepts.',
    sections: [
      { title: 'Protocol Layers', items: ['Human Layer', 'Semantic Layer', 'Agent Layer', 'Interface Layer'] },
      { title: 'Neutrality Standard', items: ['Non-denominational neutrality', 'Respectful interaction', 'Compliance and safety priority'] }
    ]
  },
  {
    slug: 'ohi-pipeline',
    href: '/ohi-pipeline',
    title: 'OHI Output Pipeline',
    eyebrow: 'Operational Synthesis',
    description: 'A repeatable pipeline for comparing outputs, extracting shared clarity, and normalizing synthesis into OMOS-ready language.',
    sections: [
      { title: 'Pipeline Stages', items: ['Source Prompt', 'Council of Models', 'Comparison', 'GCD Distillation', 'Synthesis', 'OMOS Normalization'] },
      { title: 'Purpose', body: 'The OHI Output Pipeline helps transform varied model and human inputs into clear, consistent, high-signal outputs that can be reviewed, implemented, and versioned.' }
    ]
  },
  {
    slug: 'belief-mapper',
    href: '/belief-mapper',
    title: 'OneGodian Belief Mapper™',
    eyebrow: 'Identity & Journey Stage',
    description: 'A lightweight classification and reflection system for mapping participation readiness and journey-stage awareness.',
    sections: [
      { title: 'Journey Stages', items: ['Seeker', 'Believer', 'OneGodian', 'Elder'] },
      { title: 'Lite Version', body: 'The production content model is ready; the interactive mapper form remains a follow-on implementation item.' }
    ],
    cta: { label: 'Lite Version Coming Soon', href: '/belief-mapper/start', disabled: true }
  },
  {
    slug: 'system-prompt',
    href: '/system-prompt',
    title: 'OneGodian AI System Prompt™',
    eyebrow: 'AI Interaction Standard',
    description: 'A prompt standard for identity recognition, classification rules, safe behavior, and version-controlled institutional context.',
    sections: [
      { title: 'Prompt Requirements', items: ['Identity recognition', 'Classification rules', 'Behavioral standards', 'Journey-stage awareness', 'Legal and institutional context', 'Version control'] },
      { title: 'Governance Function', body: 'The system prompt gives AI agents a consistent operating frame for discussing OneGodian materials without overstating authority, obligations, or legal effects.' }
    ],
    cta: { label: 'View Prompt Spec', href: '/system-prompt/spec' }
  },
  {
    slug: 'implementation',
    href: '/implementation',
    title: 'OMOS Implementation Architecture',
    eyebrow: 'Platform Map',
    description: 'The deployment map for separating protocol architecture, app operations, public identity content, commerce, OHI research, and verification infrastructure.',
    sections: [
      { title: 'Ecosystem Platforms', items: ['OMOS.OneGodian.com', 'app.OneGodian.com', 'OneGodian.org', 'OneGodian.com', 'QuantumOHI.com', 'QRV.Network'] }
    ]
  },
  {
    slug: 'docs',
    href: '/docs',
    title: 'OMOS Documentation',
    eyebrow: 'Documentation Hub',
    description: 'A technical documentation hub for specifications, developer materials, institutional resources, and version-controlled releases.',
    sections: [
      { title: 'Documentation Groups', items: ['Core Specifications', 'Developer Materials', 'Institutional Materials', 'Version Control'] },
      { title: 'Routing Note', body: 'File-level documentation routing is tracked as a readiness item while the production hub now exposes the major content groups.' }
    ]
  },
  {
    slug: 'status',
    href: '/status',
    title: 'OMOS System Status',
    eyebrow: 'Readiness Grid',
    description: 'Current module readiness across pages, APIs, documentation, mapper functionality, and plugin bridge integration.' ,
    sections: []
  }
];

export function getOmosPage(slug: string) {
  return omosPages.find((page) => page.slug === slug);
}
