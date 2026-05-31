<?php
/**
 * Plugin Name: Algonquian Buyer Portal
 * Description: Buyer registration, NDA gating, download permissions, deal package delivery, and interest submission workflow.
 * Version: 0.2.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-buyer-portal
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Buyer_Portal
{
    private const PACKAGES_TABLE = 'algq_buyer_deal_packages';
    private const INTEREST_TABLE = 'algq_buyer_interest';
    private const INTEREST_STAGES = ['interested', 'requested_call', 'offer_submitted', 'assigned'];

    public function __construct()
    {
        add_shortcode('algq_buyer_portal', [$this, 'shortcode']);
        add_action('admin_menu', [$this, 'admin_page']);
        add_action('rest_api_init', [$this, 'routes']);
        add_action('admin_post_algq_buyer_interest', [$this, 'submit_interest']);
    }

    public static function activate(): void
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();
        dbDelta('CREATE TABLE ' . self::table(self::PACKAGES_TABLE) . " (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            deal_id varchar(64) NOT NULL,
            title varchar(191) NOT NULL,
            package_url text NOT NULL,
            requires_nda tinyint(1) DEFAULT 1,
            allowed_roles text NULL,
            premium_only tinyint(1) DEFAULT 0,
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY deal_id (deal_id),
            KEY premium_only (premium_only)
        ) {$charset};");
        dbDelta('CREATE TABLE ' . self::table(self::INTEREST_TABLE) . " (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            package_id bigint(20) unsigned NOT NULL,
            deal_id varchar(64) NOT NULL,
            buyer_user_id bigint(20) unsigned NOT NULL,
            stage varchar(64) DEFAULT 'interested',
            message text NULL,
            submitted_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY package_id (package_id),
            KEY buyer_user_id (buyer_user_id),
            KEY stage (stage)
        ) {$charset};");
    }

    public function admin_page(): void
    {
        add_menu_page(__('Buyer Portal', 'algq-buyer-portal'), __('Buyer Portal', 'algq-buyer-portal'), 'edit_posts', 'algq-buyer-portal', [$this, 'admin_render'], 'dashicons-groups', 29);
    }

    public function routes(): void
    {
        register_rest_route('algq/v1', '/buyer/packages', ['methods' => 'GET', 'callback' => fn () => rest_ensure_response($this->packages_for_user(get_current_user_id())), 'permission_callback' => fn () => is_user_logged_in()]);
        register_rest_route('algq/v1', '/buyer/interest', ['methods' => 'POST', 'callback' => function (WP_REST_Request $request) {
            return rest_ensure_response($this->record_interest((int) $request->get_param('package_id'), sanitize_textarea_field((string) $request->get_param('message'))));
        }, 'permission_callback' => fn () => is_user_logged_in()]);
    }

    public function admin_render(): void
    {
        echo '<div class="wrap"><h1>' . esc_html__('Algonquian Buyer Portal', 'algq-buyer-portal') . '</h1><p>' . esc_html__('Manage buyer profiles, NDA-gated deal packages, download permissions, and submitted interest.', 'algq-buyer-portal') . '</p></div>';
    }

    public function shortcode(): string
    {
        if (!is_user_logged_in()) {
            return '<div class="algq-buyer-login"><p>' . esc_html__('Please log in or register to access buyer deals.', 'algq-buyer-portal') . '</p>' . wp_login_form(['echo' => false]) . wp_register('', '', false) . '</div>';
        }

        $user_id = get_current_user_id();
        $notice = '';
        if ('POST' === ($_SERVER['REQUEST_METHOD'] ?? '') && isset($_POST['algq_buyer_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['algq_buyer_nonce'])), 'algq_buyer_profile')) {
            $this->save_profile($user_id, $_POST);
            $notice = __('Buyer profile saved.', 'algq-buyer-portal');
        }

        $packages = $this->packages_for_user($user_id);
        ob_start();
        ?>
        <div class="algq-buyer-portal">
            <?php if ($notice) : ?><p class="algq-success"><?php echo esc_html($notice); ?></p><?php endif; ?>
            <form class="algq-buyer-profile" method="post">
                <?php wp_nonce_field('algq_buyer_profile', 'algq_buyer_nonce'); ?>
                <p><label><?php esc_html_e('Markets', 'algq-buyer-portal'); ?> <input name="markets" value="<?php echo esc_attr(get_user_meta($user_id, 'algq_markets', true)); ?>" /></label></p>
                <p><label><?php esc_html_e('Cash Available', 'algq-buyer-portal'); ?> <input name="cash_available" type="number" min="0" step="0.01" value="<?php echo esc_attr(get_user_meta($user_id, 'algq_cash_available', true)); ?>" /></label></p>
                <p><label><?php esc_html_e('Buy Box', 'algq-buyer-portal'); ?> <textarea name="buy_box"><?php echo esc_textarea(get_user_meta($user_id, 'algq_buy_box', true)); ?></textarea></label></p>
                <p><label><?php esc_html_e('Property Types', 'algq-buyer-portal'); ?> <input name="property_types" value="<?php echo esc_attr(get_user_meta($user_id, 'algq_property_types', true)); ?>" /></label></p>
                <p><label><input name="nda_accepted" type="checkbox" value="1" <?php checked(get_user_meta($user_id, 'algq_nda_accepted', true), 'yes'); ?> /> <?php esc_html_e('NDA accepted', 'algq-buyer-portal'); ?></label></p>
                <p><button type="submit"><?php esc_html_e('Save Profile', 'algq-buyer-portal'); ?></button></p>
            </form>
            <h3><?php esc_html_e('Available Deal Packages', 'algq-buyer-portal'); ?></h3>
            <?php foreach ($packages as $package) : ?>
                <article class="algq-deal-package">
                    <h4><?php echo esc_html($package['title']); ?></h4>
                    <?php if (!$package['can_download']) : ?><p><?php esc_html_e('NDA acceptance or buyer permissions required before download.', 'algq-buyer-portal'); ?></p><?php else : ?><p><a href="<?php echo esc_url($package['package_url']); ?>"><?php esc_html_e('Download deal package', 'algq-buyer-portal'); ?></a></p><?php endif; ?>
                    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                        <?php wp_nonce_field('algq_buyer_interest_' . (int) $package['id']); ?>
                        <input type="hidden" name="action" value="algq_buyer_interest" />
                        <input type="hidden" name="package_id" value="<?php echo esc_attr((string) $package['id']); ?>" />
                        <textarea name="message" placeholder="<?php esc_attr_e('Interest notes, proof of funds, requested call time...', 'algq-buyer-portal'); ?>"></textarea>
                        <button type="submit"><?php esc_html_e('Submit Interest', 'algq-buyer-portal'); ?></button>
                    </form>
                </article>
            <?php endforeach; ?>
        </div>
        <?php
        return (string) ob_get_clean();
    }

    public function submit_interest(): void
    {
        $package_id = (int) ($_POST['package_id'] ?? 0);
        check_admin_referer('algq_buyer_interest_' . $package_id);
        $this->record_interest($package_id, sanitize_textarea_field(wp_unslash($_POST['message'] ?? '')));
        wp_safe_redirect(wp_get_referer() ?: home_url('/'));
        exit;
    }

    private function save_profile(int $user_id, array $raw): void
    {
        update_user_meta($user_id, 'algq_markets', sanitize_text_field(wp_unslash($raw['markets'] ?? '')));
        update_user_meta($user_id, 'algq_cash_available', (float) ($raw['cash_available'] ?? 0));
        update_user_meta($user_id, 'algq_buy_box', sanitize_textarea_field(wp_unslash($raw['buy_box'] ?? '')));
        update_user_meta($user_id, 'algq_property_types', sanitize_text_field(wp_unslash($raw['property_types'] ?? '')));
        update_user_meta($user_id, 'algq_nda_accepted', !empty($raw['nda_accepted']) ? 'yes' : 'no');
    }

    private function packages_for_user(int $user_id): array
    {
        global $wpdb;
        $rows = $wpdb->get_results('SELECT * FROM ' . self::table(self::PACKAGES_TABLE) . ' ORDER BY created_at DESC LIMIT 100', ARRAY_A) ?: [];
        return array_map(function (array $row) use ($user_id): array {
            $has_nda = 'yes' === get_user_meta($user_id, 'algq_nda_accepted', true);
            $row['can_download'] = empty($row['requires_nda']) || $has_nda || current_user_can('edit_posts');
            return $row;
        }, $rows);
    }

    private function record_interest(int $package_id, string $message): array
    {
        global $wpdb;
        $package = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . self::table(self::PACKAGES_TABLE) . ' WHERE id = %d', $package_id), ARRAY_A);
        if (!$package) {
            return ['error' => 'missing_package'];
        }
        $now = gmdate('Y-m-d H:i:s');
        $wpdb->insert(self::table(self::INTEREST_TABLE), ['package_id' => $package_id, 'deal_id' => $package['deal_id'], 'buyer_user_id' => get_current_user_id(), 'stage' => self::INTEREST_STAGES[0], 'message' => $message, 'submitted_at' => $now, 'updated_at' => $now]);
        return ['id' => (int) $wpdb->insert_id, 'stage' => self::INTEREST_STAGES[0]];
    }

    private static function table(string $table): string
    {
        global $wpdb;
        return $wpdb->prefix . $table;
    }
}

register_activation_hook(__FILE__, ['ALGQ_Buyer_Portal', 'activate']);
new ALGQ_Buyer_Portal();
