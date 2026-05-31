<?php
/**
 * Plugin Name: Algonquian Document Library
 * Description: Institutional document library for entity, lender, acquisition, financial controls, risk management, and property management forms.
 * Version: 1.0.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-document-library
 */

if (!defined('ABSPATH')) { exit; }

final class ALGQ_Document_Library
{
    private const TABLE = 'algq_document_library';
    private const CATEGORIES = ['entity_documents', 'lender_documents', 'acquisition_forms', 'financial_controls', 'risk_management', 'property_management_forms'];

    public function __construct()
    {
        add_shortcode('algq_document_library', [$this, 'shortcode']);
        add_action('admin_menu', [$this, 'admin_page']);
        add_action('rest_api_init', [$this, 'routes']);
    }

    public static function activate(): void
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta('CREATE TABLE ' . self::table() . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, category varchar(80) NOT NULL, title varchar(191) NOT NULL, description text NULL, file_url text NOT NULL, version varchar(40) DEFAULT '1.0', tags text NULL, access_level varchar(40) DEFAULT 'internal', created_by bigint(20) unsigned DEFAULT 0, created_at datetime NOT NULL, updated_at datetime NOT NULL, PRIMARY KEY  (id), KEY category (category), KEY access_level (access_level)) " . $wpdb->get_charset_collate() . ';');
    }

    public function admin_page(): void { add_menu_page(__('Document Library', 'algq-document-library'), __('Document Library', 'algq-document-library'), 'edit_posts', 'algq-document-library', [$this, 'admin_render'], 'dashicons-portfolio', 33); }

    public function routes(): void
    {
        register_rest_route('algq/v1', '/document-library', ['methods' => 'GET', 'callback' => fn (WP_REST_Request $request) => rest_ensure_response($this->documents(sanitize_key((string) $request->get_param('category')))), 'permission_callback' => fn () => current_user_can('edit_posts')]);
    }

    public function shortcode(): string
    {
        if (!current_user_can('edit_posts')) { return '<p>Document library access restricted.</p>'; }
        ob_start(); ?><div class="algq-document-library"><h2><?php esc_html_e('Institutional Document Library', 'algq-document-library'); ?></h2><?php foreach (self::CATEGORIES as $category) : ?><section><h3><?php echo esc_html(ucwords(str_replace('_', ' ', $category))); ?></h3><ul><?php foreach ($this->documents($category) as $doc) : ?><li><a href="<?php echo esc_url($doc['file_url']); ?>"><?php echo esc_html($doc['title']); ?></a> v<?php echo esc_html($doc['version']); ?></li><?php endforeach; ?></ul></section><?php endforeach; ?></div><?php return (string) ob_get_clean();
    }

    public function admin_render(): void { echo '<div class="wrap">' . $this->shortcode() . '</div>'; }
    private function documents(string $category = ''): array { global $wpdb; if ($category && in_array($category, self::CATEGORIES, true)) { return $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . self::table() . ' WHERE category = %s ORDER BY updated_at DESC LIMIT 100', $category), ARRAY_A) ?: []; } return $wpdb->get_results('SELECT * FROM ' . self::table() . ' ORDER BY updated_at DESC LIMIT 200', ARRAY_A) ?: []; }
    private static function table(): string { global $wpdb; return $wpdb->prefix . self::TABLE; }
}
register_activation_hook(__FILE__, ['ALGQ_Document_Library', 'activate']);
new ALGQ_Document_Library();
