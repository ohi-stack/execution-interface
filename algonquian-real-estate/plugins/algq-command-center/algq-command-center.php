<?php
/**
 * Plugin Name: Algonquian Command Center
 * Description: KPI dashboard, pipeline value, deal counts, funding status, buyer activity, and reporting engine.
 * Version: 1.0.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-command-center
 */

if (!defined('ABSPATH')) { exit; }

final class ALGQ_Command_Center
{
    public function __construct()
    {
        add_shortcode('algq_command_center', [$this, 'shortcode']);
        add_action('wp_dashboard_setup', [$this, 'dashboard_widget']);
        add_action('admin_menu', [$this, 'admin_page']);
        add_action('rest_api_init', [$this, 'routes']);
    }

    public function dashboard_widget(): void { wp_add_dashboard_widget('algq_command_center', 'Algonquian Command Center', fn () => print $this->shortcode()); }
    public function admin_page(): void { add_menu_page(__('Command Center', 'algq-command-center'), __('Command Center', 'algq-command-center'), 'edit_posts', 'algq-command-center', [$this, 'admin_render'], 'dashicons-chart-area', 34); }
    public function routes(): void { register_rest_route('algq/v1', '/command-center/report', ['methods' => 'GET', 'callback' => fn () => rest_ensure_response($this->report()), 'permission_callback' => fn () => current_user_can('edit_posts')]); }
    public function admin_render(): void { echo '<div class="wrap">' . $this->shortcode() . '</div>'; }

    public function shortcode(): string
    {
        if (!current_user_can('edit_posts')) { return '<p>Command Center access restricted.</p>'; }
        $report = $this->report();
        ob_start(); ?><div class="algq-command-center"><h2><?php esc_html_e('Command Center', 'algq-command-center'); ?></h2><ul><?php foreach ($report as $label => $value) : ?><li><strong><?php echo esc_html(ucwords(str_replace('_', ' ', $label))); ?>:</strong> <span><?php echo esc_html((string) $value); ?></span></li><?php endforeach; ?></ul></div><?php return (string) ob_get_clean();
    }

    private function report(): array
    {
        global $wpdb;
        return [
            'deal_counts' => $this->count_table('algq_deals'),
            'pipeline_value' => $this->sum_table('algq_deals', 'asking_price'),
            'active_pipeline_items' => $this->count_table('algq_pipeline_deals'),
            'funding_status_items' => $this->count_table('algq_deal_lender_map'),
            'buyer_activity' => $this->count_table('algq_buyer_interest'),
            'document_count' => $this->count_table('algq_documents'),
            'report_generated_utc' => gmdate('Y-m-d H:i:s'),
        ];
    }

    private function count_table(string $table): int { global $wpdb; $name = $wpdb->prefix . $table; if (!$this->exists($name)) { return 0; } return (int) $wpdb->get_var('SELECT COUNT(*) FROM ' . $name); }
    private function sum_table(string $table, string $column): float { global $wpdb; $name = $wpdb->prefix . $table; if (!$this->exists($name)) { return 0.0; } return (float) $wpdb->get_var('SELECT COALESCE(SUM(' . esc_sql($column) . '),0) FROM ' . $name); }
    private function exists(string $table): bool { global $wpdb; return (bool) $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table)); }
}
new ALGQ_Command_Center();
