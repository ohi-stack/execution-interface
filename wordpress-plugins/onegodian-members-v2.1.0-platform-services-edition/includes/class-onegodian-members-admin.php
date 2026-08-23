<?php
if (!defined('ABSPATH')) {
    exit;
}

class OneGodian_Members_Admin {
    private $services;
    private $tabs;

    public function __construct(OneGodian_Members_Services $services) {
        $this->services = $services;
        $this->tabs = array(
            'overview' => 'Overview',
            'services' => 'Services',
            'community' => 'Community',
            'commerce' => 'Commerce',
            'content' => 'Protected Content',
            'pages' => 'Auto Pages',
            'checklist' => 'Production Checklist',
        );

        add_action('admin_menu', array($this, 'register_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    public function register_menu() {
        add_menu_page(
            __('OneGodian Members', 'onegodian-members'),
            __('OneGodian Members', 'onegodian-members'),
            'manage_options',
            'onegodian-members',
            array($this, 'render_page'),
            'dashicons-groups',
            56
        );
    }

    public function register_settings() {
        register_setting('onegodian_members_settings', 'onegodian_members_app_bridge_enabled', array(
            'type' => 'boolean',
            'sanitize_callback' => array($this, 'sanitize_boolean'),
            'default' => true,
        ));
    }

    public function sanitize_boolean($value) {
        return (bool) $value;
    }

    public function render_page() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to manage OneGodian Members.', 'onegodian-members'));
        }

        wp_enqueue_style('onegodian-members-admin');
        $active_tab = isset($_GET['tab']) ? sanitize_key(wp_unslash($_GET['tab'])) : 'overview';
        if (!isset($this->tabs[$active_tab])) {
            $active_tab = 'overview';
        }
        ?>
        <div class="wrap onegodian-members-admin">
            <h1><?php echo esc_html('OneGodian Members v' . ONEGODIAN_MEMBERS_VERSION . ' Affiliate Production Edition'); ?></h1>
            <nav class="nav-tab-wrapper" aria-label="<?php esc_attr_e('OneGodian Members tabs', 'onegodian-members'); ?>">
                <?php foreach ($this->tabs as $tab => $label) : ?>
                    <a class="nav-tab <?php echo $active_tab === $tab ? 'nav-tab-active' : ''; ?>" href="<?php echo esc_url(admin_url('admin.php?page=onegodian-members&tab=' . $tab)); ?>"><?php echo esc_html($label); ?></a>
                <?php endforeach; ?>
            </nav>
            <section class="onegodian-members-panel">
                <?php $this->render_tab($active_tab); ?>
            </section>
        </div>
        <?php
    }

    private function render_tab($tab) {
        switch ($tab) {
            case 'services': $this->render_services(); break;
            case 'community': $this->render_community(); break;
            case 'commerce': $this->render_commerce(); break;
            case 'content': $this->render_content(); break;
            case 'pages': $this->render_pages(); break;
            case 'checklist': $this->render_checklist(); break;
            case 'overview':
            default: $this->render_overview(); break;
        }
    }

    private function render_overview() {
        $status = $this->services->get_status();
        echo '<h2>Production Candidate Status</h2>';
        echo '<p>Version ' . esc_html($status['version']) . ' includes member services plus first-party affiliate tracking, WooCommerce order attribution, commission ledgering, refund/reversal handling, payout-status tracking, fraud controls, app bridge, BuddyPress hooks, auto pages, REST endpoints, and service boundaries.</p>';
        echo '<pre>' . esc_html(wp_json_encode($status, JSON_PRETTY_PRINT)) . '</pre>';
    }

    private function render_services() {
        echo '<h2>Service Boundaries</h2><table class="widefat striped"><thead><tr><th>Boundary</th><th>Status</th><th>Description</th></tr></thead><tbody>';
        foreach ($this->services->get_boundaries() as $key => $boundary) {
            echo '<tr><td><code>' . esc_html($key) . '</code></td><td>' . esc_html($boundary['status']) . '</td><td>' . esc_html($boundary['description']) . '</td></tr>';
        }
        echo '</tbody></table>';
    }

    private function render_community() {
        echo '<h2>BuddyPress / Community</h2>';
        echo '<p>BuddyPress integration is conditional and activates profile navigation, activity notices, and group context only when BuddyPress is active.</p>';
        echo '<p><strong>BuddyPress active:</strong> ' . esc_html($this->services->is_buddypress_active() ? 'yes' : 'no') . '</p>';
    }

    private function render_commerce() {
        $woocommerce_active = class_exists('WooCommerce');
        ?>
        <h2>WooCommerce Commerce Authority</h2>
        <p>Membership purchases and qualifying affiliate orders are processed through WooCommerce. Direct frontend Stripe checkout is not used by this plugin. Stripe may be configured separately as a WooCommerce payment gateway.</p>
        <p><strong>WooCommerce active:</strong> <?php echo esc_html($woocommerce_active ? 'yes' : 'no'); ?></p>
        <p><strong>Affiliate schema:</strong> <?php echo esc_html(get_option('onegodian_affiliate_schema_version', 'not installed')); ?></p>
        <p>
            <a class="button button-primary" href="<?php echo esc_url(admin_url('admin.php?page=onegodian-affiliate-settings')); ?>">Affiliate Settings</a>
            <a class="button" href="<?php echo esc_url(admin_url('admin.php?page=onegodian-affiliate-commissions')); ?>">Commissions</a>
            <a class="button" href="<?php echo esc_url(admin_url('admin.php?page=onegodian-affiliate-payouts')); ?>">Payouts</a>
        </p>
        <form method="post" action="options.php">
            <?php settings_fields('onegodian_members_settings'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row">App bridge</th>
                    <td><label><input type="checkbox" name="onegodian_members_app_bridge_enabled" value="1" <?php checked(get_option('onegodian_members_app_bridge_enabled', true)); ?> /> Enabled</label></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
        <?php
    }

    private function render_content() {
        echo '<h2>Protected Content</h2>';
        echo '<p>Use <code>[onegodian_protected]</code>...<code>[/onegodian_protected]</code> to require an authenticated member, manager, or administrator.</p>';
        echo '<p>Member and affiliate surfaces include <code>[onegodian_member_dashboard]</code>, <code>[onegodian_member_certificate]</code>, <code>[onegodian_member_digital_id]</code>, <code>[onegodian_member_community]</code>, <code>[onegodian_affiliate_dashboard]</code>, and <code>[onegodian_referral_link]</code>.</p>';
    }

    private function render_pages() {
        echo '<h2>Auto Pages</h2>';
        echo '<p>Activation-created pages include the member dashboard, login, certificate, digital ID, community, affiliate dashboard, and affiliate referral link.</p>';
        echo '<pre>' . esc_html(wp_json_encode(get_option('onegodian_members_auto_pages', array()), JSON_PRETTY_PRINT)) . '</pre>';
    }

    private function render_checklist() {
        $items = array(
            'Version reads ' . ONEGODIAN_MEMBERS_VERSION,
            'Correct WordPress plugin header',
            'WooCommerce remains the commerce authority',
            'Direct frontend Stripe checkout is not used',
            'Affiliate referral cookie/session attribution implemented',
            'WooCommerce order attribution stored in order metadata',
            'Commission ledger uses idempotent order-level records',
            'Refund and reversal handling is connected',
            'Self-referral and duplicate-click controls are enabled',
            'Payout approval/status tracking does not automatically move funds',
            'Affiliate audit records are retained',
            'BuddyPress integration remains conditional',
            'Auto pages are created on activation',
            'REST endpoints return safe JSON',
            'No raw API keys or secrets committed',
            'Live staging tests remain required before production certification',
        );

        echo '<h2>Production Checklist</h2><ul class="onegodian-members-checklist">';
        foreach ($items as $item) {
            echo '<li>✓ ' . esc_html($item) . '</li>';
        }
        echo '</ul>';
    }
}
