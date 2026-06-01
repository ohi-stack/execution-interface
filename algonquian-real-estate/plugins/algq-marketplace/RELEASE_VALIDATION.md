# Algonquian Deal Marketplace Release Validation

Use this checklist before packaging or deploying the production plugin. The PHPUnit suite is scaffolded in `tests/` and can run in lightweight shim mode or against a disposable WordPress test suite.

## Automated checks

- Run PHP syntax validation for every plugin PHP file:

  ```bash
  find algonquian-real-estate/plugins/algq-marketplace -name '*.php' -print0 | xargs -0 -n1 php -l
  ```

- Run PHPUnit smoke tests when PHPUnit is available:

  ```bash
  cd algonquian-real-estate/plugins/algq-marketplace
  phpunit -c phpunit.xml.dist
  ```

If PHPUnit is unavailable in the execution environment, record that the suite is scaffolded and complete PHP lint plus the manual WordPress smoke validation below before release packaging.

## Manual WordPress smoke validation

Validate on a disposable staging site, not production data:

1. Activate the plugin and confirm no fatal errors.
2. Confirm automatic marketplace page generation and that generated page IDs are stored.
3. Confirm `[algq_marketplace]` and `[algq_deal_marketplace]` render public marketplace markup.
4. Register and log in as a buyer/investor user.
5. Confirm marketplace listing cards display, including the branded public styling and responsive card polish.
6. Open a deal detail view and verify the NDA gate appears before restricted details.
7. Accept the NDA and confirm gated detail access is unlocked only for that buyer/listing combination.
8. Submit an interested-buyer form and confirm the interest record and audit log are created.
9. Open the admin dashboard and confirm branded admin styling, KPI cards, settings, and suite-status messaging render.
10. Trigger the cache clear action and confirm the success notice appears without errors.
11. Deactivate optional Algonquian suite plugins and confirm marketplace screens avoid fatal errors.
12. Uninstall with **Delete marketplace tables and generated options during uninstall** unchecked and confirm data is retained.
13. Only for disposable data, enable the uninstall deletion option and confirm uninstall removes marketplace tables and generated options.

## Release note

Uninstall is non-destructive by default. Destructive cleanup requires an administrator to explicitly enable the uninstall deletion setting before uninstalling the plugin.
