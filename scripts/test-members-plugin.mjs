import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const entryPath = path.join(root, 'onegodian-members', 'onegodian-members.php');
const productionPath = path.join(root, 'onegodian-members', 'includes', 'class-onegodian-members-production-experience.php');
const cssPath = path.join(root, 'onegodian-members', 'assets', 'css', 'onegodian-members-production.css');

for (const file of [entryPath, productionPath, cssPath]) {
  if (!fs.existsSync(file)) throw new Error(`Required OneGodian Members file missing: ${file}`);
}

const entry = fs.readFileSync(entryPath, 'utf8');
const production = fs.readFileSync(productionPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requiredEntryTokens = [
  'Plugin Name: OneGodian Members & Community',
  "define('OGM_VERSION', '1.9.0')",
  'class-onegodian-members-production-experience.php',
  'register_activation_hook'
];

const requiredShortcodes = [
  'onegodian_membership_hub',
  'onegodian_login',
  'onegodian_my_account',
  'onegodian_member_dashboard_shell',
  'onegodian_member_navigation',
  'onegodian_member_profile',
  'onegodian_profile_completion',
  'onegodian_community_hub',
  'onegodian_members_directory',
  'onegodian_groups',
  'onegodian_activity',
  'onegodian_messages',
  'onegodian_notifications',
  'onegodian_members_status'
];

const requiredRoutes = [
  "'/health'",
  "'/manifest'",
  "'/me'",
  "'/admin/summary'",
  "'/sync/status'"
];

const requiredIntegrationTokens = [
  'bp_core_new_nav_item',
  'woocommerce_account_menu_items',
  'woocommerce_account_onegodian-dashboard_endpoint',
  'X-OneGodian-Members-Key',
  'MANAGED_MARKER',
  'preserved-unmanaged',
  'wp_generate_password(48',
  'register_widget'
];

const requiredCssTokens = [
  '.ogm-pro',
  '.ogm-pro-grid',
  '.ogm-pro-profile',
  '.ogm-pro-nav',
  '.ogm-pro-progress',
  '@media(prefers-reduced-motion:reduce)'
];

function assertTokens(source, tokens, label) {
  const missing = tokens.filter((token) => !source.includes(token));
  if (missing.length) {
    throw new Error(`${label} missing required contract tokens: ${missing.join(', ')}`);
  }
}

assertTokens(entry, requiredEntryTokens, 'Plugin entrypoint');
assertTokens(production, requiredShortcodes, 'Production shortcodes');
assertTokens(production, requiredRoutes, 'REST routes');
assertTokens(production, requiredIntegrationTokens, 'Integration layer');
assertTokens(css, requiredCssTokens, 'Production UI CSS');

console.log(`OneGodian Members production contract passed: ${requiredShortcodes.length} shortcodes, ${requiredRoutes.length} REST routes, WooCommerce/BuddyPress/page-sync/app-bridge checks present.`);
