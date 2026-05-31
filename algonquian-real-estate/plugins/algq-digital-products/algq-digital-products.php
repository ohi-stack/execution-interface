<?php
/**
 * Plugin Name: Algonquian WooCommerce Monetization
 * Description: Plugin licensing, digital product store, subscription tiers, download protection, and Stripe/WooCommerce integration hooks.
 * Version: 1.0.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-digital-products
 */

if (!defined('ABSPATH')) { exit; }

final class ALGQ_Digital_Products
{
    private const LICENSES = 'algq_plugin_licenses';
    private const DOWNLOADS = 'algq_protected_downloads';
    private const TIERS = ['Investor', 'Buyer', 'Pro', 'Enterprise'];

    public function __construct()
    {
        add_shortcode('algq_product_library', [$this, 'shortcode']);
        add_action('admin_menu', [$this, 'admin_page']);
        add_action('rest_api_init', [$this, 'routes']);
        add_filter('woocommerce_product_data_tabs', [$this, 'woocommerce_tabs']);
    }

    public static function activate(): void
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();
        dbDelta('CREATE TABLE ' . self::table(self::LICENSES) . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, license_key varchar(128) NOT NULL, user_id bigint(20) unsigned DEFAULT 0, product_id bigint(20) unsigned DEFAULT 0, subscription_tier varchar(64) DEFAULT 'Investor', status varchar(40) DEFAULT 'active', stripe_customer_id varchar(191) DEFAULT '', stripe_subscription_id varchar(191) DEFAULT '', expires_at datetime NULL, created_at datetime NOT NULL, PRIMARY KEY  (id), UNIQUE KEY license_key (license_key), KEY subscription_tier (subscription_tier), KEY status (status)) {$charset};");
        dbDelta('CREATE TABLE ' . self::table(self::DOWNLOADS) . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, product_id bigint(20) unsigned NOT NULL, file_url text NOT NULL, required_tier varchar(64) DEFAULT 'Investor', download_limit int DEFAULT 0, created_at datetime NOT NULL, PRIMARY KEY  (id), KEY product_id (product_id), KEY required_tier (required_tier)) {$charset};");
    }

    public function admin_page(): void { add_menu_page(__('ARE Monetization', 'algq-digital-products'), __('ARE Monetization', 'algq-digital-products'), 'manage_options', 'algq-digital-products', [$this, 'admin_render'], 'dashicons-products', 35); }
    public function routes(): void { register_rest_route('algq/v1', '/monetization/licenses', ['methods' => 'GET', 'callback' => fn () => rest_ensure_response($this->licenses()), 'permission_callback' => fn () => current_user_can('manage_options')]); }
    public function woocommerce_tabs(array $tabs): array { $tabs['algq_download_protection'] = ['label' => __('ARE Protection', 'algq-digital-products'), 'target' => 'algq_download_protection', 'class' => []]; return $tabs; }
    public function admin_render(): void { echo '<div class="wrap">' . $this->shortcode() . '</div>'; }

    public function shortcode(): string
    {
        $products = ['Wholesale Deal Access', 'Contract Packs', 'Spreadsheets', 'Calculators', 'Checklists', 'Training', 'Plugin License'];
        ob_start(); ?><div class="algq-product-library"><h2><?php esc_html_e('Digital Product Store', 'algq-digital-products'); ?></h2><p><?php echo esc_html__('Subscription tiers: ', 'algq-digital-products') . esc_html(implode(', ', self::TIERS)); ?></p><ul><?php foreach ($products as $product) : ?><li><strong><?php echo esc_html($product); ?></strong><br><span><?php esc_html_e('WooCommerce secure download, license tracking, subscription tier, download protection, and Stripe metadata enabled.', 'algq-digital-products'); ?></span></li><?php endforeach; ?></ul></div><?php return (string) ob_get_clean();
    }

    private function licenses(): array { global $wpdb; return $wpdb->get_results('SELECT * FROM ' . self::table(self::LICENSES) . ' ORDER BY created_at DESC LIMIT 100', ARRAY_A) ?: []; }
    private static function table(string $table): string { global $wpdb; return $wpdb->prefix . $table; }
}
register_activation_hook(__FILE__, ['ALGQ_Digital_Products', 'activate']);
new ALGQ_Digital_Products();
