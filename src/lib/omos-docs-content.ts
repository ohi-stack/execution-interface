export const omosRoutes = [
  { href: '/', label: 'Home' },
  { href: '/protocol', label: 'Protocol' },
  { href: '/algorithm', label: 'Algorithm' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/api', label: 'API' },
  { href: '/docs', label: 'Docs' },
  { href: '/use-cases', label: 'Use Cases' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/status', label: 'Status' }
];

export const complianceSafeWording =
  'OMOS is an operational and interpretive systems framework. It does not create legal immunity, governmental authority, tax exemption, or jurisdiction over non-participants.';

export const productionRule =
  'Production rule: If a feature is not operational, documented, and repeatable, mark it as planned, not active.';

export const processCurl = `curl -X POST https://omos.onegodian.com/api/process \\
  -H "content-type: application/json" \\
  -H "x-omos-key: $OMOS_API_KEY" \\
  -d '{
    "content": { "raw": "Summarize this operational note for publication." },
    "metadata": { "source": "docs-node", "mode": "summary" }
  }'`;

export const processJson = `{
  "status": "ok",
  "plan": "enterprise",
  "limits": { "rpm": 1000, "features": ["omos_processing"] },
  "data": {
    "classification": "operational_summary",
    "summary": "A concise, compliance-safe interpretation of the submitted content.",
    "checks": ["auth", "input_validation", "alignment", "response_shape"]
  },
  "requestId": "req_omos_01"
}`;

export const errorJson = `{
  "error": "unauthorized",
  "message": "Valid OMOS API key required",
  "requestId": "req_omos_unauthorized"
}`;
