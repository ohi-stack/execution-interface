# OHICloud v1.1 WordPress Build Notes

## Repository Layout
- `wp-content/themes/ohicloud-v1-1`: Minimal theme shell (navigation, spacing, typography, footer grid).
- `wp-content/plugins/ohicloud-core`: Core plugin for menu seeding and VC snippet storage.
- `docs/ohicloud-pages.wxr.xml`: WXR file containing all required pages and hierarchy.
- `docs/vc-layouts.md`: Copy/paste WPBakery layouts, including canonical unlocked hero.
- `assets/diagrams`: Diagram placeholder naming convention and drop-zone.

## Install Steps
1. Copy theme and plugin folders into your WordPress site `wp-content`.
2. Activate **OHICloud v1.1** theme.
3. Activate **OHICloud Core** plugin.
4. Import `docs/ohicloud-pages.wxr.xml` via **Tools → Import → WordPress**.
5. Set homepage:
   - **Settings → Reading → A static page → Home**.
6. Seed menus:
   - **Tools → OHICloud Menus → Create/Refresh Mega + Footer Menus**.
7. Assign/review menus in **Appearance → Menus** if you want deeper mega-menu nesting by business unit.
8. Paste blocks from `docs/vc-layouts.md` into WPBakery backend editor per page.

## Notes
- No premium plugin is required beyond WPBakery itself.
- No ACF dependency; snippets are shipped as plugin constants + shortcode fallback.
- If any custom shortcode (e.g., `la_btn`) is unavailable, use native `[vc_btn]` replacement from provided blocks.
