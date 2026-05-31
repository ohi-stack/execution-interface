<?php
/**
 * Plugin Name: Algonquian PDF & Signature Engine
 * Description: PDF rendering, signature workflow, document archive, and execution status tracking.
 * Version: 1.0.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-pdf-signature
 */

if (!defined('ABSPATH')) { exit; }

final class ALGQ_PDF_Signature
{
    private const DOCS = 'algq_documents';
    private const SIGNATURES = 'algq_signature_requests';
    private const STATUSES = ['draft', 'rendered', 'sent_for_signature', 'viewed', 'signed', 'voided', 'archived'];

    public function __construct()
    {
        add_shortcode('algq_document_archive', [$this, 'shortcode']);
        add_action('admin_menu', [$this, 'admin_page']);
        add_action('rest_api_init', [$this, 'routes']);
        add_action('algq_document_generation_requested', [$this, 'create_from_payload']);
    }

    public static function activate(): void
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();
        dbDelta('CREATE TABLE ' . self::table(self::DOCS) . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, deal_id varchar(64) DEFAULT '', document_type varchar(80) NOT NULL, title varchar(191) NOT NULL, html_body longtext NOT NULL, pdf_url text NULL, archive_status varchar(40) DEFAULT 'draft', version int unsigned DEFAULT 1, created_by bigint(20) unsigned DEFAULT 0, created_at datetime NOT NULL, updated_at datetime NOT NULL, PRIMARY KEY  (id), KEY deal_id (deal_id), KEY document_type (document_type), KEY archive_status (archive_status)) {$charset};");
        dbDelta('CREATE TABLE ' . self::table(self::SIGNATURES) . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, document_id bigint(20) unsigned NOT NULL, signer_name varchar(191) NOT NULL, signer_email varchar(191) NOT NULL, signature_token varchar(128) NOT NULL, execution_status varchar(40) DEFAULT 'sent_for_signature', sent_at datetime NOT NULL, viewed_at datetime NULL, signed_at datetime NULL, audit_log longtext NULL, PRIMARY KEY  (id), UNIQUE KEY signature_token (signature_token), KEY document_id (document_id), KEY execution_status (execution_status)) {$charset};");
    }

    public function admin_page(): void { add_menu_page(__('PDF & Signature', 'algq-pdf-signature'), __('PDF & Signature', 'algq-pdf-signature'), 'edit_posts', 'algq-pdf-signature', [$this, 'admin_render'], 'dashicons-media-default', 32); }

    public function routes(): void
    {
        register_rest_route('algq/v1', '/documents', ['methods' => 'GET', 'callback' => fn () => rest_ensure_response($this->documents()), 'permission_callback' => fn () => current_user_can('edit_posts')]);
        register_rest_route('algq/v1', '/documents/render', ['methods' => 'POST', 'callback' => function (WP_REST_Request $request) { return rest_ensure_response($this->create_document((array) $request->get_params())); }, 'permission_callback' => fn () => current_user_can('edit_posts')]);
        register_rest_route('algq/v1', '/signatures/request', ['methods' => 'POST', 'callback' => function (WP_REST_Request $request) { return rest_ensure_response($this->request_signature((int) $request->get_param('document_id'), sanitize_text_field((string) $request->get_param('signer_name')), sanitize_email((string) $request->get_param('signer_email')))); }, 'permission_callback' => fn () => current_user_can('edit_posts')]);
    }

    public function shortcode(): string
    {
        if (!current_user_can('edit_posts')) { return '<p>Document archive access restricted.</p>'; }
        $docs = $this->documents();
        ob_start(); ?><div class="algq-document-archive"><h2><?php esc_html_e('Document Archive', 'algq-pdf-signature'); ?></h2><ul><?php foreach ($docs as $doc) : ?><li><?php echo esc_html($doc['title'] . ' — ' . $doc['archive_status']); ?></li><?php endforeach; ?></ul></div><?php return (string) ob_get_clean();
    }

    public function admin_render(): void { echo '<div class="wrap">' . $this->shortcode() . '</div>'; }

    public function create_from_payload(array $payload): void { $this->create_document($payload); }

    private function create_document(array $data): array
    {
        global $wpdb;
        $now = gmdate('Y-m-d H:i:s');
        $title = sanitize_text_field((string) ($data['title'] ?? 'Deal Document'));
        $html = wp_kses_post((string) ($data['html_body'] ?? '<h1>' . esc_html($title) . '</h1>'));
        $wpdb->insert(self::table(self::DOCS), ['deal_id' => sanitize_text_field((string) ($data['deal_id'] ?? '')), 'document_type' => sanitize_key((string) ($data['document_type'] ?? 'deal_document')), 'title' => $title, 'html_body' => $html, 'pdf_url' => esc_url_raw((string) ($data['pdf_url'] ?? '')), 'archive_status' => 'rendered', 'version' => (int) ($data['version'] ?? 1), 'created_by' => get_current_user_id(), 'created_at' => $now, 'updated_at' => $now]);
        return ['id' => (int) $wpdb->insert_id, 'status' => 'rendered'];
    }

    private function request_signature(int $document_id, string $name, string $email): array
    {
        global $wpdb;
        $token = wp_generate_password(48, false, false);
        $now = gmdate('Y-m-d H:i:s');
        $wpdb->insert(self::table(self::SIGNATURES), ['document_id' => $document_id, 'signer_name' => $name, 'signer_email' => $email, 'signature_token' => $token, 'execution_status' => 'sent_for_signature', 'sent_at' => $now, 'audit_log' => wp_json_encode([['event' => 'sent_for_signature', 'at' => $now]])]);
        $wpdb->update(self::table(self::DOCS), ['archive_status' => 'sent_for_signature', 'updated_at' => $now], ['id' => $document_id]);
        wp_mail($email, 'Signature requested', 'Please review and sign document #' . $document_id);
        return ['id' => (int) $wpdb->insert_id, 'execution_status' => 'sent_for_signature', 'token' => $token];
    }

    private function documents(): array { global $wpdb; return $wpdb->get_results('SELECT id, deal_id, document_type, title, pdf_url, archive_status, version, created_at FROM ' . self::table(self::DOCS) . ' ORDER BY updated_at DESC LIMIT 100', ARRAY_A) ?: []; }
    private static function table(string $table): string { global $wpdb; return $wpdb->prefix . $table; }
}
register_activation_hook(__FILE__, ['ALGQ_PDF_Signature', 'activate']);
new ALGQ_PDF_Signature();
