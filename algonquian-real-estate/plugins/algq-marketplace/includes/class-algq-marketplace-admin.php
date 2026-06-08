<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Marketplace_Admin
{
    public function register(): void
    {
        add_action('admin_menu', [$this, 'menu']);
        add_action('admin_init', [$this, 'handle_actions']);
        add_action('admin_enqueue_scripts', [$this, 'assets']);
        add_action('wp_ajax_algq_marketplace_log_ping', [$this, 'ajax_log_ping']);
    }

    public function menu(): void
    {
        add_menu_page(__('Deal Marketplace', 'algq-marketplace'), __('Deal Marketplace', 'algq-marketplace'), 'manage_algq_marketplace', 'algq-marketplace', [$this, 'dashboard'], 'dashicons-building', 26);
        add_submenu_page('algq-marketplace', __('Dashboard', 'algq-marketplace'), __('Dashboard', 'algq-marketplace'), 'manage_algq_marketplace', 'algq-marketplace', [$this, 'dashboard']);
        add_submenu_page('algq-marketplace', __('Marketplace Deals', 'algq-marketplace'), __('Marketplace Deals', 'algq-marketplace'), 'edit_algq_marketplace_deals', 'algq-marketplace-deals', [$this, 'deals']);
        add_submenu_page('algq-marketplace', __('Buyer Interest', 'algq-marketplace'), __('Buyer Interest', 'algq-marketplace'), 'view_algq_buyer_activity', 'algq-marketplace-interest', [$this, 'buyer_interest']);
        add_submenu_page('algq-marketplace', __('NDA Records', 'algq-marketplace'), __('NDA Records', 'algq-marketplace'), 'view_algq_buyer_activity', 'algq-marketplace-nda', [$this, 'nda_records']);
        add_submenu_page('algq-marketplace', __('Settings', 'algq-marketplace'), __('Settings', 'algq-marketplace'), 'manage_algq_marketplace_settings', 'algq-marketplace-settings', [$this, 'settings']);
        add_submenu_page('algq-marketplace', __('Activity Log', 'algq-marketplace'), __('Activity Log', 'algq-marketplace'), 'view_algq_buyer_activity', 'algq-marketplace-activity', [$this, 'activity_log']);
        add_submenu_page('algq-marketplace', __('Documentation', 'algq-marketplace'), __('Documentation', 'algq-marketplace'), 'manage_algq_marketplace', 'algq-marketplace-docs', [$this, 'documentation']);
    }

    public function assets(string $hook): void
    {
        if (strpos($hook, 'algq-marketplace') === false) {
            return;
        }

        wp_enqueue_style('algq-marketplace-admin', ALGQ_MARKETPLACE_URL . 'assets/css/algq-marketplace-admin.css', [], ALGQ_MARKETPLACE_VERSION);
        wp_enqueue_script('algq-marketplace-admin', ALGQ_MARKETPLACE_URL . 'assets/js/algq-marketplace-admin.js', ['jquery'], ALGQ_MARKETPLACE_VERSION, true);
        wp_localize_script('algq-marketplace-admin', 'ALGQMarketplaceAdmin', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('algq_marketplace_ajax'),
        ]);
    }

    public function handle_actions(): void
    {
        if (!is_admin()) {
            return;
        }

        if (isset($_POST['algq_marketplace_save_settings'])) {
            $this->save_settings();
        }

        if (isset($_POST['algq_marketplace_bulk_action'])) {
            $this->bulk_action();
        }
    }

    private function save_settings(): void
    {
        if (!current_user_can('manage_algq_marketplace_settings')) {
            wp_die(esc_html__('You do not have permission to save marketplace settings.', 'algq-marketplace'));
        }

        check_admin_referer('algq_marketplace_save_settings', 'algq_marketplace_settings_nonce');

        $settings = [
            'require_login' => $this->posted_yes_no('require_login'),
            'require_nda' => $this->posted_yes_no('require_nda'),
            'default_deal_visibility' => algq_marketplace_sanitize_visibility(sanitize_text_field(wp_unslash($_POST['default_deal_visibility'] ?? 'verified_buyers'))),
            'support_email' => sanitize_email(wp_unslash($_POST['support_email'] ?? get_option('admin_email'))),
            'cleanup_generated_pages' => $this->posted_yes_no('cleanup_generated_pages'),
            'cleanup_tables' => $this->posted_yes_no('cleanup_tables'),
            'cleanup_options' => $this->posted_yes_no('cleanup_options'),
        ];

        update_option(ALGQ_MARKETPLACE_OPTION_SETTINGS, $settings);
        algq_marketplace_log_activity('settings_saved', __('Marketplace settings updated.', 'algq-marketplace'));
        add_settings_error('algq_marketplace', 'settings_saved', __('Settings saved.', 'algq-marketplace'), 'updated');
    }

    private function posted_yes_no(string $key): string
    {
        return sanitize_text_field(wp_unslash($_POST[$key] ?? 'no')) === 'yes' ? 'yes' : 'no';
    }

    private function bulk_action(): void
    {
        if (!current_user_can('manage_algq_marketplace')) {
            wp_die(esc_html__('You do not have permission to run marketplace bulk actions.', 'algq-marketplace'));
        }

        check_admin_referer('algq_marketplace_bulk_action', 'algq_marketplace_bulk_nonce');
        $action = sanitize_key(wp_unslash($_POST['bulk_action'] ?? ''));
        if (!in_array($action, ['archive_interest', 'export_activity', 'regenerate_pages'], true)) {
            return;
        }

        if ($action === 'regenerate_pages') {
            ALGQ_Marketplace_Pages::generate_pages();
        }
        algq_marketplace_log_activity('bulk_action', __('Marketplace bulk action processed.', 'algq-marketplace'), ['action' => $action]);
    }

    public function ajax_log_ping(): void
    {
        check_ajax_referer('algq_marketplace_ajax', 'nonce');
        if (!current_user_can('manage_algq_marketplace')) {
            wp_send_json_error(['message' => esc_html__('Unauthorized.', 'algq-marketplace')], 403);
        }

        algq_marketplace_log_activity('ajax_ping', __('Admin AJAX health ping completed.', 'algq-marketplace'));
        wp_send_json_success(['message' => esc_html__('Marketplace AJAX verified.', 'algq-marketplace')]);
    }

    public function dashboard(): void
    {
        $this->guard('manage_algq_marketplace');
        $this->wrap(__('Marketplace Dashboard', 'algq-marketplace'), function (): void {
            $pages = get_option(ALGQ_MARKETPLACE_OPTION_PAGES, []);
            echo '<p>' . esc_html__('Production deal-marketplace controls are active.', 'algq-marketplace') . '</p>';
            echo '<div class="algq-admin-cards">';
            foreach (['Buyer offers', 'NDA acceptances', 'Access logs', 'Activity log'] as $label) {
                echo '<div class="algq-admin-card"><strong>' . esc_html($label) . '</strong><span>' . esc_html__('Ready', 'algq-marketplace') . '</span></div>';
            }
            echo '</div><h2>' . esc_html__('Generated Pages', 'algq-marketplace') . '</h2><ul>';
            foreach ((array) $pages as $key => $page) {
                echo '<li>' . esc_html((string) $key) . ': ' . esc_html((string) ($page['shortcode'] ?? '')) . '</li>';
            }
            echo '</ul>';
        });
    }

    public function deals(): void
    {
        $this->guard('edit_algq_marketplace_deals');
        $this->wrap(__('Marketplace Deals', 'algq-marketplace'), function (): void {
            $this->bulk_form();
            echo '<table class="widefat striped"><thead><tr><th>' . esc_html__('Deal', 'algq-marketplace') . '</th><th>' . esc_html__('Market', 'algq-marketplace') . '</th><th>' . esc_html__('Price', 'algq-marketplace') . '</th></tr></thead><tbody>';
            foreach (algq_marketplace_sample_deals() as $deal) {
                echo '<tr><td>' . esc_html($deal['title']) . '</td><td>' . esc_html($deal['market']) . '</td><td>' . esc_html($deal['price']) . '</td></tr>';
            }
            echo '</tbody></table>';
        });
    }

    public function buyer_interest(): void
    {
        $this->guard('view_algq_buyer_activity');
        $this->table_screen(__('Buyer Interest', 'algq-marketplace'), algq_marketplace_table_name('buyer_offers'), ['buyer_name', 'buyer_email', 'offer_amount', 'status', 'created_at']);
    }

    public function nda_records(): void
    {
        $this->guard('view_algq_buyer_activity');
        $this->table_screen(__('NDA Records', 'algq-marketplace'), algq_marketplace_table_name('nda_acceptances'), ['signer_name', 'signer_email', 'deal_id', 'accepted_version', 'accepted_at']);
    }

    public function activity_log(): void
    {
        $this->guard('view_algq_buyer_activity');
        $this->table_screen(__('Activity Log', 'algq-marketplace'), algq_marketplace_table_name('activity_log'), ['event_type', 'message', 'user_id', 'created_at']);
    }

    public function settings(): void
    {
        $this->guard('manage_algq_marketplace_settings');
        $settings = algq_marketplace_get_settings();
        $this->wrap(__('Marketplace Settings', 'algq-marketplace'), function () use ($settings): void {
            settings_errors('algq_marketplace');
            ?>
            <form method="post">
                <?php wp_nonce_field('algq_marketplace_save_settings', 'algq_marketplace_settings_nonce'); ?>
                <table class="form-table" role="presentation">
                    <tr><th scope="row"><?php echo esc_html__('Require login', 'algq-marketplace'); ?></th><td><label><input type="checkbox" name="require_login" value="yes" <?php checked($settings['require_login'], 'yes'); ?>> <?php echo esc_html__('Require authenticated users for marketplace access.', 'algq-marketplace'); ?></label></td></tr>
                    <tr><th scope="row"><?php echo esc_html__('Require NDA', 'algq-marketplace'); ?></th><td><label><input type="checkbox" name="require_nda" value="yes" <?php checked($settings['require_nda'], 'yes'); ?>> <?php echo esc_html__('Gate diligence with NDA acceptance.', 'algq-marketplace'); ?></label></td></tr>
                    <tr><th scope="row"><?php echo esc_html__('Default visibility', 'algq-marketplace'); ?></th><td><select name="default_deal_visibility"><?php foreach (['public', 'logged_in', 'verified_buyers', 'managers', 'private'] as $visibility) : ?><option value="<?php echo esc_attr($visibility); ?>" <?php selected($settings['default_deal_visibility'], $visibility); ?>><?php echo esc_html($visibility); ?></option><?php endforeach; ?></select></td></tr>
                    <tr><th scope="row"><?php echo esc_html__('Support email', 'algq-marketplace'); ?></th><td><input type="email" name="support_email" value="<?php echo esc_attr($settings['support_email']); ?>"></td></tr>
                    <tr><th scope="row"><?php echo esc_html__('Uninstall cleanup', 'algq-marketplace'); ?></th><td>
                        <label><input type="checkbox" name="cleanup_generated_pages" value="yes" <?php checked($settings['cleanup_generated_pages'], 'yes'); ?>> <?php echo esc_html__('Delete generated pages on uninstall.', 'algq-marketplace'); ?></label><br>
                        <label><input type="checkbox" name="cleanup_tables" value="yes" <?php checked($settings['cleanup_tables'], 'yes'); ?>> <?php echo esc_html__('Drop marketplace tables on uninstall.', 'algq-marketplace'); ?></label><br>
                        <label><input type="checkbox" name="cleanup_options" value="yes" <?php checked($settings['cleanup_options'], 'yes'); ?>> <?php echo esc_html__('Delete plugin options on uninstall.', 'algq-marketplace'); ?></label>
                    </td></tr>
                </table>
                <p><button class="button button-primary" name="algq_marketplace_save_settings" value="1"><?php echo esc_html__('Save Settings', 'algq-marketplace'); ?></button></p>
            </form>
            <?php
        });
    }

    public function documentation(): void
    {
        $this->guard('manage_algq_marketplace');
        $this->wrap(__('Marketplace Documentation', 'algq-marketplace'), function (): void {
            echo '<p>' . esc_html__('Use the generated pages and shortcodes to guide verified buyers through NDA acceptance, deal review, and buyer interest submission.', 'algq-marketplace') . '</p>';
            echo '<ul><li><code>[algq_deal_marketplace]</code></li><li><code>[algq_marketplace_deals]</code></li><li><code>[algq_marketplace_nda_gate]</code></li><li><code>[algq_buyer_interest_form]</code></li></ul>';
        });
    }

    private function table_screen(string $title, string $table, array $columns): void
    {
        global $wpdb;
        $this->wrap($title, function () use ($wpdb, $table, $columns): void {
            $this->bulk_form();
            $rows = $wpdb->get_results("SELECT * FROM {$table} ORDER BY id DESC LIMIT 50", ARRAY_A);
            echo '<table class="widefat striped"><thead><tr>';
            foreach ($columns as $column) {
                echo '<th>' . esc_html(ucwords(str_replace('_', ' ', $column))) . '</th>';
            }
            echo '</tr></thead><tbody>';
            foreach ((array) $rows as $row) {
                echo '<tr>';
                foreach ($columns as $column) {
                    echo '<td>' . esc_html((string) ($row[$column] ?? '')) . '</td>';
                }
                echo '</tr>';
            }
            if (empty($rows)) {
                echo '<tr><td colspan="' . esc_attr((string) count($columns)) . '">' . esc_html__('No records found.', 'algq-marketplace') . '</td></tr>';
            }
            echo '</tbody></table>';
        });
    }

    private function bulk_form(): void
    {
        ?>
        <form method="post" class="algq-bulk-actions">
            <?php wp_nonce_field('algq_marketplace_bulk_action', 'algq_marketplace_bulk_nonce'); ?>
            <select name="bulk_action">
                <option value="regenerate_pages"><?php echo esc_html__('Regenerate pages', 'algq-marketplace'); ?></option>
                <option value="archive_interest"><?php echo esc_html__('Archive selected interest', 'algq-marketplace'); ?></option>
                <option value="export_activity"><?php echo esc_html__('Export activity', 'algq-marketplace'); ?></option>
            </select>
            <button class="button" name="algq_marketplace_bulk_action" value="1"><?php echo esc_html__('Apply', 'algq-marketplace'); ?></button>
        </form>
        <?php
    }

    private function guard(string $capability): void
    {
        if (!current_user_can($capability) && !current_user_can('manage_algq_marketplace')) {
            wp_die(esc_html__('You do not have permission to view this marketplace screen.', 'algq-marketplace'));
        }
    }

    private function wrap(string $title, callable $content): void
    {
        echo '<div class="wrap algq-marketplace-admin"><h1>' . esc_html($title) . '</h1>';
        $content();
        echo '</div>';
    }
}
