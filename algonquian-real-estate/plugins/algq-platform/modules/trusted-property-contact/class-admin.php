<?php
if (!defined('ABSPATH')) { exit; }
final class ALGQ_TPC_Admin {
    public static function register() { add_action('admin_menu', array(__CLASS__, 'menu')); }
    public static function menu() { add_menu_page(__('Property Stewardship', 'algq-platform'), __('Property Stewardship', 'algq-platform'), 'algq_view_stewardship_clients', 'algq-property-stewardship', array(__CLASS__, 'page'), 'dashicons-admin-home', 27); }
    public static function metrics() {
        global $wpdb; $today = current_time('mysql');
        $queries = array(
            __('Active clients', 'algq-platform') => "SELECT COUNT(*) FROM " . ALGQ_TPC_Database::table('stewardship_clients') . " WHERE status='active'",
            __('Properties requiring visits', 'algq-platform') => $wpdb->prepare('SELECT COUNT(DISTINCT property_id) FROM ' . ALGQ_TPC_Database::table('property_visits') . ' WHERE status IN (%s,%s)', 'scheduled', 'overdue'),
            __('Overdue visits', 'algq-platform') => $wpdb->prepare('SELECT COUNT(*) FROM ' . ALGQ_TPC_Database::table('property_visits') . ' WHERE status IN (%s,%s) AND scheduled_at < %s', 'scheduled', 'overdue', $today),
            __('Open maintenance', 'algq-platform') => $wpdb->prepare('SELECT COUNT(*) FROM ' . ALGQ_TPC_Database::table('service_requests') . ' WHERE status NOT IN (%s,%s)', 'completed', 'canceled'),
            __('Pending approvals', 'algq-platform') => $wpdb->prepare('SELECT COUNT(*) FROM ' . ALGQ_TPC_Database::table('service_requests') . ' WHERE owner_authorization_status=%s', 'pending'),
            __('Active emergencies', 'algq-platform') => $wpdb->prepare('SELECT COUNT(*) FROM ' . ALGQ_TPC_Database::table('incidents') . ' WHERE status=%s', 'active'),
            __('Vendor appointments', 'algq-platform') => $wpdb->prepare('SELECT COUNT(*) FROM ' . ALGQ_TPC_Database::table('vendor_assignments') . ' WHERE scheduled_at >= %s AND status=%s', $today, 'scheduled'),
            __('Expiring authorizations', 'algq-platform') => $wpdb->prepare('SELECT COUNT(*) FROM ' . ALGQ_TPC_Database::table('stewardship_authorizations') . ' WHERE status=%s AND expires_at BETWEEN %s AND DATE_ADD(%s, INTERVAL 30 DAY)', 'active', $today, $today),
            __('Unread messages', 'algq-platform') => 'SELECT COUNT(*) FROM ' . ALGQ_TPC_Database::table('client_messages') . ' WHERE read_at IS NULL',
        );
        $result = array(); foreach ($queries as $label => $query) { $result[$label] = (int) $wpdb->get_var($query); } return $result;
    }
    public static function dashboard() {
        $html = '<div class="algq-stewardship-grid">'; foreach (self::metrics() as $label => $value) { $html .= '<section class="algq-stewardship-card"><strong>' . esc_html((string) $value) . '</strong><span>' . esc_html($label) . '</span></section>'; }
        return $html . '</div><p class="algq-stewardship-disclaimer">' . esc_html(ALGQ_TPC_Authorization_Service::disclaimer()) . '</p>';
    }
    public static function page() { if (!current_user_can('algq_view_stewardship_clients')) { wp_die(esc_html__('Access denied.', 'algq-platform')); } echo '<div class="wrap"><h1>' . esc_html__('Property Stewardship', 'algq-platform') . '</h1>' . wp_kses_post(self::dashboard()) . '</div>'; }
}
