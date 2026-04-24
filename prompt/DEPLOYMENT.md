# OneGodian AI System Prompt Deployment Guide

## Objective
Deploy the OneGodian AI system prompt as a versioned, reusable runtime asset.

## Canonical Prompt Asset
- `system-prompt.raw.txt`

## Integration Patterns

### Web app backend
Inject the raw prompt as the stable `system` role content before user messages.

### Chatbot middleware
Apply prompt once per session initialization. Do not mutate text at runtime.

### Multi-channel app
Use one source of truth from `prompt/system-prompt.raw.txt` and propagate through build/deploy artifacts.

## Implementation Example (Node.js pseudo-flow)
1. Read prompt file at startup.
2. Store in immutable in-memory configuration.
3. Pass as system prompt to model call.
4. Log prompt version with each request for auditability.

## Operational Notes
- Keep prompt version explicit (see `CHANGELOG.md`).
- Any placeholder integration must be labeled `PLACEHOLDER`.
- Do not claim legal status from prompt outputs.
