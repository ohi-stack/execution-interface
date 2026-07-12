export type ProtocolDoc = {
  slug: string;
  title: string;
  badge: string;
  version: string;
  summary: string;
  pdfHref: string;
  markdown: string;
};

export const protocolDocs: ProtocolDoc[] = [
  {
    slug: 'protocol',
    title: 'The OneGodian Protocol™',
    badge: 'Protocol Canon',
    version: 'v1.0',
    summary: 'A neutral interaction standard for human, semantic, agent, and interface layers.',
    pdfHref: '/docs/protocol?format=pdf',
    markdown: `# The OneGodian Protocol™

The OneGodian Protocol™ defines a recognition and interaction framework for identity, semantic systems, AI agents, interfaces, and implementation environments.

## Operating purpose

The protocol establishes shared boundaries for safe system participation without asserting universal authority, denominational control, or exclusive religious interpretation.

## Layer model

- Human Layer: protects user dignity, agency, and consent.
- Semantic Layer: keeps labels, meanings, and definitions traceable.
- Agent Layer: instructs AI and automation systems to preserve safety and clarity.
- Interface Layer: turns protocol rules into visible user experience patterns.

## Implementation boundaries

Every implementation must support non-denominational neutrality, respectful interaction, compliance-first behavior, and clear disclosure of scope.

## System rule

If protocol language is ambiguous, choose the interpretation that maximizes human safety, consent, transparency, and auditability.`
  },
  {
    slug: 'algorithm',
    title: 'The OneGodian Algorithm™',
    badge: 'Alignment Logic',
    version: 'v1.0',
    summary: 'A repeatable Observe → Distill → Align → Select → Execute → Verify decision cycle.',
    pdfHref: '/docs/algorithm?format=pdf',
    markdown: `# The OneGodian Algorithm™

The OneGodian Algorithm™ is an alignment method for turning observations into verified action.

## Decision cycle

1. Observe: collect context without premature judgment.
2. Distill: reduce noise into the essential signal.
3. Align: compare the signal to protocol, purpose, and constraints.
4. Select: choose the safest viable path.
5. Execute: perform the action with traceable intent.
6. Verify: review outcome, evidence, and residual risk.

## Alignment layers

- Protocol Layer
- Experience Layer
- Community Layer
- Orientation Layer

## Decision rule

Prefer the path that preserves dignity, increases coherence, reduces avoidable harm, and remains verifiable by future operators.

## Future imports

Markdown source can be replaced with file-backed content while retaining the same rendering engine, navigation shell, and metadata contract.`
  },
  {
    slug: 'system-prompt',
    title: 'System Prompt Architecture',
    badge: 'Prompt Standard',
    version: 'v1.0',
    summary: 'A prompt composition guide for OMOS-aligned assistants, agents, and interfaces.',
    pdfHref: '/docs/system-prompt?format=pdf',
    markdown: `# System Prompt Architecture

The OMOS system prompt standard converts protocol and algorithm rules into operational instructions for AI agents.

## Prompt hierarchy

- Identity: state the role and operating scope.
- Protocol: declare safety, neutrality, and compliance constraints.
- Algorithm: define the reasoning cycle used to transform inputs into outputs.
- Interface: specify response shape, citations, and user-facing behaviors.

## Required behaviors

Agents must avoid universal authority claims, preserve user autonomy, disclose uncertainty, and escalate sensitive decisions to appropriate human or institutional review.

## Copy-ready scaffold

\`\`\`text
You are an OMOS-aligned assistant. Preserve dignity, clarify scope, follow compliance constraints, and use Observe → Distill → Align → Select → Execute → Verify before producing consequential output.
\`\`\`

## Auditability

Prompts should be versioned, reviewed, and mapped to the protocol documents that authorize them.`
  },
  {
    slug: 'gcd-synthesis',
    title: 'The Architecture of Algorithmic GCD Model Synthesis',
    badge: 'Synthesis Method',
    version: 'v1.0',
    summary: 'A synthesis architecture for finding greatest common denominators across models and belief systems.',
    pdfHref: '/docs/gcd-synthesis?format=pdf',
    markdown: `# The Architecture of Algorithmic GCD Model Synthesis

Algorithmic GCD Model Synthesis identifies the greatest common denominator across multiple models, belief structures, taxonomies, or institutional frameworks.

## Core idea

Rather than forcing total agreement, GCD synthesis extracts shared primitives that can support cooperation, translation, and interoperable reasoning.

## Pipeline

1. Ingest source models.
2. Normalize terminology.
3. Map equivalent concepts.
4. Isolate shared primitives.
5. Preserve meaningful differences.
6. Synthesize an interoperable model.
7. Validate with stakeholders and evidence.

## Output qualities

A valid synthesis is minimal, explainable, reversible, and useful for future decisions.

## OMOS use

Within OMOS, GCD synthesis supports belief mapping, institutional classification, agent alignment, and cross-framework implementation.`
  },
  {
    slug: 'ots-v5',
    title: 'OTS-V5',
    badge: 'Time Standard',
    version: 'v5.0',
    summary: 'The epoch-based OTS calendar reference used by OMOS interface and calendar views.',
    pdfHref: '/docs/ots-v5?format=pdf',
    markdown: `# OTS-V5

OTS-V5 is the OneGodian time-system reference used to label calendar views with an epoch-based day order.

## Epoch

The OTS epoch begins on January 1, 2026 UTC. Day order advances from the epoch rather than from the Gregorian weekday function.

## Interface rule

Public calendars may preserve Gregorian civil month grids for recognition while adding OTS labels for internal sequence, epoch day, and system context.

## Day-order behavior

OTS day order is calculated from the epoch delta. This keeps the system stable across interface implementations and avoids dependency on local weekday assumptions.

## Implementation note

OTS-V5 documentation should remain importable as markdown so calendar, API, and agent references can share one canonical source.`
  }
];

export const docsBySlug = new Map(protocolDocs.map((doc) => [doc.slug, doc]));
