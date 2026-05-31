<?php
/**
 * Plugin Name: Algonquian ARE Marketplace
 * Description: Wholesale deals, investor access, deal syndication, buyer subscriptions, and premium listings.
 * Version: 1.0.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-are-marketplace
 */

if (!defined('ABSPATH')) { exit; }

final class ALGQ_ARE_Marketplace
{
    private const LISTINGS = 'algq_marketplace_listings';
    private const ACCESS = 'algq_investor_access';
    private const SYNDICATION = 'algq_deal_syndication';
    private const PREMIUM = 'algq_premium_listings';

    public function __construct()
    {
        add_shortcode('algq_are_marketplace', [$this, 'shortcode']);
        add_action('admin_menu', [$this, 'admin_page']);
        add_action('rest_api_init', [$this, 'routes']);
    }

    public static function activate(): void
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();
        dbDelta('CREATE TABLE ' . self::table(self::LISTINGS) . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, deal_id varchar(64) NOT NULL, title varchar(191) NOT NULL, market varchar(120) DEFAULT '', asking_price decimal(14,2) DEFAULT 0, listing_status varchar(64) DEFAULT 'draft', is_premium tinyint(1) DEFAULT 0, access_tier varchar(64) DEFAULT 'Buyer', package_url text NULL, published_at datetime NULL, created_at datetime NOT NULL, updated_at datetime NOT NULL, PRIMARY KEY  (id), KEY deal_id (deal_id), KEY listing_status (listing_status), KEY is_premium (is_premium), KEY access_tier (access_tier)) {$charset};");
        dbDelta('CREATE TABLE ' . self::table(self::ACCESS) . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, user_id bigint(20) unsigned NOT NULL, subscription_tier varchar(64) DEFAULT 'Buyer', access_status varchar(40) DEFAULT 'active', expires_at datetime NULL, created_at datetime NOT NULL, PRIMARY KEY  (id), KEY user_id (user_id), KEY subscription_tier (subscription_tier), KEY access_status (access_status)) {$charset};");
        dbDelta('CREATE TABLE ' . self::table(self::SYNDICATION) . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, listing_id bigint(20) unsigned NOT NULL, channel varchar(80) NOT NULL, syndicated_url text NULL, syndication_status varchar(40) DEFAULT 'queued', created_at datetime NOT NULL, updated_at datetime NOT NULL, PRIMARY KEY  (id), KEY listing_id (listing_id), KEY channel (channel), KEY syndication_status (syndication_status)) {$charset};");
        dbDelta('CREATE TABLE ' . self::table(self::PREMIUM) . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, listing_id bigint(20) unsigned NOT NULL, placement varchar(80) DEFAULT 'featured', starts_at datetime NOT NULL, ends_at datetime NULL, created_at datetime NOT NULL, PRIMARY KEY  (id), KEY listing_id (listing_id), KEY placement (placement)) {$charset};");
    }

    public function admin_page(): void { add_menu_page(__('ARE Marketplace', 'algq-are-marketplace'), __('ARE Marketplace', 'algq-are-marketplace'), 'edit_posts', 'algq-are-marketplace', [$this, 'admin_render'], 'dashicons-store', 36); }
    public function routes(): void { register_rest_route('algq/v1', '/marketplace/listings', ['methods' => 'GET', 'callback' => fn () => rest_ensure_response($this->listings()), 'permission_callback' => fn () => is_user_logged_in()]); }
    public function admin_render(): void { echo '<div class="wrap">' . $this->shortcode() . '</div>'; }

    public function shortcode(): string
    {
        $listings = $this->listings();
        ob_start(); ?><div class="algq-are-marketplace"><h2><?php esc_html_e('ARE Marketplace', 'algq-are-marketplace'); ?></h2><p><?php esc_html_e('Wholesale deals, investor access, syndication, subscriptions, and premium listings.', 'algq-are-marketplace'); ?></p><ul><?php foreach ($listings as $listing) : ?><li><strong><?php echo esc_html($listing['title']); ?></strong> — <?php echo esc_html($listing['market']); ?> <?php echo !empty($listing['is_premium']) ? '<span>Premium</span>' : ''; ?></li><?php endforeach; ?></ul></div><?php return (string) ob_get_clean();
    }

    private function listings(): array { global $wpdb; return $wpdb->get_results('SELECT * FROM ' . self::table(self::LISTINGS) . " WHERE listing_status IN ('published','active') ORDER BY is_premium DESC, published_at DESC LIMIT 100", ARRAY_A) ?: []; }
    private static function table(string $table): string { global $wpdb; return $wpdb->prefix . $table; }
}
register_activation_hook(__FILE__, ['ALGQ_ARE_Marketplace', 'activate']);
new ALGQ_ARE_Marketplace();
