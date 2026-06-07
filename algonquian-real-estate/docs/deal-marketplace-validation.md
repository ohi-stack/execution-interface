# Algonquian Deal Marketplace 1.0.1 Validation

This document records the production validation scope for the `algq-marketplace` WordPress plugin package.

## Required validation checklist

- Run `php -l` against every PHP file in `algonquian-real-estate` before packaging.
- Run the plugin PHPUnit smoke suite when a PHPUnit binary or WordPress test suite is available.
- Activate `algq-marketplace/algq-marketplace.php` in WordPress with Algonquian Core active.
- Confirm activation provisions the generated `deal-marketplace` page with `[algq_marketplace]` content.
- Confirm both `[algq_marketplace]` and `[algq_deal_marketplace]` render marketplace cards, the NDA gate notice, and buyer interest forms.
- Confirm the admin menu appears as **Deal Marketplace** for users with `algq_manage_deal_marketplace` or `manage_options`.
- Submit buyer interest from the marketplace form and verify a row is written to the interest table when WordPress database access is available.
- Verify the NDA gate copy is shown before restricted diligence materials are exposed.
- Use the admin **Clear marketplace cache** action and confirm the success notice appears.
- Deactivate optional ARE suite plugins and confirm Deal Marketplace renders an informational notice rather than a fatal error.
- Uninstall with cleanup disabled and confirm marketplace data, generated pages, and options remain intact.
- Enable `cleanup_on_uninstall`, uninstall again in a disposable environment, and confirm tables, generated page, and plugin options are removed.

## Text UI asset validation

- Confirm `assets/css/deal-marketplace.css` and `assets/js/deal-marketplace.js` enqueue with the public shortcode.
- Confirm `assets/css/deal-marketplace-admin.css` and `assets/js/deal-marketplace-admin.js` enqueue on the Deal Marketplace admin screen.
- Confirm public markup includes the branded hero, buyer summary cards, premium/locked states, NDA badges, and buyer interest form styling hooks.
- Confirm admin markup includes executive cards, health/cache panels, integration status cards, settings panels, shortcode copy controls, and the buyer interest / NDA status table.
- Confirm responsive breakpoints keep cards, forms, and tables usable on mobile widths.

## Package artifact

The production package for this release is generated locally and intentionally not committed, so binary ZIP artifacts do not block branch pushes:

```bash
cd algonquian-real-estate/plugins
zip -rq ../algq-deal-marketplace-1.0.1-production.zip algq-marketplace -x '*/.DS_Store' '*/node_modules/*' '*/vendor/*' '*/.git/*'
unzip -t ../algq-deal-marketplace-1.0.1-production.zip
```

The archive should contain only the plugin runtime, assets, README, tests, and uninstall routine rooted under `algq-marketplace/`.
