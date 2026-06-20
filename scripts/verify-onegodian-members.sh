#!/usr/bin/env bash
set -euo pipefail

PLUGIN_SLUG="onegodian-members"
PLUGIN_DIR="plugins/${PLUGIN_SLUG}"
MAIN_FILE="$PLUGIN_DIR/onegodian-members.php"
OUTPUT_ZIP="onegodian-members-v1.7.1-woocommerce-sync.zip"
REQUIRED_SHORTCODES=(
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

grep -q "Plugin Name: OneGodian Members" "$MAIN_FILE" || fail "Plugin Name header missing or incorrect"
grep -q "Version: 1.7.1" "$MAIN_FILE" || fail "Plugin header version is not 1.7.1"
if ! grep -Eq "(OGM_VERSION|const VERSION)[[:space:]=']+.*1\.7\.1" "$MAIN_FILE"; then
  fail "Runtime version constant/equivalent is not 1.7.1"
fi

if command -v php >/dev/null 2>&1; then
  find "$PLUGIN_DIR" -type f -name '*.php' -print0 | xargs -0 -n 1 php -l >/dev/null
  echo "PHP syntax check passed."
else
  echo "php not available; skipping PHP syntax check."
fi

if grep -R "Stripe is not configured" "$PLUGIN_DIR" >/dev/null 2>&1; then
  fail "Public Stripe not-configured error still exists"
fi

for shortcode in "${REQUIRED_SHORTCODES[@]}"; do
  grep -R "$shortcode" "$PLUGIN_DIR" >/dev/null 2>&1 || fail "Missing shortcode: $shortcode"
done

for key in "${REQUIRED_PRODUCT_KEYS[@]}"; do
  grep -R "$key" "$PLUGIN_DIR" >/dev/null 2>&1 || fail "Missing WooCommerce product mapping key: $key"
done

grep -R "add-to-cart" "$PLUGIN_DIR" >/dev/null 2>&1 || fail "WooCommerce add-to-cart routing not found"
grep -R "Payments are handled through WooCommerce checkout" "$PLUGIN_DIR" >/dev/null 2>&1 || fail "WooCommerce admin notice not found"

if [ -f "$OUTPUT_ZIP" ]; then
  unzip -t "$OUTPUT_ZIP" >/dev/null
  TOP_LEVELS="$(zipinfo -1 "$OUTPUT_ZIP" | awk -F/ 'NF {print $1}' | sort -u)"
  [ "$TOP_LEVELS" = "$PLUGIN_SLUG" ] || fail "ZIP must contain exactly one top-level folder: $PLUGIN_SLUG/; found: $TOP_LEVELS"
  zipinfo -1 "$OUTPUT_ZIP" | grep -q "^${PLUGIN_SLUG}/onegodian-members.php$" || fail "ZIP missing main plugin file"
  echo "ZIP verification passed: $OUTPUT_ZIP"
else
  echo "ZIP not found yet; source verification passed."
fi

echo "OneGodian Members verification passed."
