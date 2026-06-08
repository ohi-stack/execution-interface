<?php
/**
 * Plugin Name: Algonquian Deal Marketplace
 * Plugin URI: https://algonquianrealestate.com/
 * Description: Production-hardened buyer-facing deal marketplace with NDA gates, buyer interest workflows, audit logging, and institutional real estate admin controls.
 * Version: 1.0.0
 * Author: Algonquian Real Estate
 * Author URI: https://algonquianrealestate.com/
 * Text Domain: algq-marketplace
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Description: Enterprise marketplace foundations for wholesale deals, investor access, syndication, buyer subscriptions, and premium listings.
 * Description: Enterprise marketplace foundations for wholesale deals, investor access, syndication, buyer subscriptions, premium listings, NDA gating, and buyer interest capture.
 * Version: 1.0.1
 * Author: Algonquian Real Estate
 * Requires at least: 6.2
 * Requires PHP: 7.4
 * Requires Plugins: algq-core
 * Text Domain: algq-deal-marketplace
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

define('ALGQ_MARKETPLACE_VERSION', '1.0.0');
define('ALGQ_MARKETPLACE_FILE', __FILE__);
define('ALGQ_MARKETPLACE_PATH', plugin_dir_path(__FILE__));
define('ALGQ_MARKETPLACE_URL', plugin_dir_url(__FILE__));
define('ALGQ_MARKETPLACE_BASENAME', plugin_basename(__FILE__));
define('ALGQ_MARKETPLACE_TEXT_DOMAIN', 'algq-marketplace');
define('ALGQ_MARKETPLACE_OPTION_SETTINGS', 'algq_marketplace_settings');
define('ALGQ_MARKETPLACE_OPTION_PAGES', 'algq_marketplace_generated_pages');
define('ALGQ_MARKETPLACE_OPTION_DB_VERSION', 'algq_marketplace_db_version');
define('ALGQ_MARKETPLACE_OPTION_CLEANUP', 'algq_marketplace_cleanup_settings');

/**
 * Safely load a plugin include without fataling when an optional file is absent.
 */
function algq_marketplace_safe_require(string $relative_path, bool $required = true): bool
{
    $file = ALGQ_MARKETPLACE_PATH . ltrim($relative_path, '/');

    if (!is_readable($file)) {
        if ($required && is_admin()) {
            add_action('admin_notices', static function () use ($relative_path): void {
                printf(
                    '<div class="notice notice-error"><p>%s</p></div>',
                    esc_html(sprintf(__('Algonquian Deal Marketplace could not load required file: %s', 'algq-marketplace'), $relative_path))
                );
            });
        }

        return false;
    }

    require_once $file;
    return true;
}

algq_marketplace_safe_require('includes/helpers.php');
algq_marketplace_safe_require('includes/class-algq-marketplace-roles.php');
algq_marketplace_safe_require('includes/class-algq-marketplace-db.php');
algq_marketplace_safe_require('includes/class-algq-marketplace-pages.php');
algq_marketplace_safe_require('includes/class-algq-marketplace-activator.php');
algq_marketplace_safe_require('includes/class-algq-marketplace-shortcodes.php');
algq_marketplace_safe_require('includes/class-algq-marketplace-admin.php');
algq_marketplace_safe_require('includes/class-algq-marketplace-plugin.php');

if (class_exists('ALGQ_Marketplace_Activator')) {
    register_activation_hook(__FILE__, ['ALGQ_Marketplace_Activator', 'activate']);
    register_deactivation_hook(__FILE__, ['ALGQ_Marketplace_Activator', 'deactivate']);
}

add_action('plugins_loaded', static function (): void {
    load_plugin_textdomain('algq-marketplace', false, dirname(ALGQ_MARKETPLACE_BASENAME) . '/languages');

    if (!class_exists('ALGQ_Marketplace_Plugin')) {
        return;
    }

    ALGQ_Marketplace_Plugin::instance()->init();
});
if (!defined('ALGQ_DEAL_MARKETPLACE_VERSION')) {
    define('ALGQ_DEAL_MARKETPLACE_VERSION', '1.0.1');
}

if (!defined('ALGQ_DEAL_MARKETPLACE_FILE')) {
    define('ALGQ_DEAL_MARKETPLACE_FILE', __FILE__);
}

if (!defined('ALGQ_DEAL_MARKETPLACE_PATH')) {
    define('ALGQ_DEAL_MARKETPLACE_PATH', plugin_dir_path(__FILE__));
}

if (!defined('ALGQ_DEAL_MARKETPLACE_URL')) {
    define('ALGQ_DEAL_MARKETPLACE_URL', plugin_dir_url(__FILE__));
}

if (!defined('ALGQ_DEAL_MARKETPLACE_BASENAME')) {
    define('ALGQ_DEAL_MARKETPLACE_BASENAME', plugin_basename(__FILE__));
}

if (!defined('ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN')) {
    define('ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN', 'algq-deal-marketplace');
}

// Legacy constants retained for older marketplace integrations and tests.
defined('ALGQ_MARKETPLACE_VERSION') || define('ALGQ_MARKETPLACE_VERSION', ALGQ_DEAL_MARKETPLACE_VERSION);
defined('ALGQ_MARKETPLACE_FILE') || define('ALGQ_MARKETPLACE_FILE', __FILE__);
defined('ALGQ_MARKETPLACE_DIR') || define('ALGQ_MARKETPLACE_DIR', plugin_dir_path(__FILE__));
defined('ALGQ_MARKETPLACE_URL') || define('ALGQ_MARKETPLACE_URL', plugin_dir_url(__FILE__));

/**
 * Safely require a marketplace plugin file if it exists.
 */
function algq_deal_marketplace_require_file(string $relative_path): bool
{
    $file = ALGQ_DEAL_MARKETPLACE_PATH . ltrim($relative_path, '/');

    if (file_exists($file)) {
        require_once $file;
        return true;
    }

    return false;
}

$algq_deal_marketplace_files = [
    'includes/class-algq-deal-marketplace-capabilities.php',
    'includes/class-algq-deal-marketplace-security.php',
    'includes/class-algq-deal-marketplace-cache.php',
    'includes/class-algq-deal-marketplace-repository.php',
    'includes/class-algq-deal-marketplace-renderer.php',
    'includes/class-algq-deal-marketplace-pages.php',
    'includes/class-algq-deal-marketplace-shortcodes.php',
    'includes/class-algq-deal-marketplace-admin.php',
    'includes/class-algq-deal-marketplace-assets.php',
    'includes/class-algq-deal-marketplace-audit-log.php',
    'includes/class-algq-deal-marketplace-nda.php',
    'includes/class-algq-deal-marketplace-interest.php',
    'includes/class-algq-deal-marketplace-integrations.php',
    'includes/class-algq-deal-marketplace-activator.php',
    'includes/class-algq-deal-marketplace-deactivator.php',
    'includes/class-algq-deal-marketplace.php',
    'includes/class-algq-marketplace-sanitizer.php',
];

foreach ($algq_deal_marketplace_files as $algq_deal_marketplace_file) {
    algq_deal_marketplace_require_file($algq_deal_marketplace_file);
}

unset($algq_deal_marketplace_file, $algq_deal_marketplace_files);

if (class_exists('ALGQ_Deal_Marketplace_Activator')) {
    register_activation_hook(__FILE__, ['ALGQ_Deal_Marketplace_Activator', 'activate']);
}

if (class_exists('ALGQ_Deal_Marketplace_Deactivator')) {
    register_deactivation_hook(__FILE__, ['ALGQ_Deal_Marketplace_Deactivator', 'deactivate']);
}

/**
 * Backward-compatible module snapshot for legacy consumers.
 *
 * @return array<int, array{label: string, description: string, status: string}>
 */
function algq_marketplace_modules(): array
{
    if (!class_exists('ALGQ_Deal_Marketplace_Repository')) {
        return [];
    }

    $repository = new ALGQ_Deal_Marketplace_Repository();

    return array_map(
        static function (array $module): array {
            return [
                'label' => (string) ($module['label'] ?? $module['title'] ?? ''),
                'description' => (string) ($module['description'] ?? ''),
                'status' => (string) ($module['status'] ?? ''),
            ];
        },
        $repository->default_modules()
    );
}

/**
 * Boot the marketplace once WordPress and other plugins have loaded.
 */
function algq_deal_marketplace_bootstrap(): void
{
    if (!class_exists('ALGQ_Deal_Marketplace')) {
        return;
    }

    ALGQ_Deal_Marketplace::instance()->run();
}

add_action('plugins_loaded', 'algq_deal_marketplace_bootstrap', 20);

if (!function_exists('algq_marketplace_core_available')) {
    /**
     * Determine whether optional Algonquian core services are available.
     */
    function algq_marketplace_core_available(): bool
    {
        return function_exists('algq_core') || class_exists('ALGQ_Core_Plugin') || class_exists('ALGQ_Core');
    }
}

/**
 * Return page definitions generated by the marketplace activation workflow.
 *
 * @return array<int, array{slug: string, title: string, content: string, option_name: string}>
 */
function algq_marketplace_generated_pages(): array
{
    return class_exists('ALGQ_Deal_Marketplace_Pages') ? ALGQ_Deal_Marketplace_Pages::generated_pages() : [];
}

/**
 * Legacy plugin accessor now returns the production Deal Marketplace singleton.
 */
function algq_marketplace(): ?ALGQ_Deal_Marketplace
{
    return class_exists('ALGQ_Deal_Marketplace') ? ALGQ_Deal_Marketplace::instance() : null;
}

/**
 * Boot the marketplace once WordPress and other plugins have loaded.
 */
function algq_deal_marketplace_bootstrap(): void
{
    if (!class_exists('ALGQ_Deal_Marketplace')) {
        return;
    }

    ALGQ_Deal_Marketplace::instance()->run();
}

add_action('plugins_loaded', 'algq_deal_marketplace_bootstrap', 20);
