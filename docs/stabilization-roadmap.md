# Stabilization Roadmap

This document turns the eight requested stabilization tracks into concrete standards for this repository.

## 1) ACC stack stabilization
- Enforce Node 20.x in CI and production.
- Keep runtime checks (`npm run check`) and type checks (`npm run typecheck`) mandatory before deployment.
- Preserve production lock validation (`npm run prod:verify`) as a release gate.

## 2) App/Console separation stabilization
- Keep host and route segmentation in middleware and avoid exposing console routes through app-facing hosts.
- Ensure all privileged console paths are internal-only and noindexed.
- Treat the runtime API (`server.js`) as a separate bounded context with namespaced endpoints.

## 3) RBAC stabilization
- API key verification is required for process and metrics endpoints.
- Metrics access is restricted to enterprise-level keys only (`requireAdmin`).
- Continue mapping role/plan access through key metadata rather than UI-only checks.

## 4) Deployment stabilization
- Deployment remains gated by build + production lock checks.
- Health (`/api/v1/health`) and readiness (`/api/v1/ready`) endpoints are first-class deploy checks.
- Keep backwards-compatible aliases while moving integrations to versioned APIs.

## 5) QRV registry/verification stabilization
- Keep deterministic pipeline output from `OMOSProcess` including `verification` object.
- Treat verification output as non-optional in process responses.

## 6) API namespaces stabilization
- All active runtime endpoints are available under `/api/v1/*`.
- Legacy non-versioned endpoints are maintained as compatibility redirects only.

## 7) Production monitoring
- Health and readiness endpoints expose service status and memory pressure signal.
- Metrics endpoint provides usage counters and process health telemetry.

## 8) CI/CD validation
- GitHub Actions workflow validates lint, typecheck, syntax check, build, and production lock checks on push/PR.
- CI failures block unsafe merges and prevent unstable deployments.
