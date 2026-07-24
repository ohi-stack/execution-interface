#!/usr/bin/env bash
set -euo pipefail

PLUGIN_SLUG="onegodian-members"
PLUGIN_DIR="${PLUGIN_SLUG}"
MAIN_FILE="$PLUGIN_DIR/onegodian-members.php"
OUTPUT_ZIP="onegodian-members-v1.8.0-ino-platform.zip"
REQUIRED_SHORTCODES=(
  ino_platform_overview
  ino_public_portal
  ino_identity_heritage
  ino_programs_portal
  ino_volunteer_portal
  ino_housing_portal
  ino_treasury_grants
  ino_learning_center
  ino_document_center
  ino_communications
  ino_media_center
  ino_interactive_maps
  ino_admin_portal
  ino_security_compliance
  ino_reporting_analytics
  ino_certificate_verify
  onegodian_membership_cta
  onegodian_members_pricing
  onegodian_membership_resources
  onegodian_member_certificates
  onegodian_member_dashboard
  onegodian_member_support
  onegodian_contributors_page
  onegodian_contributor_tiers
  onegodian_creator_network
  onegodian_affiliate_dashboard
  onegodian_referral_link
  onegodian_contributor_wall
  onegodian_contributor_disclaimer
)
REQUIRED_PRODUCT_KEYS=(
  woo_basic_member_product_id
  woo_premium_member_product_id
  woo_contributor_product_id
  woo_creator_application_product_id
  woo_affiliate_application_product_id
)

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

[ -d "$PLUGIN_DIR" ] || fail "Plugin directory missing: $PLUGIN_DIR"
[ -f "$MAIN_FILE" ] || fail "Main plugin file missing: $MAIN_FILE"

grep -Eq "Plugin Name: (INO Platform|OneGodian Members)" "$MAIN_FILE" || fail "Plugin Name header missing or incorrect"
grep -q "Version: 1.8.0" "$MAIN_FILE" || fail "Plugin header version is not 1.8.0"
if ! grep -Eq "(OGM_VERSION|const VERSION)[[:space:]=']+.*1\.8\.0" "$MAIN_FILE"; then
  fail "Runtime version constant/equivalent is not 1.8.0"
fi

if command -v php >/dev/null 2>&1; then
  find "$PLUGIN_DIR" -type f -name '*.php' -print0 | xargs -0 -n 1 php -l >/dev/null
  echo "PHP syntax check passed."
else
  echo "php not available; skipping PHP syntax check."
fi

if rg -q "Stripe is not configured" "$PLUGIN_DIR"; then
  fail "Public Stripe not-configured error still exists"
fi

for shortcode in "${REQUIRED_SHORTCODES[@]}"; do
  rg -q "$shortcode" "$PLUGIN_DIR" || fail "Missing shortcode: $shortcode"
done

for key in "${REQUIRED_PRODUCT_KEYS[@]}"; do
  rg -q "$key" "$PLUGIN_DIR" || fail "Missing WooCommerce product mapping key: $key"
done

rg -q "add-to-cart" "$PLUGIN_DIR" || fail "WooCommerce add-to-cart routing not found"
rg -q "Payments are handled through WooCommerce checkout" "$PLUGIN_DIR" || fail "WooCommerce admin notice not found"

if [ -f "$OUTPUT_ZIP" ]; then
  unzip -t "$OUTPUT_ZIP" >/dev/null
  TOP_LEVELS="$(zipinfo -1 "$OUTPUT_ZIP" | awk -F/ 'NF {print $1}' | sort -u)"
  [ "$TOP_LEVELS" = "$PLUGIN_SLUG" ] || fail "ZIP must contain exactly one top-level folder: $PLUGIN_SLUG/; found: $TOP_LEVELS"
  zipinfo -1 "$OUTPUT_ZIP" | grep -q "^${PLUGIN_SLUG}/onegodian-members.php$" || fail "ZIP missing main plugin file"
  echo "ZIP verification passed: $OUTPUT_ZIP"
else
  echo "ZIP not found yet; source verification passed."
fi

echo "INO Platform verification passed."
