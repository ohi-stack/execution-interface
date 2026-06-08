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
