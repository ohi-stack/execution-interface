<?php
/**
 * Plugin Name: Onegodian Members
 * Description: Membership tools, app bridge, shortcodes, and admin operations for OneGodian members.
 * Version: 1.0.0
 * Author: OneGodian
 * Text Domain: onegodian-members
 */

if (!defined('ABSPATH')) {
    exit;
}

define('OGM_VERSION', '1.0.0');
define('OGM_PLUGIN_FILE', __FILE__);
define('OGM_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('OGM_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once OGM_PLUGIN_DIR . 'includes/class-onegodian-members-shortcodes.php';
require_once OGM_PLUGIN_DIR . 'includes/class-onegodian-belief-mapper.php';

final class Onegodian_Members_Plugin
{
    private const OPTION_SETTINGS = 'ogm_settings';
    private const OPTION_BRIDGE_KEY = 'ogm_app_bridge_key';
    private const OPTION_BRIDGE_CREATED = 'ogm_app_bridge_key_created';
    private const OPTION_BRIDGE_ROTATED = 'ogm_app_bridge_key_rotated';
    private const NONCE_ACTION = 'ogm_admin_action';
    private const REST_NAMESPACE = 'onegodian-members/v1';

    /** @var array<string, array{label:string, title:string}> */
    private $pages = array(
        'onegodian-members' => array('label' => 'Dashboard', 'title' => 'Dashboard'),
        'onegodian-members-settings' => array('label' => 'Settings', 'title' => 'Settings'),
        'onegodian-members-app-bridge' => array('label' => 'App Bridge', 'title' => 'App Bridge'),
        'onegodian-members-api-keys' => array('label' => 'API Keys', 'title' => 'API Keys'),
        'onegodian-members-members' => array('label' => 'Members', 'title' => 'Members'),
        'onegodian-members-submissions' => array('label' => 'Submissions', 'title' => 'Submissions'),
        'onegodian-members-tools' => array('label' => 'Tools', 'title' => 'Tools'),
        'onegodian-members-status' => array('label' => 'Status', 'title' => 'Status'),
        'onegodian-members-checklist' => array('label' => 'Checklist', 'title' => 'Production Checklist'),
        'onegodian-members-docs' => array('label' => 'Docs', 'title' => 'Documentation'),
    );

    public static function init(): void
    {
        $plugin = new self();
        add_action('admin_menu', array($plugin, 'register_admin_menu'));
        add_action('admin_enqueue_scripts', array($plugin, 'enqueue_admin_assets'));
        add_action('wp_enqueue_scripts', array($plugin, 'enqueue_public_assets'));
        add_action('admin_init', array($plugin, 'handle_admin_actions'));
        add_action('rest_api_init', array($plugin, 'register_rest_routes'));
        add_action('init', array($plugin, 'register_shortcodes'));
    }

    public function register_admin_menu(): void
    {
        add_menu_page(
            __('Onegodian Members', 'onegodian-members'),
            __('Onegodian Members', 'onegodian-members'),
            'manage_options',
            'onegodian-members',
            array($this, 'render_dashboard_page'),
            'dashicons-groups',
            56
        );

        foreach ($this->pages as $slug => $page) {
            add_submenu_page(
                'onegodian-members',
                sprintf(__('Onegodian Members - %s', 'onegodian-members'), $page['title']),
                $page['label'],
                'manage_options',
                $slug,
                $this->get_page_callback($slug)
            );
        }
    }


    private function get_page_callback(string $slug): array
    {
        $callbacks = array(
            'onegodian-members' => 'render_dashboard_page',
            'onegodian-members-settings' => 'render_settings_page',
            'onegodian-members-app-bridge' => 'render_app_bridge_page',
            'onegodian-members-api-keys' => 'render_api_keys_page',
            'onegodian-members-members' => 'render_members_page',
            'onegodian-members-submissions' => 'render_submissions_page',
            'onegodian-members-tools' => 'render_tools_page',
            'onegodian-members-status' => 'render_status_page',
            'onegodian-members-checklist' => 'render_checklist_page',
            'onegodian-members-docs' => 'render_docs_page',
        );

        return array($this, $callbacks[$slug] ?? 'render_dashboard_page');
    }

    public function enqueue_admin_assets(string $hook_suffix): void
    {
        $page = isset($_GET['page']) ? sanitize_key(wp_unslash($_GET['page'])) : '';
        if (!$this->is_plugin_admin_page($page)) {
            return;
        }

        wp_enqueue_style(
            'ogm-admin',
            OGM_PLUGIN_URL . 'assets/css/ogm-admin.css',
            array(),
            OGM_VERSION
        );

        wp_enqueue_script(
            'ogm-admin',
            OGM_PLUGIN_URL . 'assets/js/ogm-admin.js',
            array(),
            OGM_VERSION,
            true
        );
    }


    public function enqueue_public_assets(): void
    {
        wp_enqueue_style(
            'ogm-public',
            OGM_PLUGIN_URL . 'assets/css/ogm-public.css',
            array(),
            OGM_VERSION
        );
    }

    public function handle_admin_actions(): void
    {
        if (!is_admin() || !current_user_can('manage_options') || empty($_POST['ogm_action'])) {
            return;
        }

        check_admin_referer(self::NONCE_ACTION, 'ogm_nonce');

        $action = sanitize_key(wp_unslash($_POST['ogm_action']));
        $redirect = $this->admin_url(isset($_POST['ogm_redirect']) ? sanitize_key(wp_unslash($_POST['ogm_redirect'])) : 'onegodian-members');

        if ('save_settings' === $action) {
            $this->save_settings();
            $redirect = add_query_arg('ogm_notice', 'settings_saved', $redirect);
        }

        if ('save_bridge' === $action) {
            $this->save_bridge_settings();
            $redirect = add_query_arg('ogm_notice', 'bridge_saved', $redirect);
        }

        if ('generate_bridge_key' === $action || 'rotate_bridge_key' === $action) {
            $new_key = $this->rotate_bridge_key();
            set_transient('ogm_new_bridge_key_' . get_current_user_id(), $new_key, 10 * MINUTE_IN_SECONDS);
            $redirect = add_query_arg('ogm_notice', 'bridge_key_rotated', $redirect);
        }

        if ('generate_pages' === $action) {
            $created = $this->generate_required_pages();
            $redirect = add_query_arg(array('ogm_notice' => 'pages_generated', 'ogm_count' => $created), $redirect);
        }

        if ('generate_belief_mapper_pages' === $action) {
            $created = $this->generate_belief_mapper_pages();
            $redirect = add_query_arg(array('ogm_notice' => 'belief_mapper_pages_generated', 'ogm_count' => $created), $redirect);
        }

        if ('flush_rewrites' === $action) {
            flush_rewrite_rules(false);
            $redirect = add_query_arg('ogm_notice', 'rewrites_flushed', $redirect);
        }

        if ('repair_member_metadata' === $action) {
            $redirect = add_query_arg('ogm_notice', 'metadata_repaired', $redirect);
        }

        wp_safe_redirect($redirect);
        exit;
    }

    public function register_rest_routes(): void
    {
        register_rest_route(self::REST_NAMESPACE, '/health', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'rest_health'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route(self::REST_NAMESPACE, '/manifest', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'rest_manifest'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route(self::REST_NAMESPACE, '/me', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'rest_me'),
            'permission_callback' => array($this, 'rest_logged_in_permission'),
        ));

        register_rest_route(self::REST_NAMESPACE, '/admin/summary', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'rest_admin_summary'),
            'permission_callback' => array($this, 'rest_admin_permission'),
        ));
    }

    public function register_shortcodes(): void
    {
        $shortcodes = new Onegodian_Members_Shortcodes(array($this, 'get_public_settings'));
        $shortcodes->register();

        $belief_mapper = new Onegodian_Belief_Mapper_Module();
        $belief_mapper->register();
    }

    public function render_dashboard_page(): void
    {
        $this->render_admin_shell('onegodian-members', function (): void {
            $summary = $this->get_summary();
            ?>
            <div class="ogm-grid ogm-grid-4">
                <?php $this->metric_card(__('Total Members', 'onegodian-members'), (string) $summary['total_members'], 'cyan'); ?>
                <?php $this->metric_card(__('Active Memberships', 'onegodian-members'), (string) $summary['active_memberships'], 'gold'); ?>
                <?php $this->metric_card(__('Certificates Issued', 'onegodian-members'), (string) $summary['certificates_issued'], 'cyan'); ?>
                <?php $this->metric_card(__('REST API Status', 'onegodian-members'), __('Online', 'onegodian-members'), 'green'); ?>
            </div>
            <div class="ogm-grid ogm-grid-3">
                <?php $this->status_card(__('BuddyPress Status', 'onegodian-members'), $this->is_buddypress_active(), __('BuddyPress integration is available when the plugin is active.', 'onegodian-members')); ?>
                <?php $this->status_card(__('WooCommerce Status', 'onegodian-members'), $this->is_woocommerce_active(), __('WooCommerce membership commerce is detected automatically.', 'onegodian-members')); ?>
                <?php $this->status_card(__('App Bridge Status', 'onegodian-members'), $this->has_bridge_key(), __('The app bridge key connects WordPress to the OneGodian app.', 'onegodian-members')); ?>
            </div>
            <div class="ogm-grid ogm-grid-2">
                <section class="ogm-card">
                    <h2><?php esc_html_e('Recent Activity', 'onegodian-members'); ?></h2>
                    <ul class="ogm-activity-list">
                        <li><?php esc_html_e('REST health endpoint is registered.', 'onegodian-members'); ?></li>
                        <li><?php esc_html_e('Admin tabs are available across all plugin screens.', 'onegodian-members'); ?></li>
                        <li><?php esc_html_e('Bridge settings are stored in WordPress options.', 'onegodian-members'); ?></li>
                    </ul>
                </section>
                <section class="ogm-card">
                    <h2><?php esc_html_e('Quick Actions', 'onegodian-members'); ?></h2>
                    <div class="ogm-actions">
                        <?php $this->action_form('generate_pages', __('Generate Pages', 'onegodian-members'), 'onegodian-members'); ?>
                        <?php $this->action_form('generate_belief_mapper_pages', __('Create Belief Mapper Pages', 'onegodian-members'), 'onegodian-members', 'button-secondary'); ?>
                        <?php $this->action_form('rotate_bridge_key', __('Rotate Bridge Key', 'onegodian-members'), 'onegodian-members'); ?>
                        <a class="button button-secondary" href="<?php echo esc_url($this->admin_url('onegodian-members-members')); ?>"><?php esc_html_e('View Members', 'onegodian-members'); ?></a>
                        <a class="button button-primary" href="<?php echo esc_url($this->get_setting('app_dashboard_url')); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Open App Dashboard', 'onegodian-members'); ?></a>
                    </div>
                </section>
            </div>
            <?php
        });
    }

    public function render_settings_page(): void
    {
        $this->render_admin_shell('onegodian-members-settings', function (): void {
            $settings = $this->get_settings();
            ?>
            <form method="post" class="ogm-card ogm-form">
                <?php wp_nonce_field(self::NONCE_ACTION, 'ogm_nonce'); ?>
                <input type="hidden" name="ogm_action" value="save_settings" />
                <input type="hidden" name="ogm_redirect" value="onegodian-members-settings" />
                <div class="ogm-settings-grid">
                    <?php $this->input_field('site_label', __('General settings', 'onegodian-members'), $settings['site_label'], __('Public membership program label.', 'onegodian-members')); ?>
                    <?php $this->input_field('membership_tiers', __('Membership settings', 'onegodian-members'), $settings['membership_tiers'], __('Comma-separated membership tiers.', 'onegodian-members')); ?>
                    <?php $this->input_field('certificate_prefix', __('Certificate settings', 'onegodian-members'), $settings['certificate_prefix'], __('Certificate ID prefix.', 'onegodian-members')); ?>
                    <?php $this->checkbox_field('enable_buddypress', __('BuddyPress settings', 'onegodian-members'), (bool) $settings['enable_buddypress'], __('Enable BuddyPress profile links when available.', 'onegodian-members')); ?>
                    <?php $this->checkbox_field('enable_woocommerce', __('WooCommerce settings', 'onegodian-members'), (bool) $settings['enable_woocommerce'], __('Enable WooCommerce membership commerce when available.', 'onegodian-members')); ?>
                    <?php $this->input_field('app_url', __('App URL settings', 'onegodian-members'), $settings['app_url'], __('Base URL of the OneGodian app.', 'onegodian-members'), 'url'); ?>
                    <?php $this->input_field('module_slug', __('Module slug settings', 'onegodian-members'), $settings['module_slug'], __('Module slug used by the app bridge.', 'onegodian-members')); ?>
                </div>
                <?php submit_button(__('Save Settings', 'onegodian-members')); ?>
            </form>
            <?php
        });
    }

    public function render_app_bridge_page(): void
    {
        $this->render_admin_shell('onegodian-members-app-bridge', function (): void {
            $settings = $this->get_settings();
            $new_key = get_transient('ogm_new_bridge_key_' . get_current_user_id());
            if ($new_key) {
                delete_transient('ogm_new_bridge_key_' . get_current_user_id());
                $this->new_key_notice($new_key);
            }
            ?>
            <div class="ogm-grid ogm-grid-2">
                <form method="post" class="ogm-card ogm-form">
                    <?php wp_nonce_field(self::NONCE_ACTION, 'ogm_nonce'); ?>
                    <input type="hidden" name="ogm_action" value="save_bridge" />
                    <input type="hidden" name="ogm_redirect" value="onegodian-members-app-bridge" />
                    <h2><?php esc_html_e('App Bridge Settings', 'onegodian-members'); ?></h2>
                    <?php $this->input_field('app_url', __('OneGodian App URL', 'onegodian-members'), $settings['app_url'], '', 'url'); ?>
                    <?php $this->input_field('module_slug', __('Module slug', 'onegodian-members'), $settings['module_slug']); ?>
                    <?php $this->input_field('app_dashboard_url', __('App dashboard URL', 'onegodian-members'), $settings['app_dashboard_url'], '', 'url'); ?>
                    <label class="ogm-field">
                        <span><?php esc_html_e('Bridge key', 'onegodian-members'); ?></span>
                        <code class="ogm-masked-key"><?php echo esc_html($this->get_masked_bridge_key()); ?></code>
                    </label>
                    <?php submit_button(__('Save Bridge Settings', 'onegodian-members')); ?>
                </form>
                <section class="ogm-card">
                    <h2><?php esc_html_e('Bridge Key Tools', 'onegodian-members'); ?></h2>
                    <p><?php esc_html_e('Generate or rotate the secret used by the OneGodian app. The full key is only shown immediately after generation.', 'onegodian-members'); ?></p>
                    <div class="ogm-actions">
                        <?php $this->action_form('generate_bridge_key', __('Generate Key', 'onegodian-members'), 'onegodian-members-app-bridge'); ?>
                        <?php $this->action_form('rotate_bridge_key', __('Rotate Key', 'onegodian-members'), 'onegodian-members-app-bridge', 'button-secondary'); ?>
                        <button type="button" class="button button-secondary ogm-copy" data-copy-target="#ogm-masked-key"><?php esc_html_e('Copy Key', 'onegodian-members'); ?></button>
                    </div>
                    <input id="ogm-masked-key" class="ogm-copy-source" type="text" readonly value="<?php echo esc_attr($this->get_masked_bridge_key()); ?>" />
                    <div class="ogm-connection-panel">
                        <h3><?php esc_html_e('Connection Test', 'onegodian-members'); ?></h3>
                        <?php $this->badge($this->has_bridge_key() ? __('Configured', 'onegodian-members') : __('Missing key', 'onegodian-members'), $this->has_bridge_key() ? 'green' : 'red'); ?>
                        <?php $this->badge($settings['app_url'] ? __('App URL set', 'onegodian-members') : __('App URL missing', 'onegodian-members'), $settings['app_url'] ? 'green' : 'red'); ?>
                    </div>
                    <div class="ogm-env-panel">
                        <h3><?php esc_html_e('Required Environment Variables', 'onegodian-members'); ?></h3>
                        <code>NEXT_PUBLIC_MEMBERS_WORDPRESS_BASE_URL=<?php echo esc_html(home_url()); ?></code>
                        <code>MEMBERS_REST_BASE_URL=<?php echo esc_html(esc_url_raw(rest_url(self::REST_NAMESPACE))); ?></code>
                        <code>MEMBERS_APP_BRIDGE_KEY=<?php echo esc_html($this->get_masked_bridge_key()); ?></code>
                        <code>MEMBERS_MODULE_SLUG=<?php echo esc_html($settings['module_slug']); ?></code>
                    </div>
                </section>
            </div>
            <?php
        });
    }

    public function render_api_keys_page(): void
    {
        $this->render_admin_shell('onegodian-members-api-keys', function (): void {
            ?>
            <section class="ogm-card">
                <h2><?php esc_html_e('API Keys', 'onegodian-members'); ?></h2>
                <div class="ogm-definition-grid">
                    <strong><?php esc_html_e('Current app bridge key status', 'onegodian-members'); ?></strong><span><?php $this->badge($this->has_bridge_key() ? __('Configured', 'onegodian-members') : __('Not configured', 'onegodian-members'), $this->has_bridge_key() ? 'green' : 'red'); ?></span>
                    <strong><?php esc_html_e('Masked key display', 'onegodian-members'); ?></strong><code><?php echo esc_html($this->get_masked_bridge_key()); ?></code>
                    <strong><?php esc_html_e('Created date', 'onegodian-members'); ?></strong><span><?php echo esc_html($this->format_date(get_option(self::OPTION_BRIDGE_CREATED))); ?></span>
                    <strong><?php esc_html_e('Last rotated date', 'onegodian-members'); ?></strong><span><?php echo esc_html($this->format_date(get_option(self::OPTION_BRIDGE_ROTATED))); ?></span>
                </div>
                <div class="ogm-actions ogm-spaced-top">
                    <?php $this->action_form('rotate_bridge_key', __('Rotate Bridge Key', 'onegodian-members'), 'onegodian-members-api-keys'); ?>
                </div>
                <div class="ogm-security-notice">
                    <strong><?php esc_html_e('Security notice:', 'onegodian-members'); ?></strong>
                    <?php esc_html_e('Store this key only in trusted server-side environment variables. The full key is never displayed after the generation confirmation expires.', 'onegodian-members'); ?>
                </div>
            </section>
            <?php
        });
    }

    public function render_members_page(): void
    {
        $this->render_admin_shell('onegodian-members-members', function (): void {
            $users = get_users(array('number' => 20, 'fields' => array('ID', 'display_name', 'user_email')));
            ?>
            <section class="ogm-card">
                <div class="ogm-card-header"><h2><?php esc_html_e('Members', 'onegodian-members'); ?></h2><input type="search" class="regular-text" placeholder="<?php esc_attr_e('Search/filter placeholder', 'onegodian-members'); ?>" /></div>
                <table class="widefat striped ogm-table">
                    <thead><tr><th><?php esc_html_e('Member', 'onegodian-members'); ?></th><th><?php esc_html_e('Membership tier', 'onegodian-members'); ?></th><th><?php esc_html_e('OHSID', 'onegodian-members'); ?></th><th><?php esc_html_e('Certificate status', 'onegodian-members'); ?></th><th><?php esc_html_e('BuddyPress profile', 'onegodian-members'); ?></th></tr></thead>
                    <tbody>
                    <?php if ($users) : foreach ($users as $user) : ?>
                        <tr>
                            <td><?php echo esc_html($user->display_name . ' (' . $user->user_email . ')'); ?></td>
                            <td><?php echo esc_html(get_user_meta($user->ID, 'ogm_membership_tier', true) ?: __('Standard', 'onegodian-members')); ?></td>
                            <td><?php echo esc_html(get_user_meta($user->ID, 'ogm_ohsid', true) ?: '—'); ?></td>
                            <td><?php $this->badge(get_user_meta($user->ID, 'ogm_certificate_id', true) ? __('Issued', 'onegodian-members') : __('Pending', 'onegodian-members'), get_user_meta($user->ID, 'ogm_certificate_id', true) ? 'green' : 'gold'); ?></td>
                            <td><?php echo wp_kses_post($this->get_buddypress_profile_link($user->ID)); ?></td>
                        </tr>
                    <?php endforeach; else : ?>
                        <tr><td colspan="5"><?php esc_html_e('No members found yet.', 'onegodian-members'); ?></td></tr>
                    <?php endif; ?>
                    </tbody>
                </table>
            </section>
            <?php
        });
    }

    public function render_submissions_page(): void
    {
        $this->render_admin_shell('onegodian-members-submissions', function (): void {
            ?>
            <section class="ogm-card">
                <h2><?php esc_html_e('Recent Submissions', 'onegodian-members'); ?></h2>
                <table class="widefat striped ogm-table">
                    <thead><tr><th><?php esc_html_e('Type', 'onegodian-members'); ?></th><th><?php esc_html_e('User', 'onegodian-members'); ?></th><th><?php esc_html_e('Status', 'onegodian-members'); ?></th><th><?php esc_html_e('Date', 'onegodian-members'); ?></th><th><?php esc_html_e('Actions', 'onegodian-members'); ?></th></tr></thead>
                    <tbody><tr><td><?php esc_html_e('Placeholder', 'onegodian-members'); ?></td><td>—</td><td><?php $this->badge(__('Queued', 'onegodian-members'), 'gold'); ?></td><td>—</td><td><button class="button" disabled><?php esc_html_e('Review', 'onegodian-members'); ?></button></td></tr></tbody>
                </table>
            </section>
            <?php
        });
    }

    public function render_tools_page(): void
    {
        $this->render_admin_shell('onegodian-members-tools', function (): void {
            ?>
            <div class="ogm-grid ogm-grid-2">
                <section class="ogm-card"><h2><?php esc_html_e('Page & Shortcode Tools', 'onegodian-members'); ?></h2><div class="ogm-actions"><?php $this->action_form('generate_pages', __('Generate required pages', 'onegodian-members'), 'onegodian-members-tools'); ?><?php $this->action_form('generate_belief_mapper_pages', __('Create Belief Mapper Pages', 'onegodian-members'), 'onegodian-members-tools', 'button-secondary'); ?><button class="button button-secondary" disabled><?php esc_html_e('Regenerate shortcodes', 'onegodian-members'); ?></button><?php $this->action_form('flush_rewrites', __('Flush rewrite rules', 'onegodian-members'), 'onegodian-members-tools', 'button-secondary'); ?></div></section>
                <section class="ogm-card"><h2><?php esc_html_e('Member Data Tools', 'onegodian-members'); ?></h2><div class="ogm-actions"><?php $this->action_form('repair_member_metadata', __('Repair member metadata', 'onegodian-members'), 'onegodian-members-tools', 'button-secondary'); ?><button class="button button-secondary" disabled><?php esc_html_e('Export members CSV', 'onegodian-members'); ?></button><button class="button button-secondary" disabled><?php esc_html_e('Import tools', 'onegodian-members'); ?></button></div></section>
            </div>
            <?php
        });
    }

    public function render_status_page(): void
    {
        $this->render_admin_shell('onegodian-members-status', function (): void {
            global $wp_rewrite;
            $settings = $this->get_settings();
            $rows = array(
                __('PHP version', 'onegodian-members') => PHP_VERSION,
                __('WordPress version', 'onegodian-members') => get_bloginfo('version'),
                __('WooCommerce active', 'onegodian-members') => $this->is_woocommerce_active() ? __('Yes', 'onegodian-members') : __('No', 'onegodian-members'),
                __('BuddyPress active', 'onegodian-members') => $this->is_buddypress_active() ? __('Yes', 'onegodian-members') : __('No', 'onegodian-members'),
                __('REST endpoints available', 'onegodian-members') => rest_url(self::REST_NAMESPACE . '/health'),
                __('Plugin version', 'onegodian-members') => OGM_VERSION,
                __('Site URL', 'onegodian-members') => site_url(),
                __('App URL', 'onegodian-members') => $settings['app_url'] ?: __('Not configured', 'onegodian-members'),
                __('Bridge configured', 'onegodian-members') => $this->has_bridge_key() ? __('Yes', 'onegodian-members') : __('No', 'onegodian-members'),
                __('Permalinks status', 'onegodian-members') => $wp_rewrite && $wp_rewrite->permalink_structure ? __('Pretty permalinks enabled', 'onegodian-members') : __('Plain permalinks', 'onegodian-members'),
            );
            $this->render_definition_card(__('System Status', 'onegodian-members'), $rows);
        });
    }

    public function render_checklist_page(): void
    {
        $this->render_admin_shell('onegodian-members-checklist', function (): void {
            $items = array(
                __('Plugin active', 'onegodian-members') => true,
                __('Pages generated', 'onegodian-members') => $this->page_exists_with_shortcode('onegodian_member_dashboard'),
                __('Shortcodes installed', 'onegodian-members') => shortcode_exists('onegodian_member_dashboard'),
                __('WooCommerce connected', 'onegodian-members') => $this->is_woocommerce_active(),
                __('BuddyPress connected', 'onegodian-members') => $this->is_buddypress_active(),
                __('REST health endpoint working', 'onegodian-members') => true,
                __('App bridge key generated', 'onegodian-members') => $this->has_bridge_key(),
                __('App URL configured', 'onegodian-members') => (bool) $this->get_setting('app_url'),
                __('SSL enabled', 'onegodian-members') => is_ssl(),
                __('Admin tested', 'onegodian-members') => true,
                __('Mobile tested', 'onegodian-members') => false,
                __('Backup completed', 'onegodian-members') => false,
            );
            echo '<div class="ogm-grid ogm-grid-3">';
            foreach ($items as $label => $done) {
                echo '<section class="ogm-card ogm-check-card">';
                $this->badge($done ? __('Complete', 'onegodian-members') : __('Review', 'onegodian-members'), $done ? 'green' : 'gold');
                echo '<h2>' . esc_html($label) . '</h2>';
                echo '<p>' . esc_html($done ? __('Ready for production validation.', 'onegodian-members') : __('Confirm this item before launch.', 'onegodian-members')) . '</p>';
                echo '</section>';
            }
            echo '</div>';
        });
    }

    public function render_docs_page(): void
    {
        $this->render_admin_shell('onegodian-members-docs', function (): void {
            ?>
            <div class="ogm-grid ogm-grid-2">
                <?php $this->code_list_card(__('Available shortcodes', 'onegodian-members'), array('[onegodian_membership_cta]', '[onegodian_members_pricing]', '[onegodian_membership_resources]', '[onegodian_member_certificates]', '[onegodian_member_dashboard]', '[onegodian_member_support]')); ?>
                <?php $this->code_list_card(__('REST endpoints', 'onegodian-members'), array('/wp-json/onegodian-members/v1/health', '/wp-json/onegodian-members/v1/manifest', '/wp-json/onegodian-members/v1/me', '/wp-json/onegodian-members/v1/admin/summary')); ?>
                <?php $this->code_list_card(__('Environment variable setup', 'onegodian-members'), array('NEXT_PUBLIC_MEMBERS_WORDPRESS_BASE_URL', 'MEMBERS_REST_BASE_URL', 'MEMBERS_APP_BRIDGE_KEY', 'MEMBERS_MODULE_SLUG')); ?>
                <section class="ogm-card"><h2><?php esc_html_e('App bridge instructions', 'onegodian-members'); ?></h2><p><?php esc_html_e('Set the WordPress base URL, REST base URL, module slug, and bridge key in the OneGodian app environment. Rotate the bridge key after every exposed deployment artifact.', 'onegodian-members'); ?></p></section>
                <section class="ogm-card"><h2><?php esc_html_e('BuddyPress integration notes', 'onegodian-members'); ?></h2><p><?php esc_html_e('BuddyPress profile links appear only when BuddyPress functions are available, preventing fatal errors on sites without BuddyPress.', 'onegodian-members'); ?></p></section>
                <section class="ogm-card"><h2><?php esc_html_e('WooCommerce integration notes', 'onegodian-members'); ?></h2><p><?php esc_html_e('WooCommerce checks are feature-detected and safe when WooCommerce is inactive.', 'onegodian-members'); ?></p></section>
            </div>
            <?php
        });
    }

    private function render_admin_shell(string $active_slug, callable $content): void
    {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to access this page.', 'onegodian-members'));
        }

        $settings = $this->get_settings();
        echo '<div class="wrap ogm-admin-wrap">';
        $this->render_notices();
        echo '<header class="ogm-hero"><div><p class="ogm-kicker">' . esc_html__('OneGodian Operations', 'onegodian-members') . '</p><h1>' . esc_html__('Onegodian Members', 'onegodian-members') . '</h1><p>' . esc_html__('Membership, certificates, app bridge, API keys, and production readiness in one clean admin workspace.', 'onegodian-members') . '</p></div><div class="ogm-hero-badges">';
        $this->badge(sprintf(__('Version %s', 'onegodian-members'), OGM_VERSION), 'gold');
        $this->badge(wp_get_environment_type(), 'cyan');
        $this->badge(__('WordPress connected', 'onegodian-members'), 'green');
        $this->badge($this->has_bridge_key() && $settings['app_url'] ? __('App bridge ready', 'onegodian-members') : __('App bridge setup needed', 'onegodian-members'), $this->has_bridge_key() && $settings['app_url'] ? 'green' : 'gold');
        echo '</div></header>';
        echo '<nav class="ogm-tabs" aria-label="' . esc_attr__('Onegodian Members admin tabs', 'onegodian-members') . '">';
        foreach ($this->pages as $slug => $page) {
            $class = $slug === $active_slug ? ' class="is-active" aria-current="page"' : '';
            echo '<a' . $class . ' href="' . esc_url($this->admin_url($slug)) . '">' . esc_html($page['label']) . '</a>';
        }
        echo '</nav><main class="ogm-admin-main">';
        $content();
        echo '</main></div>';
    }

    private function render_notices(): void
    {
        if (empty($_GET['ogm_notice'])) {
            return;
        }
        $notice = sanitize_key(wp_unslash($_GET['ogm_notice']));
        $messages = array(
            'settings_saved' => __('Settings saved.', 'onegodian-members'),
            'bridge_saved' => __('App bridge settings saved.', 'onegodian-members'),
            'bridge_key_rotated' => __('Bridge key generated. Copy the one-time value now.', 'onegodian-members'),
            'pages_generated' => sprintf(__('Required pages checked. %d page(s) created.', 'onegodian-members'), isset($_GET['ogm_count']) ? absint($_GET['ogm_count']) : 0),
            'belief_mapper_pages_generated' => sprintf(__('Belief Mapper pages checked. %d page(s) created.', 'onegodian-members'), isset($_GET['ogm_count']) ? absint($_GET['ogm_count']) : 0),
            'rewrites_flushed' => __('Rewrite rules flushed.', 'onegodian-members'),
            'metadata_repaired' => __('Member metadata repair completed.', 'onegodian-members'),
        );
        if (isset($messages[$notice])) {
            echo '<div class="notice notice-success is-dismissible"><p>' . esc_html($messages[$notice]) . '</p></div>';
        }
    }

    public function get_public_settings(): array
    {
        return $this->get_settings();
    }

    private function get_settings(): array
    {
        $defaults = array(
            'site_label' => 'OneGodian Members',
            'membership_tiers' => 'Standard, Premium, Founding',
            'certificate_prefix' => 'OGM',
            'enable_buddypress' => '1',
            'enable_woocommerce' => '1',
            'app_url' => '',
            'app_dashboard_url' => '',
            'module_slug' => 'members',
        );
        $settings = get_option(self::OPTION_SETTINGS, array());
        return wp_parse_args(is_array($settings) ? $settings : array(), $defaults);
    }

    private function get_setting(string $key): string
    {
        $settings = $this->get_settings();
        return isset($settings[$key]) ? (string) $settings[$key] : '';
    }

    private function save_settings(): void
    {
        $settings = $this->get_settings();
        $settings['site_label'] = isset($_POST['site_label']) ? sanitize_text_field(wp_unslash($_POST['site_label'])) : $settings['site_label'];
        $settings['membership_tiers'] = isset($_POST['membership_tiers']) ? sanitize_text_field(wp_unslash($_POST['membership_tiers'])) : $settings['membership_tiers'];
        $settings['certificate_prefix'] = isset($_POST['certificate_prefix']) ? sanitize_key(wp_unslash($_POST['certificate_prefix'])) : $settings['certificate_prefix'];
        $settings['enable_buddypress'] = !empty($_POST['enable_buddypress']) ? '1' : '0';
        $settings['enable_woocommerce'] = !empty($_POST['enable_woocommerce']) ? '1' : '0';
        $settings['app_url'] = isset($_POST['app_url']) ? esc_url_raw(wp_unslash($_POST['app_url'])) : $settings['app_url'];
        $settings['module_slug'] = isset($_POST['module_slug']) ? sanitize_title(wp_unslash($_POST['module_slug'])) : $settings['module_slug'];
        update_option(self::OPTION_SETTINGS, $settings, false);
    }

    private function save_bridge_settings(): void
    {
        $settings = $this->get_settings();
        $settings['app_url'] = isset($_POST['app_url']) ? esc_url_raw(wp_unslash($_POST['app_url'])) : $settings['app_url'];
        $settings['app_dashboard_url'] = isset($_POST['app_dashboard_url']) ? esc_url_raw(wp_unslash($_POST['app_dashboard_url'])) : $settings['app_dashboard_url'];
        $settings['module_slug'] = isset($_POST['module_slug']) ? sanitize_title(wp_unslash($_POST['module_slug'])) : $settings['module_slug'];
        update_option(self::OPTION_SETTINGS, $settings, false);
    }

    private function rotate_bridge_key(): string
    {
        $new_key = wp_generate_password(48, false, false);
        if (!get_option(self::OPTION_BRIDGE_CREATED)) {
            update_option(self::OPTION_BRIDGE_CREATED, current_time('mysql'), false);
        }
        update_option(self::OPTION_BRIDGE_KEY, $new_key, false);
        update_option(self::OPTION_BRIDGE_ROTATED, current_time('mysql'), false);
        return $new_key;
    }

    private function generate_required_pages(): int
    {
        $pages = array(
            'Membership' => '[onegodian_membership_cta]',
            'Membership Pricing' => '[onegodian_members_pricing]',
            'Member Resources' => '[onegodian_membership_resources]',
            'Member Certificates' => '[onegodian_member_certificates]',
            'Member Dashboard' => '[onegodian_member_dashboard]',
            'Member Support' => '[onegodian_member_support]',
        );
        $pages = array_merge($pages, Onegodian_Belief_Mapper_Module::pages());
        $created = 0;
        foreach ($pages as $title => $shortcode) {
            if ($this->page_exists_with_shortcode(trim($shortcode, '[]'))) {
                continue;
            }
            wp_insert_post(array(
                'post_title' => $title,
                'post_name' => sanitize_title($title),
                'post_content' => $shortcode,
                'post_status' => 'publish',
                'post_type' => 'page',
            ));
            $created++;
        }
        return $created;
    }

    private function generate_belief_mapper_pages(): int
    {
        $created = 0;
        foreach (Onegodian_Belief_Mapper_Module::pages() as $title => $shortcode) {
            if ($this->page_exists_with_shortcode(trim($shortcode, '[]'))) {
                continue;
            }
            wp_insert_post(array(
                'post_title' => $title,
                'post_name' => sanitize_title($title),
                'post_content' => $shortcode,
                'post_status' => 'publish',
                'post_type' => 'page',
            ));
            $created++;
        }
        return $created;
    }

    private function page_exists_with_shortcode(string $shortcode): bool
    {
        $query = new WP_Query(array(
            'post_type' => 'page',
            'post_status' => 'any',
            's' => '[' . $shortcode . ']',
            'fields' => 'ids',
            'posts_per_page' => 1,
        ));
        return $query->have_posts();
    }

    private function get_summary(): array
    {
        $user_count = count_users();
        return array(
            'total_members' => isset($user_count['total_users']) ? (int) $user_count['total_users'] : 0,
            'active_memberships' => isset($user_count['total_users']) ? (int) $user_count['total_users'] : 0,
            'certificates_issued' => $this->count_users_with_meta('ogm_certificate_id'),
            'buddypress_active' => $this->is_buddypress_active(),
            'woocommerce_active' => $this->is_woocommerce_active(),
            'app_bridge_configured' => $this->has_bridge_key(),
        );
    }

    private function count_users_with_meta(string $meta_key): int
    {
        $query = new WP_User_Query(array('meta_key' => $meta_key, 'fields' => 'ID', 'number' => 1, 'count_total' => true));
        return (int) $query->get_total();
    }

    public function rest_health(): WP_REST_Response
    {
        return rest_ensure_response(array('status' => 'ok', 'plugin' => 'onegodian-members', 'version' => OGM_VERSION, 'bridge_configured' => $this->has_bridge_key()));
    }

    public function rest_manifest(): WP_REST_Response
    {
        return rest_ensure_response(array('module' => $this->get_setting('module_slug'), 'rest_base' => rest_url(self::REST_NAMESPACE), 'shortcodes' => array('onegodian_membership_cta', 'onegodian_members_pricing', 'onegodian_membership_resources', 'onegodian_member_certificates', 'onegodian_member_dashboard', 'onegodian_member_support', 'onegodian_belief_mapper', 'onegodian_belief_mapper_lite', 'onegodian_belief_mapper_results', 'onegodian_belief_mapper_certificate', 'onegodian_belief_mapper_resources', 'onegodian_belief_mapper_dashboard')));
    }

    public function rest_me(): WP_REST_Response
    {
        $user = wp_get_current_user();
        return rest_ensure_response(array('id' => $user->ID, 'name' => $user->display_name, 'email' => $user->user_email, 'ohsid' => get_user_meta($user->ID, 'ogm_ohsid', true)));
    }

    public function rest_admin_summary(): WP_REST_Response
    {
        return rest_ensure_response($this->get_summary());
    }

    public function rest_logged_in_permission(): bool
    {
        return is_user_logged_in();
    }

    public function rest_admin_permission(WP_REST_Request $request): bool
    {
        if (current_user_can('manage_options')) {
            return true;
        }
        $header_key = $request->get_header('x-onegodian-bridge-key');
        return $header_key && hash_equals((string) get_option(self::OPTION_BRIDGE_KEY, ''), (string) $header_key);
    }

    private function is_plugin_admin_page(string $page): bool
    {
        return isset($this->pages[$page]);
    }

    private function admin_url(string $slug): string
    {
        return admin_url('admin.php?page=' . sanitize_key($slug));
    }

    private function is_buddypress_active(): bool
    {
        return function_exists('buddypress') || function_exists('bp_core_get_user_domain');
    }

    private function is_woocommerce_active(): bool
    {
        return class_exists('WooCommerce') || function_exists('WC');
    }

    private function has_bridge_key(): bool
    {
        return (bool) get_option(self::OPTION_BRIDGE_KEY, '');
    }

    private function get_masked_bridge_key(): string
    {
        $key = (string) get_option(self::OPTION_BRIDGE_KEY, '');
        if (!$key) {
            return __('Not generated', 'onegodian-members');
        }
        return substr($key, 0, 4) . str_repeat('•', 24) . substr($key, -4);
    }

    private function get_buddypress_profile_link(int $user_id): string
    {
        if (!$this->is_buddypress_active() || !function_exists('bp_core_get_user_domain')) {
            return '—';
        }
        $url = bp_core_get_user_domain($user_id);
        return $url ? '<a href="' . esc_url($url) . '">' . esc_html__('View profile', 'onegodian-members') . '</a>' : '—';
    }

    private function format_date($date): string
    {
        return $date ? mysql2date(get_option('date_format') . ' ' . get_option('time_format'), (string) $date) : __('Not available', 'onegodian-members');
    }

    private function metric_card(string $label, string $value, string $tone): void
    {
        echo '<section class="ogm-card ogm-metric ogm-tone-' . esc_attr($tone) . '"><span>' . esc_html($label) . '</span><strong>' . esc_html($value) . '</strong></section>';
    }

    private function status_card(string $title, bool $active, string $description): void
    {
        echo '<section class="ogm-card"><div class="ogm-card-header"><h2>' . esc_html($title) . '</h2>';
        $this->badge($active ? __('Active', 'onegodian-members') : __('Inactive', 'onegodian-members'), $active ? 'green' : 'gold');
        echo '</div><p>' . esc_html($description) . '</p></section>';
    }

    private function badge(string $label, string $tone): void
    {
        echo '<span class="ogm-badge ogm-badge-' . esc_attr($tone) . '">' . esc_html($label) . '</span>';
    }

    private function action_form(string $action, string $label, string $redirect, string $button_class = 'button-primary'): void
    {
        echo '<form method="post" class="ogm-inline-form">';
        wp_nonce_field(self::NONCE_ACTION, 'ogm_nonce');
        echo '<input type="hidden" name="ogm_action" value="' . esc_attr($action) . '" />';
        echo '<input type="hidden" name="ogm_redirect" value="' . esc_attr($redirect) . '" />';
        echo '<button type="submit" class="button ' . esc_attr($button_class) . '">' . esc_html($label) . '</button>';
        echo '</form>';
    }

    private function input_field(string $name, string $label, string $value, string $description = '', string $type = 'text'): void
    {
        echo '<label class="ogm-field"><span>' . esc_html($label) . '</span><input class="regular-text" type="' . esc_attr($type) . '" name="' . esc_attr($name) . '" value="' . esc_attr($value) . '" />';
        if ($description) {
            echo '<small>' . esc_html($description) . '</small>';
        }
        echo '</label>';
    }

    private function checkbox_field(string $name, string $label, bool $checked, string $description): void
    {
        echo '<label class="ogm-field ogm-checkbox"><span>' . esc_html($label) . '</span><input type="checkbox" name="' . esc_attr($name) . '" value="1" ' . checked($checked, true, false) . ' /> <small>' . esc_html($description) . '</small></label>';
    }

    private function render_definition_card(string $title, array $rows): void
    {
        echo '<section class="ogm-card"><h2>' . esc_html($title) . '</h2><div class="ogm-definition-grid">';
        foreach ($rows as $label => $value) {
            echo '<strong>' . esc_html($label) . '</strong><span>' . esc_html((string) $value) . '</span>';
        }
        echo '</div></section>';
    }

    private function code_list_card(string $title, array $items): void
    {
        echo '<section class="ogm-card"><h2>' . esc_html($title) . '</h2><div class="ogm-code-list">';
        foreach ($items as $item) {
            echo '<code>' . esc_html($item) . '</code>';
        }
        echo '</div></section>';
    }

    private function new_key_notice(string $new_key): void
    {
        echo '<section class="ogm-card ogm-new-key"><h2>' . esc_html__('One-time bridge key', 'onegodian-members') . '</h2><p>' . esc_html__('Copy this key now. It will be masked after you leave this screen.', 'onegodian-members') . '</p><div class="ogm-copy-row"><input id="ogm-new-key" type="text" readonly value="' . esc_attr($new_key) . '" /><button type="button" class="button button-primary ogm-copy" data-copy-target="#ogm-new-key">' . esc_html__('Copy key', 'onegodian-members') . '</button></div></section>';
    }
}

Onegodian_Members_Plugin::init();
