<?php
/**
 * Plugin Name: Algonquian Offer Generator
 * Description: Purchase agreements, LOIs, seller-financing offers, print/PDF packets, version history, and deal merge fields.
 * Version: 0.2.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-offer-generator
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/includes/class-amortization-engine.php';

final class ALGQ_Offer_Generator
{
    private const TABLE = 'algq_offer_versions';
    private const TEMPLATES = [
        'loi' => 'Letter of Intent',
        'purchase_agreement' => 'Purchase Agreement',
        'seller_financing' => 'Seller-Financing Offer',
    ];

    public function __construct()
    {
        add_action('wp_enqueue_scripts', [$this, 'assets']);
        add_action('admin_menu', [$this, 'admin_page']);
        add_action('rest_api_init', [$this, 'routes']);
        add_shortcode('algq_offer_generator', [$this, 'shortcode']);
    }

    public static function activate(): void
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta('CREATE TABLE ' . self::table() . " (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            deal_id varchar(64) NOT NULL,
            template_type varchar(64) NOT NULL,
            version int unsigned NOT NULL DEFAULT 1,
            merge_fields longtext NOT NULL,
            rendered_document longtext NOT NULL,
            status varchar(40) DEFAULT 'draft',
            created_by bigint(20) unsigned DEFAULT 0,
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY deal_id (deal_id),
            KEY template_type (template_type),
            KEY status (status)
        ) " . $wpdb->get_charset_collate() . ';');
    }

    public function assets(): void
    {
        wp_register_style('algq-offer-generator', plugins_url('assets/css/offer-generator.css', __FILE__), [], '0.2.0');
        wp_register_script('algq-offer-generator', plugins_url('assets/js/offer-generator.js', __FILE__), [], '0.2.0', true);
    }

    public function admin_page(): void
    {
        add_menu_page(__('Offer Generator', 'algq-offer-generator'), __('Offer Generator', 'algq-offer-generator'), 'edit_posts', 'algq-offer-generator', [$this, 'admin_render'], 'dashicons-media-document', 28);
    }

    public function routes(): void
    {
        register_rest_route('algq/v1', '/offers', [
            'methods' => 'GET',
            'callback' => fn () => rest_ensure_response($this->versions()),
            'permission_callback' => fn () => current_user_can('edit_posts'),
        ]);
        register_rest_route('algq/v1', '/offers', [
            'methods' => 'POST',
            'callback' => function (WP_REST_Request $request) {
                $fields = is_array($request->get_param('merge_fields')) ? $request->get_param('merge_fields') : [];
                return rest_ensure_response($this->save_offer($fields, sanitize_key((string) $request->get_param('template_type'))));
            },
            'permission_callback' => fn () => current_user_can('edit_posts'),
        ]);
    }

    public function admin_render(): void
    {
        echo '<div class="wrap"><h1>' . esc_html__('Algonquian Offer Generator', 'algq-offer-generator') . '</h1>' . $this->shortcode([]) . '</div>';
    }

    public function shortcode($atts = []): string
    {
        wp_enqueue_style('algq-offer-generator');
        wp_enqueue_script('algq-offer-generator');
        $offer = null;
        $document = '';
        $message = '';
        $fields = $this->defaults();
        $template_type = 'seller_financing';

        if ('POST' === ($_SERVER['REQUEST_METHOD'] ?? '') && isset($_POST['algq_offer_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['algq_offer_nonce'])), 'algq_offer_generate')) {
            $fields = $this->sanitize_fields($_POST);
            $template_type = sanitize_key((string) ($_POST['template_type'] ?? 'seller_financing'));
            $engine = new ALGQ_Amortization_Engine();
            $offer = $engine->schedule((float) $fields['price'], (float) $fields['rate'], (int) $fields['term']);
            $fields['monthly_payment'] = (string) $offer['payment'];
            $fields['seller_total_income'] = (string) $offer['seller_total_income'];
            $document = $this->render_template($template_type, $fields);
            if (!empty($_POST['save_version'])) {
                $saved = $this->save_offer($fields, $template_type, $document);
                $message = sprintf(__('Saved version %d for deal %s.', 'algq-offer-generator'), (int) $saved['version'], $saved['deal_id']);
            }
        }

        ob_start();
        include __DIR__ . '/templates/app.php';
        return (string) ob_get_clean();
    }

    private function sanitize_fields(array $raw): array
    {
        return [
            'deal_id' => sanitize_text_field(wp_unslash($raw['deal_id'] ?? 'UNASSIGNED')),
            'seller_name' => sanitize_text_field(wp_unslash($raw['seller_name'] ?? 'Seller')),
            'buyer_entity' => sanitize_text_field(wp_unslash($raw['buyer_entity'] ?? 'Algonquian Real Estate')),
            'property_address' => sanitize_textarea_field(wp_unslash($raw['property_address'] ?? '')),
            'price' => (string) max(0, (float) ($raw['price'] ?? 0)),
            'rate' => (string) max(0, (float) ($raw['rate'] ?? 0)),
            'term' => (string) max(1, (int) ($raw['term'] ?? 1)),
            'down_payment' => (string) max(0, (float) ($raw['down_payment'] ?? 0)),
            'closing_date' => sanitize_text_field(wp_unslash($raw['closing_date'] ?? gmdate('Y-m-d', strtotime('+30 days')))),
            'contingencies' => sanitize_textarea_field(wp_unslash($raw['contingencies'] ?? 'Inspection, title, funding, and partner approval.')),
        ];
    }

    private function defaults(): array
    {
        return ['deal_id' => '', 'seller_name' => '', 'buyer_entity' => 'Algonquian Real Estate', 'property_address' => '', 'price' => '', 'rate' => '0', 'term' => '12', 'down_payment' => '0', 'closing_date' => gmdate('Y-m-d', strtotime('+30 days')), 'contingencies' => 'Inspection, title, funding, and partner approval.', 'monthly_payment' => '', 'seller_total_income' => ''];
    }

    private function render_template(string $type, array $fields): string
    {
        $type = isset(self::TEMPLATES[$type]) ? $type : 'seller_financing';
        $title = self::TEMPLATES[$type];
        $body = [
            'loi' => 'This non-binding LOI summarizes buyer intent to acquire {{property_address}} from {{seller_name}} for {{price}} subject to {{contingencies}}.',
            'purchase_agreement' => 'Buyer {{buyer_entity}} agrees to purchase {{property_address}} from {{seller_name}} for {{price}} with closing targeted for {{closing_date}} subject to final title and diligence.',
            'seller_financing' => 'Seller-financing proposal: purchase price {{price}}, down payment {{down_payment}}, rate {{rate}}%, term {{term}} months, monthly payment {{monthly_payment}}, total seller income {{seller_total_income}}.',
        ][$type];
        foreach ($fields as $key => $value) {
            $body = str_replace('{{' . $key . '}}', esc_html((string) $value), $body);
        }
        return '<section class="algq-offer-document" data-template="' . esc_attr($type) . '"><h2>' . esc_html($title) . '</h2><p>' . $body . '</p><p><strong>Deal:</strong> ' . esc_html($fields['deal_id']) . '</p><p><em>Generated ' . esc_html(gmdate('Y-m-d H:i:s')) . ' UTC</em></p></section>';
    }

    private function save_offer(array $fields, string $template_type, string $document = ''): array
    {
        global $wpdb;
        $template_type = isset(self::TEMPLATES[$template_type]) ? $template_type : 'seller_financing';
        $deal_id = $fields['deal_id'] ?: 'UNASSIGNED';
        $version = 1 + (int) $wpdb->get_var($wpdb->prepare('SELECT MAX(version) FROM ' . self::table() . ' WHERE deal_id = %s AND template_type = %s', $deal_id, $template_type));
        $document = $document ?: $this->render_template($template_type, $fields);
        $wpdb->insert(self::table(), ['deal_id' => $deal_id, 'template_type' => $template_type, 'version' => $version, 'merge_fields' => wp_json_encode($fields), 'rendered_document' => wp_kses_post($document), 'status' => 'draft', 'created_by' => get_current_user_id(), 'created_at' => gmdate('Y-m-d H:i:s')]);
        return ['id' => (int) $wpdb->insert_id, 'deal_id' => $deal_id, 'template_type' => $template_type, 'version' => $version];
    }

    private function versions(): array
    {
        global $wpdb;
        return $wpdb->get_results('SELECT id, deal_id, template_type, version, status, created_at FROM ' . self::table() . ' ORDER BY created_at DESC LIMIT 100', ARRAY_A) ?: [];
    }

    private static function table(): string
    {
        global $wpdb;
        return $wpdb->prefix . self::TABLE;
    }
}

register_activation_hook(__FILE__, ['ALGQ_Offer_Generator', 'activate']);
new ALGQ_Offer_Generator();
