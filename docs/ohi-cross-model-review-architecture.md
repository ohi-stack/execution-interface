# OHI Cross-Model Review Architecture

The `/ohi-output-pipeline` route is a public-safe simulator for an OHI Cross-Model Review Cycle. It does not call external AI APIs. It demonstrates how a future live orchestration layer can coordinate separate model adapters, compare their outputs, and present comparative signals for human synthesis.

## Cycle stages

1. **Human Question** — the user supplies the source question.
2. **Model Activation** — GPT, Claude, Gemini, and Grok lanes are represented as separate adapters.
3. **Round 1 Independent Outputs** — each adapter returns an independent output object containing a summary, key ideas, risks, and a novel insight.
4. **Cross-Model Review Matrix** — each model reviews the other three models. Self-review is intentionally excluded.
5. **Signal Extraction** — agreement zones, contradictions, missing ideas, and novel insights are displayed for inspection.
6. **Human Synthesis Layer** — the human reviews the comparative signals before accepting the synthesized answer.
7. **Final OHI Output** — a governed output is produced from the comparative review signals.

## Adapter path to live orchestration

Adapter contracts live in `src/lib/ohi/adapters.ts`. The current adapters are simulation implementations for OpenAI, Anthropic, Google Gemini, and xAI. A live implementation should preserve the same `OhiModelAdapter` interface and replace each simulated `generate` method with authenticated provider calls in a server-only orchestration route.

## Public safety

The manifest distinguishes `simulation` mode from future `live` orchestration mode. Until server-side credentials, rate limits, audit logging, and provider-specific safety handling exist, the public page must continue to describe itself as simulation mode only.
