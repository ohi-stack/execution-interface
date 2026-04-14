# OHI Output Pipeline (Deployable Demo Module)

Version: `0.1.0`

This module operationalizes the existing OHI concept as a deterministic pipeline:

`compare → filter → normalize → output`

## Current State
- **Simulated inputs**: model candidates are provided as payload data.
- **Deterministic processing**: scoring and ordering are explicit.
- **Audit event output**: every run emits a structured event object.

## Inputs
```json
{
  "requestId": "req-1001",
  "filters": { "minConfidence": 0.7 },
  "candidates": [
    { "model_id": "model-a", "confidence": 0.72, "output_text": "..." }
  ]
}
```

## Outputs
- `stages.compare`
- `stages.filter`
- `stages.normalize`
- `stages.output`
- `auditEvent`

## Simulated vs Real
- **Simulated**: model candidates and confidence values.
- **Real-ready**: stage contracts, output shape, and audit log structure.

## Run in app code
```js
import { runOhiPipeline } from '../pipeline/index.js';
```
