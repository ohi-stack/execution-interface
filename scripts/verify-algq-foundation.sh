#!/usr/bin/env bash
set -euo pipefail

root="${1:-algonquian-real-estate/plugins}"
slugs=(algq-platform algq-pipeline-crm algq-deal-intake algq-mao-engine algq-document-library algq-offer-generator algq-pdf-signature algq-automation-engine algq-admin-command-center)

for slug in "${slugs[@]}"; do
  entry="$root/$slug/$slug.php"
  test -f "$entry"
  php -l "$entry" >/dev/null
  for header in 'Plugin Name:' 'Version:' 'Author URI:' 'Plugin URI:' 'Text Domain:' 'Requires at least:' 'Requires PHP:' 'License:'; do
    rg -q "\\* $header" "$entry"
  done
  rg -q "defined\('ABSPATH'\)" "$entry"
done

test "$(rg -l 'function algq_register_plugin' "$root/algq-platform" --glob '*.php' | wc -l)" -eq 1
test "$(rg -l 'interface ALGQ_Signature_Provider_Interface' "$root/algq-pdf-signature" --glob '*.php' | wc -l)" -eq 1
test "$(rg -l 'function algq_pipeline_create_deal' "$root/algq-pipeline-crm" --glob '*.php' | wc -l)" -eq 1

if rg -n 'wp_mail\(' "$root" --glob '*.php' | rg -v 'algq-platform/includes/class-algq-platform-core.php'; then
  echo 'Protected plugins must use algq_send_mail().' >&2
  exit 1
fi

echo "Verified ${#slugs[@]} protected foundation source packages."
