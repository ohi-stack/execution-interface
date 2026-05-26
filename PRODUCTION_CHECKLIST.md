# Production Checklist
- Configure .env from .env.example
- Run npm run check
- Run npm run smoke
- Run npm run smoke:pages
- Verify /health, /api/health, /manifest, /api/manifest, /dashboard
- Confirm /process rejects missing x-omos-key
