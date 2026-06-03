export type ProtocolDoc = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  version: string;
  status: string;
  updated: string;
  source: string;
  pdfLabel: string;
  markdown: string;
};

export const protocolDocs: ProtocolDoc[] = [
  {
    slug: 'protocol',
    title: 'The OneGodian Protocol™',
    eyebrow: 'Protocol Docs Engine',
    description: 'Optional identity, semantic, and alignment framework for human expression, AI-agent behavior, interfaces, and interoperable knowledge systems.',
    version: 'v1.0',
    status: 'Canonical Draft',
    updated: '2026-06-03',
    source: 'The OneGodian Protocol™ and Algorithm™',
    pdfLabel: 'Download Protocol PDF',
    markdown: `# The OneGodian Protocol™

The OneGodian Protocol™ is an optional identity, semantic, and alignment framework centered on unity, clarity, respectful interaction, and interoperability. It is designed for human identity expression, AI and agent interaction systems, digital communication environments, and future interface layers.

## Operating intent

- Preserve voluntary identity expression without presenting participation as doctrine or legal status.
- Create shared language for classification, metadata, search, interface behavior, and assistant response alignment.
- Keep OneGodian concepts clear across public pages, member tools, AI systems, and operational dashboards.
- Maintain institutional-safe boundaries while supporting future machine-readable imports.

## Protocol layers

- **Human Layer:** voluntary identity expression, public interpretation, dignity, and respectful language.
- **Semantic Layer:** classification, metadata, route naming, knowledge retrieval, and glossary-safe meaning.
- **Agent Layer:** AI alignment, prompt behavior, escalation boundaries, and interaction standards.
- **Interface Layer:** dashboards, assistants, robotics, user-facing systems, and display conventions.

## Compliance boundary

The Protocol is descriptive and optional. It does not establish doctrine, require adherence, or supersede legal, institutional, platform, employment, tax, financial, regulatory, court, or governmental rules.

## Machine import contract

\`\`\`yaml
slug: protocol
engine: protocol-docs-engine
version: v1.0
source: The OneGodian Protocol™ and Algorithm™
status: canonical-draft
future_imports:
  - markdown
  - mdx
  - remote_registry
\`\`\`
`
  },
  {
    slug: 'algorithm',
    title: 'The OneGodian Algorithm™',
    eyebrow: 'Decision & Synthesis Model',
    description: 'A structured method for identifying the clearest, most coherent, and least destructive path across human, digital, and intelligent-system environments.',
    version: 'v1.0',
    status: 'Canonical Draft',
    updated: '2026-06-03',
    source: 'The OneGodian Protocol™ and Algorithm™',
    pdfLabel: 'Download Algorithm PDF',
    markdown: `# The OneGodian Algorithm™

The OneGodian Algorithm™ is a structured decision and synthesis model used to identify the clearest, most coherent, and least destructive path across human, digital, and intelligent-system environments.

## Core sequence

- **Observe:** collect facts, claims, risks, context, and available signals.
- **Distill:** separate signal from noise, distortion, and unnecessary fragmentation.
- **Align:** evaluate options against truth, clarity, dignity, coherence, and constructive unity.
- **Select:** choose the highest-coherence path available under the constraints.
- **Execute:** apply the selected path in a structured and measurable way.
- **Verify:** compare the result against reality and correct where needed.

## Operating posture

The Algorithm prioritizes coherence before speed, truthful representation before promotional certainty, and corrective verification before declaring completion.

## Implementation pattern

\`\`\`ts
const onegodianAlgorithm = ['observe', 'distill', 'align', 'select', 'execute', 'verify'];
\`\`\`

## Safe-use rule

Never present unverified implementation as complete production truth. Route uncertain claims through verification, status labels, and boundary language.
`
  },
  {
    slug: 'system-prompt',
    title: 'OneGodian System Prompt Standard',
    eyebrow: 'Agent Alignment',
    description: 'A reusable system-prompt documentation route for assistants operating inside the OneGodian protocol, product, and runtime surfaces.',
    version: 'v0.9',
    status: 'Implementation Guide',
    updated: '2026-06-03',
    source: 'The OneGodian Protocol™ and Algorithm™',
    pdfLabel: 'Download Prompt PDF',
    markdown: `# OneGodian System Prompt Standard

This standard aligns assistant behavior with operational safety, clarity, role boundaries, maturity labels, and respectful interaction across OneGodian public and member-facing systems.

## Purpose

- Answer with clarity, dignity, and operational usefulness.
- Distinguish live capabilities from planned, in-development, placeholder, or conceptual materials.
- Preserve legal, financial, medical, institutional, platform, and governmental boundaries.
- Use protocol language as alignment context, not as coercive doctrine.

## Classification rules

- **Live:** implemented, routed, and verifiable in the current product surface.
- **In Development:** actively represented as being built or prepared.
- **Needs Setup:** defined but blocked by configuration, data, dependency, or deployment work.
- **Planned:** named as roadmap or conceptual direction, not production truth.

## Baseline assistant prompt

\`\`\`text
You are operating inside the OneGodian documentation and runtime context. Preserve truth, clarity, dignity, coherence, and constructive unity. Never present unverified implementation as complete production truth. Use maturity labels when describing systems, maintain external legal and institutional boundaries, and route uncertainty to verification.
\`\`\`

## Response boundaries

The assistant should be concise when the user requests speed and thorough when the task requires auditability, citations, implementation detail, or route-by-route validation.
`
  },
  {
    slug: 'gcd-synthesis',
    title: 'Architecture of Algorithmic GCD Model Synthesis',
    eyebrow: 'Synthesis Architecture',
    description: 'A model-synthesis architecture that treats the greatest common denominator as the strongest shared coherence across competing inputs, constraints, and implementation paths.',
    version: 'v0.5',
    status: 'Research Draft',
    updated: '2026-06-03',
    source: 'The Architecture of Algorithmic GCD Model Synthesis',
    pdfLabel: 'Download GCD PDF',
    markdown: `# Architecture of Algorithmic GCD Model Synthesis

Algorithmic GCD Model Synthesis identifies the greatest common denominator of coherence across facts, claims, constraints, stakeholders, systems, and execution paths. It is used to reduce fragmentation without erasing meaningful differences.

## Synthesis objective

The objective is not to average every input. The objective is to locate the strongest common structure that remains truthful, useful, and executable after contradictions, noise, and unsupported claims are removed.

## Architecture stages

- **Input normalization:** convert facts, constraints, intents, risks, and source claims into comparable units.
- **Contradiction mapping:** identify conflicts, missing evidence, circular claims, and dependency gaps.
- **Coherence scoring:** rank candidate models by truth alignment, clarity, dignity, interoperability, reversibility, and operational cost.
- **GCD extraction:** preserve the strongest shared primitives that can survive verification.
- **Model synthesis:** assemble an executable model from the verified primitives.
- **Verification loop:** test the model against reality, telemetry, human review, and documented acceptance criteria.

## GCD scoring primitive

\`\`\`ts
type GcdSignal = {
  claim: string;
  supportLevel: 'verified' | 'probable' | 'uncertain' | 'rejected';
  coherenceScore: number;
  destructiveRisk: number;
};
\`\`\`

## Application boundary

GCD synthesis is a decision-support architecture. It should not override domain law, professional judgment, human consent, platform policy, or required institutional process.
`
  },
  {
    slug: 'ots-v5',
    title: 'OTS-V5 Documentation Standard',
    eyebrow: 'OneGodian Time™',
    description: 'The OTS-V5 route documents internal OneGodian chronology presentation while preserving Gregorian and UTC control for production records.',
    version: 'v5.0',
    status: 'Runtime Standard',
    updated: '2026-06-03',
    source: 'OTS-V5',
    pdfLabel: 'Download OTS-V5 PDF',
    markdown: `# OTS-V5 Documentation Standard

OTS-V5 is an internal OneGodian cultural and system chronology presentation layer. It can be displayed beside conventional time references, but it does not replace Gregorian or UTC obligations.

## Core rules

- Gregorian calendar dates remain controlling for legal, financial, tax, court, contractual, employment, regulatory, and governmental records.
- UTC timestamps remain the system truth for logs, APIs, storage, synchronization, audit trails, and cross-system coordination.
- Dual dating may display OneGodian Time beside Gregorian or UTC references.
- OTS-V5 labels must not create confusion about external civil-time duties.

## Documentation display pattern

\`\`\`text
Gregorian: 2026-06-03
UTC: 2026-06-03T00:00:00Z
OneGodian Time: OTS-V5 display value
Controlling record: Gregorian / UTC
\`\`\`

## Runtime integration

Systems should store UTC first, display Gregorian for public and legal clarity, and render OTS-V5 as a presentation layer only when context makes the internal chronology meaningful.

## Safety statement

OTS-V5 is cultural, educational, operational, and internal-system language. It is not a replacement for civil timekeeping, legal calendars, institutional deadlines, or government-recognized records.
`
  }
];

export const protocolDocIndex = protocolDocs.reduce<Record<string, ProtocolDoc>>((acc, doc) => {
  acc[doc.slug] = doc;
  return acc;
}, {});

export function getProtocolDoc(slug: string) {
  return protocolDocIndex[slug];
}
