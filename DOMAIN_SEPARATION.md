# OneGodian Domain Separation

## app.onegodian.com
Public/member OneGodian App surface.

## console.onegodian.com
Internal OneGodian Console surface with privileged controls.

## Enforcement
- Host-aware route allowlists in `src/middleware.ts`
- Member surface and operator surface have different navigation labels
- Console responses include noindex headers
- Console route rewrites to `/admin/*` internal structure
