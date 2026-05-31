<?php
/**
 * Plugin Name: Algonquian Funding Tracker
 * Description: Lender database, capital commitments, funding status, deal-to-lender mapping, and relationship management.
 * Version: 1.0.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-funding-tracker
 */

if (!defined('ABSPATH')) { exit; }

final class ALGQ_Funding_Tracker
{
    private const LENDERS = 'algq_lenders';
    private const COMMITMENTS = 'algq_capital_commitments';
    private const MAP = 'algq_deal_lender_map';
    private const TOUCHES = 'algq_lender_relationships';
    private const STATUSES = ['sourcing', 'term_sheet', 'committed', 'funded', 'declined', 'closed'];

    public function __construct()
    {
        add_shortcode('algq_funding_tracker', [$this, 'shortcode']);
        add_action('admin_menu', [$this, 'admin_page']);
        add_action('rest_api_init', [$this, 'routes']);
    }

    public static function activate(): void
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();
        dbDelta('CREATE TABLE ' . self::table(self::LENDERS) . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, lender_name varchar(191) NOT NULL, lender_type varchar(80) DEFAULT 'private', contact_name varchar(191) DEFAULT '', email varchar(191) DEFAULT '', phone varchar(80) DEFAULT '', markets text NULL, min_loan decimal(14,2) DEFAULT 0, max_loan decimal(14,2) DEFAULT 0, relationship_status varchar(64) DEFAULT 'active', created_at datetime NOT NULL, updated_at datetime NOT NULL, PRIMARY KEY  (id), KEY lender_type (lender_type), KEY relationship_status (relationship_status)) {$charset};");
        dbDelta('CREATE TABLE ' . self::table(self::COMMITMENTS) . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, lender_id bigint(20) unsigned NOT NULL, commitment_amount decimal(14,2) NOT NULL DEFAULT 0, available_amount decimal(14,2) NOT NULL DEFAULT 0, terms text NULL, expires_at datetime NULL, status varchar(64) DEFAULT 'committed', created_at datetime NOT NULL, updated_at datetime NOT NULL, PRIMARY KEY  (id), KEY lender_id (lender_id), KEY status (status)) {$charset};");
        dbDelta('CREATE TABLE ' . self::table(self::MAP) . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, deal_id varchar(64) NOT NULL, lender_id bigint(20) unsigned NOT NULL, commitment_id bigint(20) unsigned DEFAULT 0, requested_amount decimal(14,2) DEFAULT 0, funded_amount decimal(14,2) DEFAULT 0, funding_status varchar(64) DEFAULT 'sourcing', target_close_date date NULL, updated_at datetime NOT NULL, PRIMARY KEY  (id), KEY deal_id (deal_id), KEY lender_id (lender_id), KEY funding_status (funding_status)) {$charset};");
        dbDelta('CREATE TABLE ' . self::table(self::TOUCHES) . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, lender_id bigint(20) unsigned NOT NULL, user_id bigint(20) unsigned DEFAULT 0, touch_type varchar(80) NOT NULL, notes text NULL, next_follow_up datetime NULL, created_at datetime NOT NULL, PRIMARY KEY  (id), KEY lender_id (lender_id), KEY next_follow_up (next_follow_up)) {$charset};");
    }

    public function admin_page(): void
    {
        add_menu_page(__('Funding Tracker', 'algq-funding-tracker'), __('Funding Tracker', 'algq-funding-tracker'), 'edit_posts', 'algq-funding-tracker', [$this, 'admin_render'], 'dashicons-money-alt', 30);
    }

    public function routes(): void
    {
        register_rest_route('algq/v1', '/funding/lenders', ['methods' => 'GET', 'callback' => fn () => rest_ensure_response($this->lenders()), 'permission_callback' => fn () => current_user_can('edit_posts')]);
        register_rest_route('algq/v1', '/funding/status', ['methods' => 'GET', 'callback' => fn () => rest_ensure_response($this->summary()), 'permission_callback' => fn () => current_user_can('edit_posts')]);
    }

    public function shortcode(): string
    {
        if (!current_user_can('edit_posts')) { return '<p>Funding tracker access restricted.</p>'; }
        $summary = $this->summary();
        ob_start(); ?>
        <div class="algq-funding-tracker"><h2><?php esc_html_e('Funding Tracker', 'algq-funding-tracker'); ?></h2><div class="algq-kpis">
            <span><?php echo esc_html(number_format((float) $summary['committed_capital'], 2)); ?> committed</span>
            <span><?php echo esc_html(number_format((float) $summary['available_capital'], 2)); ?> available</span>
            <span><?php echo esc_html((string) $summary['active_lenders']); ?> lenders</span>
            <span><?php echo esc_html((string) $summary['mapped_deals']); ?> mapped deals</span>
        </div></div>
        <?php return (string) ob_get_clean();
    }

    public function admin_render(): void { echo '<div class="wrap">' . $this->shortcode() . '</div>'; }

    private function lenders(): array
    {
        global $wpdb;
        return $wpdb->get_results('SELECT * FROM ' . self::table(self::LENDERS) . ' ORDER BY updated_at DESC LIMIT 200', ARRAY_A) ?: [];
    }

    private function summary(): array
    {
        global $wpdb;
        return [
            'active_lenders' => (int) $wpdb->get_var('SELECT COUNT(*) FROM ' . self::table(self::LENDERS) . " WHERE relationship_status = 'active'"),
            'committed_capital' => (float) $wpdb->get_var('SELECT COALESCE(SUM(commitment_amount),0) FROM ' . self::table(self::COMMITMENTS)),
            'available_capital' => (float) $wpdb->get_var('SELECT COALESCE(SUM(available_amount),0) FROM ' . self::table(self::COMMITMENTS) . " WHERE status = 'committed'"),
            'mapped_deals' => (int) $wpdb->get_var('SELECT COUNT(DISTINCT deal_id) FROM ' . self::table(self::MAP)),
            'statuses' => self::STATUSES,
        ];
    }

    private static function table(string $table): string { global $wpdb; return $wpdb->prefix . $table; }
}
register_activation_hook(__FILE__, ['ALGQ_Funding_Tracker', 'activate']);
new ALGQ_Funding_Tracker();
