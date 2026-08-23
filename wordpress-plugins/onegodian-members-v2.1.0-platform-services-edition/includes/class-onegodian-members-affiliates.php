<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Production affiliate tracking, WooCommerce attribution, commissions, refunds,
 * payout workflow, fraud controls, and dashboard read-models.
 */
class OneGodian_Members_Affiliates {
    const SCHEMA_VERSION = '1.0.0';
    const COOKIE_NAME = 'ogm_affiliate_ref';
    const OPTION_KEY = 'onegodian_affiliate_settings';

    private $tables = array();

    public function __construct() {
        global $wpdb;
        $this->tables = array(
            'affiliates' => $wpdb->prefix . 'ogm_affiliates',
            'clicks' => $wpdb->prefix . 'ogm_affiliate_clicks',
            'commissions' => $wpdb->prefix . 'ogm_affiliate_commissions',
            'payouts' => $wpdb->prefix . 'ogm_affiliate_payouts',
            'audit' => $wpdb->prefix . 'ogm_affiliate_audit',
        );

        add_action('init', array($this, 'maybe_upgrade_schema'), 5);
        add_action('template_redirect', array($this, 'capture_referral'), 1);

        add_action('woocommerce_checkout_create_order', array($this, 'attach_referral_to_order'), 10, 2);
        add_action('woocommerce_order_status_processing', array($this, 'process_qualifying_order'));
        add_action('woocommerce_order_status_completed', array($this, 'process_qualifying_order'));
        add_action('woocommerce_order_status_cancelled', array($this, 'cancel_order_commission'));
        add_action('woocommerce_order_status_failed', array($this, 'cancel_order_commission'));
        add_action('woocommerce_order_refunded', array($this, 'handle_refund'), 10, 2);

        add_action('admin_menu', array($this, 'register_admin_pages'), 30);
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_post_ogm_affiliate_commission_action', array($this, 'handle_commission_action'));
        add_action('admin_post_ogm_affiliate_payout_action', array($this, 'handle_payout_action'));
        add_action('admin_post_ogm_affiliate_export', array($this, 'export_commissions_csv'));

        add_shortcode('onegodian_affiliate_dashboard', array($this, 'affiliate_dashboard_shortcode'));
        add_shortcode('onegodian_referral_link', array($this, 'referral_link_shortcode'));
    }

    public static function activate() {
        $instance = new self();
        $instance->install_schema();
        update_option('onegodian_affiliate_schema_version', self::SCHEMA_VERSION, false);
    }

    public function defaults() {
        return array(
            'enabled' => 1,
            'cookie_days' => 30,
            'default_commission_rate' => 15,
            'hold_days' => 14,
            'minimum_payout' => 25,
            'attribution_model' => 'last_valid_referral',
        );
    }

    public function settings() {
        return wp_parse_args((array) get_option(self::OPTION_KEY, array()), $this->defaults());
    }

    public function register_settings() {
        register_setting('onegodian_affiliate_settings', self::OPTION_KEY, array($this, 'sanitize_settings'));
    }

    public function sanitize_settings($input) {
        $input = (array) $input;
        return array(
            'enabled' => empty($input['enabled']) ? 0 : 1,
            'cookie_days' => max(1, min(365, absint($input['cookie_days'] ?? 30))),
            'default_commission_rate' => max(0, min(100, (float) ($input['default_commission_rate'] ?? 15))),
            'hold_days' => max(0, min(180, absint($input['hold_days'] ?? 14))),
            'minimum_payout' => max(0, (float) ($input['minimum_payout'] ?? 25)),
            'attribution_model' => 'last_valid_referral',
        );
    }

    public function maybe_upgrade_schema() {
        if (get_option('onegodian_affiliate_schema_version') !== self::SCHEMA_VERSION) {
            $this->install_schema();
            update_option('onegodian_affiliate_schema_version', self::SCHEMA_VERSION, false);
        }
    }

    public function install_schema() {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();

        dbDelta("CREATE TABLE {$this->tables['affiliates']} (
            id bigint unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint unsigned NOT NULL,
            referral_code varchar(80) NOT NULL,
            status varchar(20) NOT NULL DEFAULT 'active',
            commission_rate decimal(7,4) NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY referral_code (referral_code),
            UNIQUE KEY user_id (user_id),
            KEY status (status)
        ) $charset;");

        dbDelta("CREATE TABLE {$this->tables['clicks']} (
            id bigint unsigned NOT NULL AUTO_INCREMENT,
            affiliate_id bigint unsigned NOT NULL,
            referral_code varchar(80) NOT NULL,
            landing_url text NULL,
            source_url text NULL,
            utm_source varchar(190) NULL,
            utm_medium varchar(190) NULL,
            utm_campaign varchar(190) NULL,
            visitor_hash char(64) NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY affiliate_id (affiliate_id),
            KEY referral_code (referral_code),
            KEY created_at (created_at)
        ) $charset;");

        dbDelta("CREATE TABLE {$this->tables['commissions']} (
            id bigint unsigned NOT NULL AUTO_INCREMENT,
            affiliate_id bigint unsigned NOT NULL,
            user_id bigint unsigned NOT NULL,
            referral_code varchar(80) NOT NULL,
            order_id bigint unsigned NOT NULL,
            customer_user_id bigint unsigned NOT NULL DEFAULT 0,
            gross_eligible decimal(18,2) NOT NULL DEFAULT 0,
            commission_rate decimal(7,4) NOT NULL DEFAULT 0,
            commission_amount decimal(18,2) NOT NULL DEFAULT 0,
            refunded_amount decimal(18,2) NOT NULL DEFAULT 0,
            status varchar(20) NOT NULL DEFAULT 'pending',
            hold_until datetime NULL,
            payout_id bigint unsigned NULL,
            created_at datetime NOT NULL,
            approved_at datetime NULL,
            paid_at datetime NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY order_id (order_id),
            KEY affiliate_id (affiliate_id),
            KEY status (status),
            KEY payout_id (payout_id)
        ) $charset;");

        dbDelta("CREATE TABLE {$this->tables['payouts']} (
            id bigint unsigned NOT NULL AUTO_INCREMENT,
            affiliate_id bigint unsigned NOT NULL,
            amount decimal(18,2) NOT NULL DEFAULT 0,
            status varchar(20) NOT NULL DEFAULT 'draft',
            payment_reference varchar(190) NULL,
            note text NULL,
            created_at datetime NOT NULL,
            approved_at datetime NULL,
            paid_at datetime NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY affiliate_id (affiliate_id),
            KEY status (status)
        ) $charset;");

        dbDelta("CREATE TABLE {$this->tables['audit']} (
            id bigint unsigned NOT NULL AUTO_INCREMENT,
            actor_user_id bigint unsigned NOT NULL DEFAULT 0,
            event_key varchar(100) NOT NULL,
            object_type varchar(40) NOT NULL,
            object_id bigint unsigned NOT NULL DEFAULT 0,
            context longtext NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY event_key (event_key),
            KEY object_type (object_type),
            KEY object_id (object_id),
            KEY created_at (created_at)
        ) $charset;");
    }

    public function get_or_create_affiliate($user_id) {
        global $wpdb;
        $user_id = absint($user_id);
        if (!$user_id) {
            return null;
        }
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$this->tables['affiliates']} WHERE user_id=%d", $user_id));
        if ($row) {
            return $row;
        }
        $base = sanitize_title(get_userdata($user_id)->user_login ?? ('member-' . $user_id));
        $code = $base ?: ('member-' . $user_id);
        $exists = $wpdb->get_var($wpdb->prepare("SELECT id FROM {$this->tables['affiliates']} WHERE referral_code=%s", $code));
        if ($exists) {
            $code .= '-' . $user_id;
        }
        $now = current_time('mysql', true);
        $wpdb->insert($this->tables['affiliates'], array(
            'user_id' => $user_id,
            'referral_code' => $code,
            'status' => 'active',
            'created_at' => $now,
            'updated_at' => $now,
        ), array('%d','%s','%s','%s','%s'));
        return $wpdb->get_row($wpdb->prepare("SELECT * FROM {$this->tables['affiliates']} WHERE user_id=%d", $user_id));
    }

    public function capture_referral() {
        if (is_admin() || wp_doing_ajax()) {
            return;
        }
        $settings = $this->settings();
        if (empty($settings['enabled'])) {
            return;
        }
        $raw = isset($_GET['ref']) ? wp_unslash($_GET['ref']) : (isset($_GET['ogm_ref']) ? wp_unslash($_GET['ogm_ref']) : '');
        $code = sanitize_title($raw);
        if (!$code) {
            return;
        }
        global $wpdb;
        $affiliate = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$this->tables['affiliates']} WHERE referral_code=%s AND status='active'", $code));
        if (!$affiliate) {
            return;
        }
        if (is_user_logged_in() && (int) $affiliate->user_id === get_current_user_id()) {
            $this->audit('self_referral_blocked', 'affiliate', (int) $affiliate->id, array('code' => $code));
            return;
        }

        $fingerprint = hash('sha256', $this->client_ip() . '|' . (string) ($_SERVER['HTTP_USER_AGENT'] ?? '') . '|' . $code);
        $rate_key = 'ogm_ref_' . substr($fingerprint, 0, 32);
        if (get_transient($rate_key)) {
            return;
        }
        set_transient($rate_key, 1, HOUR_IN_SECONDS);

        $expires = time() + ((int) $settings['cookie_days'] * DAY_IN_SECONDS);
        $this->set_referral_cookie($code, $expires);
        $wpdb->insert($this->tables['clicks'], array(
            'affiliate_id' => (int) $affiliate->id,
            'referral_code' => $code,
            'landing_url' => esc_url_raw($this->current_url()),
            'source_url' => esc_url_raw(wp_get_referer()),
            'utm_source' => sanitize_text_field(wp_unslash($_GET['utm_source'] ?? '')),
            'utm_medium' => sanitize_text_field(wp_unslash($_GET['utm_medium'] ?? '')),
            'utm_campaign' => sanitize_text_field(wp_unslash($_GET['utm_campaign'] ?? '')),
            'visitor_hash' => $fingerprint,
            'created_at' => current_time('mysql', true),
        ));
        $this->audit('referral_click', 'affiliate', (int) $affiliate->id, array('code' => $code));
    }

    private function set_referral_cookie($code, $expires) {
        $secure = is_ssl();
        if (PHP_VERSION_ID >= 70300) {
            setcookie(self::COOKIE_NAME, $code, array(
                'expires' => $expires,
                'path' => COOKIEPATH ?: '/',
                'domain' => COOKIE_DOMAIN,
                'secure' => $secure,
                'httponly' => true,
                'samesite' => 'Lax',
            ));
        } else {
            setcookie(self::COOKIE_NAME, $code, $expires, (COOKIEPATH ?: '/') . '; samesite=Lax', COOKIE_DOMAIN, $secure, true);
        }
        $_COOKIE[self::COOKIE_NAME] = $code;
    }

    public function attach_referral_to_order($order, $data) {
        if (!is_object($order) || !method_exists($order, 'update_meta_data')) {
            return;
        }
        $code = sanitize_title(wp_unslash($_COOKIE[self::COOKIE_NAME] ?? ''));
        if (!$code) {
            return;
        }
        $affiliate = $this->affiliate_by_code($code);
        if (!$affiliate || !$this->passes_self_referral_check($affiliate, $order)) {
            return;
        }
        $order->update_meta_data('_ogm_affiliate_id', (int) $affiliate->id);
        $order->update_meta_data('_ogm_affiliate_user_id', (int) $affiliate->user_id);
        $order->update_meta_data('_ogm_affiliate_referral_code', $code);
        $order->update_meta_data('_ogm_attribution_model', 'last_valid_referral');
        $order->update_meta_data('_ogm_attributed_at', current_time('mysql', true));
    }

    public function process_qualifying_order($order_id) {
        if (!function_exists('wc_get_order')) {
            return;
        }
        global $wpdb;
        $order = wc_get_order($order_id);
        if (!$order) {
            return;
        }
        $existing = $wpdb->get_var($wpdb->prepare("SELECT id FROM {$this->tables['commissions']} WHERE order_id=%d", $order_id));
        if ($existing) {
            return;
        }
        $affiliate_id = absint($order->get_meta('_ogm_affiliate_id'));
        if (!$affiliate_id) {
            return;
        }
        $affiliate = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$this->tables['affiliates']} WHERE id=%d AND status='active'", $affiliate_id));
        if (!$affiliate || !$this->passes_self_referral_check($affiliate, $order)) {
            return;
        }
        $gross = max(0, (float) $order->get_total() - (float) $order->get_total_tax() - (float) $order->get_shipping_total());
        $rate = $this->commission_rate($affiliate, $order);
        $commission = round($gross * ($rate / 100), wc_get_price_decimals());
        $hold_until = gmdate('Y-m-d H:i:s', time() + ((int) $this->settings()['hold_days'] * DAY_IN_SECONDS));
        $now = current_time('mysql', true);
        $wpdb->insert($this->tables['commissions'], array(
            'affiliate_id' => (int) $affiliate->id,
            'user_id' => (int) $affiliate->user_id,
            'referral_code' => $affiliate->referral_code,
            'order_id' => (int) $order_id,
            'customer_user_id' => (int) $order->get_user_id(),
            'gross_eligible' => $gross,
            'commission_rate' => $rate,
            'commission_amount' => $commission,
            'refunded_amount' => 0,
            'status' => 'pending',
            'hold_until' => $hold_until,
            'created_at' => $now,
            'updated_at' => $now,
        ));
        if ($wpdb->insert_id) {
            $order->update_meta_data('_ogm_commission_id', (int) $wpdb->insert_id);
            $order->save_meta_data();
            $this->audit('commission_created', 'commission', (int) $wpdb->insert_id, array('order_id' => (int) $order_id, 'amount' => $commission));
        }
    }

    public function cancel_order_commission($order_id) {
        global $wpdb;
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$this->tables['commissions']} WHERE order_id=%d", absint($order_id)));
        if (!$row || in_array($row->status, array('paid','reversed','rejected'), true)) {
            return;
        }
        $wpdb->update($this->tables['commissions'], array('status' => 'rejected', 'updated_at' => current_time('mysql', true)), array('id' => (int) $row->id));
        $this->audit('commission_rejected_order_status', 'commission', (int) $row->id, array('order_id' => (int) $order_id));
    }

    public function handle_refund($order_id, $refund_id) {
        if (!function_exists('wc_get_order')) {
            return;
        }
        global $wpdb;
        $commission = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$this->tables['commissions']} WHERE order_id=%d", absint($order_id)));
        if (!$commission) {
            return;
        }
        $order = wc_get_order($order_id);
        if (!$order) {
            return;
        }
        $refunded = abs((float) $order->get_total_refunded());
        $gross = max(0.01, (float) $commission->gross_eligible);
        $ratio = min(1, $refunded / max(0.01, (float) $order->get_total()));
        $new_amount = round((float) $commission->commission_amount * (1 - $ratio), wc_get_price_decimals());
        $status = $new_amount <= 0 ? 'reversed' : ($commission->status === 'paid' ? 'paid' : 'pending');
        $wpdb->update($this->tables['commissions'], array(
            'commission_amount' => max(0, $new_amount),
            'refunded_amount' => $refunded,
            'status' => $status,
            'updated_at' => current_time('mysql', true),
        ), array('id' => (int) $commission->id));
        $this->audit('commission_refund_adjusted', 'commission', (int) $commission->id, array('order_id' => (int) $order_id, 'refund_id' => (int) $refund_id, 'new_amount' => $new_amount));
    }

    private function commission_rate($affiliate, $order) {
        $settings = $this->settings();
        $rate = $affiliate->commission_rate !== null ? (float) $affiliate->commission_rate : (float) $settings['default_commission_rate'];
        return max(0, min(100, (float) apply_filters('onegodian_affiliate_commission_rate', $rate, $affiliate, $order)));
    }

    private function passes_self_referral_check($affiliate, $order) {
        $affiliate_user_id = (int) $affiliate->user_id;
        if ($affiliate_user_id && method_exists($order, 'get_user_id') && $affiliate_user_id === (int) $order->get_user_id()) {
            $this->audit('self_referral_order_blocked', 'affiliate', (int) $affiliate->id, array('order_id' => (int) $order->get_id()));
            return false;
        }
        $affiliate_user = get_userdata($affiliate_user_id);
        $billing_email = method_exists($order, 'get_billing_email') ? sanitize_email($order->get_billing_email()) : '';
        if ($affiliate_user && $billing_email && strtolower($affiliate_user->user_email) === strtolower($billing_email)) {
            $this->audit('self_referral_email_blocked', 'affiliate', (int) $affiliate->id, array('order_id' => (int) $order->get_id()));
            return false;
        }
        return (bool) apply_filters('onegodian_affiliate_self_referral_check', true, $affiliate, $order);
    }

    private function affiliate_by_code($code) {
        global $wpdb;
        return $wpdb->get_row($wpdb->prepare("SELECT * FROM {$this->tables['affiliates']} WHERE referral_code=%s AND status='active'", sanitize_title($code)));
    }

    public function metrics_for_user($user_id) {
        global $wpdb;
        $affiliate = $this->get_or_create_affiliate($user_id);
        if (!$affiliate) {
            return array();
        }
        $clicks = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$this->tables['clicks']} WHERE affiliate_id=%d", $affiliate->id));
        $orders = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$this->tables['commissions']} WHERE affiliate_id=%d AND status NOT IN ('rejected','reversed')", $affiliate->id));
        $sums = $wpdb->get_results($wpdb->prepare("SELECT status,SUM(commission_amount) total FROM {$this->tables['commissions']} WHERE affiliate_id=%d GROUP BY status", $affiliate->id), OBJECT_K);
        $sum = function($status) use ($sums) { return isset($sums[$status]) ? (float) $sums[$status]->total : 0.0; };
        $paid = $sum('paid');
        $approved = $sum('approved');
        $pending = $sum('pending');
        $payouts = $wpdb->get_results($wpdb->prepare("SELECT id,amount,status,payment_reference,created_at,paid_at FROM {$this->tables['payouts']} WHERE affiliate_id=%d ORDER BY id DESC LIMIT 20", $affiliate->id), ARRAY_A);
        return array(
            'affiliate_id' => (int) $affiliate->id,
            'referral_code' => $affiliate->referral_code,
            'referral_url' => add_query_arg('ref', rawurlencode($affiliate->referral_code), home_url('/')),
            'clicks' => $clicks,
            'orders' => $orders,
            'conversion_rate' => $clicks > 0 ? round(($orders / $clicks) * 100, 2) : 0,
            'pending' => $pending,
            'approved' => $approved,
            'paid' => $paid,
            'payouts' => $payouts,
        );
    }

    public function affiliate_dashboard_shortcode() {
        if (!is_user_logged_in()) {
            return '<div class="ogm-affiliate-dashboard"><p>Please sign in to view your affiliate dashboard.</p></div>';
        }
        $m = $this->metrics_for_user(get_current_user_id());
        if (!$m) {
            return '<div class="ogm-affiliate-dashboard"><p>Affiliate profile is unavailable.</p></div>';
        }
        $cards = array(
            'Clicks' => $m['clicks'],
            'Orders' => $m['orders'],
            'Conversion Rate' => $m['conversion_rate'] . '%',
            'Pending Commission' => wc_price($m['pending']),
            'Approved Commission' => wc_price($m['approved']),
            'Paid Commission' => wc_price($m['paid']),
        );
        $html = '<section class="ogm-modern ogm-affiliate-dashboard"><div class="ogm-hero"><span class="ogm-status">Affiliate Program</span><h2>Affiliate Dashboard</h2><p>Referral performance and commission history from WooCommerce-attributed orders.</p></div><div class="ogm-grid">';
        $html .= '<article class="ogm-card"><span class="ogm-status">Referral Link</span><h3>Your referral URL</h3><div class="ogm-referral"><code>' . esc_html($m['referral_url']) . '</code></div></article>';
        foreach ($cards as $label => $value) {
            $html .= '<article class="ogm-card"><span class="ogm-status">Metric</span><h3>' . esc_html($label) . '</h3><p>' . wp_kses_post($value) . '</p></article>';
        }
        $html .= '<article class="ogm-card"><span class="ogm-status">Compliance</span><h3>Program Terms</h3><p>Affiliate compensation is ordinary referral and marketing compensation tied to qualifying commerce. No investment or guaranteed-return relationship is created.</p></article>';
        $html .= '</div><h3>Payout History</h3><div class="ogm-referral">';
        if (empty($m['payouts'])) {
            $html .= '<p>No payouts recorded yet.</p>';
        } else {
            foreach ($m['payouts'] as $payout) {
                $html .= '<p>#' . absint($payout['id']) . ' · ' . wp_kses_post(wc_price((float) $payout['amount'])) . ' · ' . esc_html($payout['status']) . '</p>';
            }
        }
        $html .= '</div></section>';
        return $html;
    }

    public function referral_link_shortcode() {
        if (!is_user_logged_in()) {
            return '<div class="ogm-modern"><p>Please sign in to access your referral link.</p></div>';
        }
        $m = $this->metrics_for_user(get_current_user_id());
        return '<div class="ogm-modern"><div class="ogm-hero"><span class="ogm-status">Referral</span><h2>Your Affiliate Link</h2></div><div class="ogm-referral"><code>' . esc_html($m['referral_url'] ?? '') . '</code></div></div>';
    }

    public function register_admin_pages() {
        if (!current_user_can('manage_options')) {
            return;
        }
        add_submenu_page('onegodian-members', 'Affiliate Program', 'Affiliates', 'manage_options', 'onegodian-affiliates', array($this, 'render_affiliates_admin'));
        add_submenu_page('onegodian-members', 'Affiliate Referrals', 'Referrals', 'manage_options', 'onegodian-affiliate-referrals', array($this, 'render_referrals_admin'));
        add_submenu_page('onegodian-members', 'Affiliate Commissions', 'Commissions', 'manage_options', 'onegodian-affiliate-commissions', array($this, 'render_commissions_admin'));
        add_submenu_page('onegodian-members', 'Affiliate Payouts', 'Payouts', 'manage_options', 'onegodian-affiliate-payouts', array($this, 'render_payouts_admin'));
        add_submenu_page('onegodian-members', 'Affiliate Settings', 'Affiliate Settings', 'manage_options', 'onegodian-affiliate-settings', array($this, 'render_settings_admin'));
    }

    public function render_affiliates_admin() {
        global $wpdb;
        $rows = $wpdb->get_results("SELECT a.*,u.user_login,u.user_email FROM {$this->tables['affiliates']} a LEFT JOIN {$wpdb->users} u ON u.ID=a.user_id ORDER BY a.id DESC LIMIT 200");
        echo '<div class="wrap"><h1>OneGodian Affiliates</h1><table class="widefat striped"><thead><tr><th>ID</th><th>User</th><th>Code</th><th>Status</th><th>Rate</th></tr></thead><tbody>';
        foreach ($rows as $row) {
            echo '<tr><td>' . absint($row->id) . '</td><td>' . esc_html($row->user_login ?: ('User #' . $row->user_id)) . '</td><td><code>' . esc_html($row->referral_code) . '</code></td><td>' . esc_html($row->status) . '</td><td>' . esc_html($row->commission_rate === null ? 'Default' : $row->commission_rate . '%') . '</td></tr>';
        }
        echo '</tbody></table></div>';
    }

    public function render_referrals_admin() {
        global $wpdb;
        $rows = $wpdb->get_results("SELECT * FROM {$this->tables['clicks']} ORDER BY id DESC LIMIT 300");
        echo '<div class="wrap"><h1>Affiliate Referrals</h1><table class="widefat striped"><thead><tr><th>ID</th><th>Affiliate</th><th>Code</th><th>Landing</th><th>UTM Campaign</th><th>Date</th></tr></thead><tbody>';
        foreach ($rows as $row) {
            echo '<tr><td>' . absint($row->id) . '</td><td>' . absint($row->affiliate_id) . '</td><td>' . esc_html($row->referral_code) . '</td><td>' . esc_html($row->landing_url) . '</td><td>' . esc_html($row->utm_campaign) . '</td><td>' . esc_html($row->created_at) . '</td></tr>';
        }
        echo '</tbody></table></div>';
    }

    public function render_commissions_admin() {
        global $wpdb;
        $rows = $wpdb->get_results("SELECT * FROM {$this->tables['commissions']} ORDER BY id DESC LIMIT 300");
        $export = wp_nonce_url(admin_url('admin-post.php?action=ogm_affiliate_export'), 'ogm_affiliate_export');
        echo '<div class="wrap"><h1>Affiliate Commissions</h1><p><a class="button" href="' . esc_url($export) . '">Export CSV</a></p><table class="widefat striped"><thead><tr><th>ID</th><th>Order</th><th>Affiliate</th><th>Gross</th><th>Rate</th><th>Commission</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
        foreach ($rows as $row) {
            $approve = wp_nonce_url(admin_url('admin-post.php?action=ogm_affiliate_commission_action&commission_id=' . absint($row->id) . '&do=approve'), 'ogm_commission_' . absint($row->id));
            $reject = wp_nonce_url(admin_url('admin-post.php?action=ogm_affiliate_commission_action&commission_id=' . absint($row->id) . '&do=reject'), 'ogm_commission_' . absint($row->id));
            echo '<tr><td>' . absint($row->id) . '</td><td>' . absint($row->order_id) . '</td><td>' . absint($row->affiliate_id) . '</td><td>' . esc_html($row->gross_eligible) . '</td><td>' . esc_html($row->commission_rate) . '%</td><td>' . esc_html($row->commission_amount) . '</td><td>' . esc_html($row->status) . '</td><td><a href="' . esc_url($approve) . '">Approve</a> | <a href="' . esc_url($reject) . '">Reject</a></td></tr>';
        }
        echo '</tbody></table></div>';
    }

    public function render_payouts_admin() {
        global $wpdb;
        $rows = $wpdb->get_results("SELECT * FROM {$this->tables['payouts']} ORDER BY id DESC LIMIT 300");
        echo '<div class="wrap"><h1>Affiliate Payouts</h1><p>Payout tracking only. This plugin does not automatically move funds.</p><table class="widefat striped"><thead><tr><th>ID</th><th>Affiliate</th><th>Amount</th><th>Status</th><th>Reference</th><th>Created</th></tr></thead><tbody>';
        foreach ($rows as $row) {
            echo '<tr><td>' . absint($row->id) . '</td><td>' . absint($row->affiliate_id) . '</td><td>' . esc_html($row->amount) . '</td><td>' . esc_html($row->status) . '</td><td>' . esc_html($row->payment_reference) . '</td><td>' . esc_html($row->created_at) . '</td></tr>';
        }
        echo '</tbody></table></div>';
    }

    public function render_settings_admin() {
        $s = $this->settings();
        echo '<div class="wrap"><h1>Affiliate Settings</h1><form method="post" action="options.php">';
        settings_fields('onegodian_affiliate_settings');
        echo '<table class="form-table"><tr><th>Enabled</th><td><input type="checkbox" name="' . esc_attr(self::OPTION_KEY) . '[enabled]" value="1" ' . checked($s['enabled'], 1, false) . ' /></td></tr>';
        foreach (array('cookie_days'=>'Cookie duration (days)','default_commission_rate'=>'Default commission %','hold_days'=>'Approval hold (days)','minimum_payout'=>'Minimum payout') as $key=>$label) {
            echo '<tr><th><label for="ogm_' . esc_attr($key) . '">' . esc_html($label) . '</label></th><td><input id="ogm_' . esc_attr($key) . '" type="number" step="0.01" name="' . esc_attr(self::OPTION_KEY) . '[' . esc_attr($key) . ']" value="' . esc_attr($s[$key]) . '" /></td></tr>';
        }
        echo '<tr><th>Attribution</th><td><strong>Last valid referral</strong> — the most recent valid first-party referral cookie before checkout wins.</td></tr></table>';
        submit_button();
        echo '</form></div>';
    }

    public function handle_commission_action() {
        if (!current_user_can('manage_options')) {
            wp_die('Forbidden');
        }
        global $wpdb;
        $id = absint($_GET['commission_id'] ?? 0);
        check_admin_referer('ogm_commission_' . $id);
        $action = sanitize_key($_GET['do'] ?? '');
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$this->tables['commissions']} WHERE id=%d", $id));
        if ($row && in_array($action, array('approve','reject'), true)) {
            $status = $action === 'approve' ? 'approved' : 'rejected';
            $data = array('status' => $status, 'updated_at' => current_time('mysql', true));
            if ($status === 'approved') {
                $data['approved_at'] = current_time('mysql', true);
            }
            $wpdb->update($this->tables['commissions'], $data, array('id' => $id));
            $this->audit('commission_' . $status, 'commission', $id, array());
        }
        wp_safe_redirect(admin_url('admin.php?page=onegodian-affiliate-commissions'));
        exit;
    }

    public function handle_payout_action() {
        if (!current_user_can('manage_options')) {
            wp_die('Forbidden');
        }
        $id = absint($_GET['payout_id'] ?? 0);
        check_admin_referer('ogm_payout_' . $id);
        $status = sanitize_key($_GET['do'] ?? '');
        if (!in_array($status, array('draft','approved','processing','paid','failed','cancelled'), true)) {
            wp_die('Invalid payout status');
        }
        global $wpdb;
        $data = array('status' => $status, 'updated_at' => current_time('mysql', true));
        if ($status === 'approved') {
            $data['approved_at'] = current_time('mysql', true);
        } elseif ($status === 'paid') {
            $data['paid_at'] = current_time('mysql', true);
        }
        $wpdb->update($this->tables['payouts'], $data, array('id' => $id));
        if ($status === 'paid') {
            $wpdb->update($this->tables['commissions'], array('status'=>'paid','paid_at'=>current_time('mysql', true),'updated_at'=>current_time('mysql', true)), array('payout_id'=>$id));
        }
        $this->audit('payout_' . $status, 'payout', $id, array());
        wp_safe_redirect(admin_url('admin.php?page=onegodian-affiliate-payouts'));
        exit;
    }

    public function create_payout($affiliate_id, $commission_ids) {
        if (!current_user_can('manage_options')) {
            return new WP_Error('forbidden', 'Insufficient permissions.');
        }
        global $wpdb;
        $ids = array_values(array_filter(array_map('absint', (array) $commission_ids)));
        if (!$ids) {
            return new WP_Error('empty', 'No commissions selected.');
        }
        $placeholders = implode(',', array_fill(0, count($ids), '%d'));
        $sql = $wpdb->prepare("SELECT id,commission_amount,status FROM {$this->tables['commissions']} WHERE affiliate_id=%d AND id IN ($placeholders)", array_merge(array(absint($affiliate_id)), $ids));
        $rows = $wpdb->get_results($sql);
        $amount = 0;
        foreach ($rows as $row) {
            if ($row->status === 'approved') {
                $amount += (float) $row->commission_amount;
            }
        }
        if ($amount < (float) $this->settings()['minimum_payout']) {
            return new WP_Error('minimum_payout', 'Approved commissions do not meet the minimum payout threshold.');
        }
        $now = current_time('mysql', true);
        $wpdb->insert($this->tables['payouts'], array('affiliate_id'=>absint($affiliate_id),'amount'=>$amount,'status'=>'draft','created_at'=>$now,'updated_at'=>$now));
        $payout_id = (int) $wpdb->insert_id;
        foreach ($rows as $row) {
            if ($row->status === 'approved') {
                $wpdb->update($this->tables['commissions'], array('payout_id'=>$payout_id,'updated_at'=>$now), array('id'=>(int)$row->id));
            }
        }
        $this->audit('payout_created', 'payout', $payout_id, array('amount'=>$amount,'commission_ids'=>$ids));
        return $payout_id;
    }

    public function export_commissions_csv() {
        if (!current_user_can('manage_options')) {
            wp_die('Forbidden');
        }
        check_admin_referer('ogm_affiliate_export');
        global $wpdb;
        $rows = $wpdb->get_results("SELECT * FROM {$this->tables['commissions']} ORDER BY id DESC", ARRAY_A);
        nocache_headers();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=onegodian-affiliate-commissions-' . gmdate('Y-m-d') . '.csv');
        $out = fopen('php://output', 'w');
        if (!empty($rows)) {
            fputcsv($out, array_keys($rows[0]));
            foreach ($rows as $row) {
                fputcsv($out, $row);
            }
        }
        fclose($out);
        exit;
    }

    private function audit($event, $object_type, $object_id, $context) {
        global $wpdb;
        $wpdb->insert($this->tables['audit'], array(
            'actor_user_id' => get_current_user_id(),
            'event_key' => sanitize_key($event),
            'object_type' => sanitize_key($object_type),
            'object_id' => absint($object_id),
            'context' => wp_json_encode($context),
            'created_at' => current_time('mysql', true),
        ));
    }

    private function client_ip() {
        $ip = sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'));
        return substr($ip, 0, 64);
    }

    private function current_url() {
        $scheme = is_ssl() ? 'https' : 'http';
        $host = sanitize_text_field(wp_unslash($_SERVER['HTTP_HOST'] ?? ''));
        $uri = sanitize_text_field(wp_unslash($_SERVER['REQUEST_URI'] ?? '/'));
        return $scheme . '://' . $host . $uri;
    }
}
