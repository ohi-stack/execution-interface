<?php
/**
 * Plugin Name: Algonquian Deal Intake
 * Description: Seller lead intake, property capture, deal ID generation, and admin review for Algonquian Real Estate.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Intake_Plugin
{
    public const VERSION = '0.1.0';
    public const TABLE = 'algq_deals';

    public function __construct()
    {
        add_shortcode('algq_deal_intake', [$this, 'render_shortcode']);
        add_action('admin_menu', [$this, 'register_admin_page']);
    }

    public static function activate(): void
    {
        global $wpdb;
        $table = $wpdb->prefix . self::TABLE;
        $charset = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$table} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            deal_id varchar(32) NOT NULL,
            address text NOT NULL,
            seller_name varchar(191) NOT NULL,
            seller_phone varchar(64) NOT NULL,
            asking_price decimal(12,2) DEFAULT 0,
            condition_notes longtext NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY deal_id (deal_id)
        ) {$charset};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }

    public function render_shortcode(): string
    {
        $message = '';
        if ('POST' === ($_SERVER['REQUEST_METHOD'] ?? '') && isset($_POST['algq_deal_intake_nonce'])) {
            $message = $this->handle_submission();
        }

        ob_start();
        ?>
        <form class="algq-deal-intake" method="post">
            <?php wp_nonce_field('algq_deal_intake_submit', 'algq_deal_intake_nonce'); ?>
            <input type="text" name="algq_website" value="" style="display:none" tabindex="-1" autocomplete="off" />
            <?php echo wp_kses_post($message); ?>
            <p><label>Seller Name <input required name="seller_name" type="text" /></label></p>
            <p><label>Seller Phone <input required name="seller_phone" type="tel" /></label></p>
            <p><label>Property Address <textarea required name="address"></textarea></label></p>
            <p><label>Asking Price <input name="asking_price" type="number" min="0" step="0.01" /></label></p>
            <p><label>Condition Notes <textarea name="condition_notes"></textarea></label></p>
            <p><button type="submit">Submit Deal</button></p>
        </form>
        <?php
        return (string) ob_get_clean();
    }

    private function handle_submission(): string
    {
        if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['algq_deal_intake_nonce'] ?? '')), 'algq_deal_intake_submit')) {
            return '<div class="algq-error">Security check failed.</div>';
        }

        if (!empty($_POST['algq_website'])) {
            return '<div class="algq-error">Submission blocked.</div>';
        }

        $seller_name = sanitize_text_field(wp_unslash($_POST['seller_name'] ?? ''));
        $seller_phone = sanitize_text_field(wp_unslash($_POST['seller_phone'] ?? ''));
        $address = sanitize_textarea_field(wp_unslash($_POST['address'] ?? ''));
        $asking_price = (float) ($_POST['asking_price'] ?? 0);
        $condition_notes = sanitize_textarea_field(wp_unslash($_POST['condition_notes'] ?? ''));

        if ('' === $seller_name || '' === $seller_phone || '' === $address) {
            return '<div class="algq-error">Name, phone, and address are required.</div>';
        }

        global $wpdb;
        $deal_id = $this->generate_deal_id();
        $wpdb->insert(
            $wpdb->prefix . self::TABLE,
            [
                'deal_id' => $deal_id,
                'address' => $address,
                'seller_name' => $seller_name,
                'seller_phone' => $seller_phone,
                'asking_price' => $asking_price,
                'condition_notes' => $condition_notes,
                'created_at' => current_time('mysql'),
            ],
            ['%s', '%s', '%s', '%s', '%f', '%s', '%s']
        );

        wp_mail(get_option('admin_email'), 'New seller lead: ' . $deal_id, "A new deal was submitted for {$address}.");

        return '<div class="algq-success">Deal submitted. Reference ID: ' . esc_html($deal_id) . '</div>';
    }

    private function generate_deal_id(): string
    {
        return 'ALGQ-' . gmdate('Ymd') . '-' . strtoupper(wp_generate_password(6, false, false));
    }

    public function register_admin_page(): void
    {
        add_menu_page('Algonquian Deals', 'Algonquian Deals', 'manage_options', 'algq-deals', [$this, 'render_admin_page'], 'dashicons-building', 26);
    }

    public function render_admin_page(): void
    {
        global $wpdb;
        $rows = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}" . self::TABLE . ' ORDER BY created_at DESC LIMIT 50');
        echo '<div class="wrap"><h1>Algonquian Deals</h1><table class="widefat"><thead><tr><th>Deal ID</th><th>Seller</th><th>Phone</th><th>Address</th><th>Asking</th><th>Created</th></tr></thead><tbody>';
        foreach ($rows as $row) {
            echo '<tr><td>' . esc_html($row->deal_id) . '</td><td>' . esc_html($row->seller_name) . '</td><td>' . esc_html($row->seller_phone) . '</td><td>' . esc_html($row->address) . '</td><td>' . esc_html(number_format((float) $row->asking_price, 2)) . '</td><td>' . esc_html($row->created_at) . '</td></tr>';
        }
        echo '</tbody></table></div>';
    }
}

register_activation_hook(__FILE__, ['ALGQ_Deal_Intake_Plugin', 'activate']);
new ALGQ_Deal_Intake_Plugin();
