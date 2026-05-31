<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_PDF_Signature_Admin
{
    private ALGQ_PDF_Signature_Repository $repository;
    private ALGQ_PDF_Signature_Renderer $renderer;

    public function __construct(ALGQ_PDF_Signature_Repository $repository, ALGQ_PDF_Signature_Renderer $renderer)
    {
        $this->repository = $repository;
        $this->renderer = $renderer;
    }

    public function register(): void
    {
        add_action('admin_menu', [$this, 'register_admin_page']);
        add_action('admin_post_algq_document_create', [$this, 'handle_create']);
        add_action('admin_post_algq_document_send', [$this, 'handle_send']);
        add_action('admin_post_algq_document_archive', [$this, 'handle_archive']);
        add_action('admin_post_algq_document_void', [$this, 'handle_void']);
        add_action('admin_post_algq_document_pdf', [$this, 'handle_pdf']);
    }

    public function register_admin_page(): void
    {
        add_menu_page('PDF & Signatures', 'PDF & Signatures', 'manage_options', 'algq-documents', [$this, 'render_admin_page'], 'dashicons-media-document', 27);
    }

    public function handle_create(): void
    {
        $this->guard_action('algq_document_create');
        $payload = [
            'property_address' => sanitize_text_field($_POST['property_address'] ?? ''),
            'terms' => sanitize_textarea_field($_POST['terms'] ?? ''),
        ];
        $data = [
            'title' => sanitize_text_field($_POST['title'] ?? ''),
            'document_type' => sanitize_key($_POST['document_type'] ?? 'purchase_agreement'),
            'related_deal_id' => sanitize_text_field($_POST['related_deal_id'] ?? ''),
            'recipient_name' => sanitize_text_field($_POST['recipient_name'] ?? ''),
            'recipient_email' => sanitize_email($_POST['recipient_email'] ?? ''),
            'payload' => $payload,
        ];
        $html = $this->renderer->render_html($data);
        $pdf = $this->renderer->render_pdf_binary($data);
        $this->repository->create_document($data, $html, $this->renderer->checksum($pdf));
        wp_safe_redirect(admin_url('admin.php?page=algq-documents'));
        exit;
    }

    public function handle_send(): void
    {
        $this->guard_action('algq_document_send');
        $this->repository->mark_sent((int) ($_GET['id'] ?? 0), wp_get_current_user()->user_login);
        wp_safe_redirect(admin_url('admin.php?page=algq-documents'));
        exit;
    }

    public function handle_archive(): void
    {
        $this->guard_action('algq_document_archive');
        $this->repository->archive((int) ($_GET['id'] ?? 0), wp_get_current_user()->user_login);
        wp_safe_redirect(admin_url('admin.php?page=algq-documents&status=archived'));
        exit;
    }

    public function handle_void(): void
    {
        $this->guard_action('algq_document_void');
        $this->repository->void((int) ($_GET['id'] ?? 0), wp_get_current_user()->user_login);
        wp_safe_redirect(admin_url('admin.php?page=algq-documents&status=voided'));
        exit;
    }

    public function handle_pdf(): void
    {
        $this->guard_action('algq_document_pdf');
        $document = $this->repository->find((int) ($_GET['id'] ?? 0));
        if (!$document) {
            wp_die(esc_html__('Document not found.', 'algq-pdf-signature'));
        }

        $pdf = $this->renderer->render_pdf_binary($document);
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . sanitize_file_name($document['document_uid']) . '.pdf"');
        header('Content-Length: ' . strlen($pdf));
        echo $pdf;
        exit;
    }

    public function render_admin_page(): void
    {
        $filters = [
            'status' => sanitize_key($_GET['status'] ?? ''),
            'execution_status' => sanitize_key($_GET['execution_status'] ?? ''),
        ];
        $rows = $this->repository->all(100, array_filter($filters));
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Algonquian PDF & Signature Engine', 'algq-pdf-signature'); ?></h1>
            <p><?php esc_html_e('Render deal documents, send signature requests, track execution state, and archive completed agreements.', 'algq-pdf-signature'); ?></p>

            <h2><?php esc_html_e('Create Document', 'algq-pdf-signature'); ?></h2>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('algq_document_create'); ?>
                <input type="hidden" name="action" value="algq_document_create" />
                <table class="form-table" role="presentation">
                    <tr><th><label for="algq-title"><?php esc_html_e('Title', 'algq-pdf-signature'); ?></label></th><td><input class="regular-text" id="algq-title" name="title" required /></td></tr>
                    <tr><th><label for="algq-type"><?php esc_html_e('Document Type', 'algq-pdf-signature'); ?></label></th><td><select id="algq-type" name="document_type"><option value="purchase_agreement"><?php esc_html_e('Purchase Agreement', 'algq-pdf-signature'); ?></option><option value="loi"><?php esc_html_e('LOI', 'algq-pdf-signature'); ?></option><option value="assignment_contract"><?php esc_html_e('Assignment Contract', 'algq-pdf-signature'); ?></option><option value="seller_financing"><?php esc_html_e('Seller Financing', 'algq-pdf-signature'); ?></option></select></td></tr>
                    <tr><th><label for="algq-deal"><?php esc_html_e('Related Deal ID', 'algq-pdf-signature'); ?></label></th><td><input class="regular-text" id="algq-deal" name="related_deal_id" /></td></tr>
                    <tr><th><label for="algq-recipient"><?php esc_html_e('Recipient Name', 'algq-pdf-signature'); ?></label></th><td><input class="regular-text" id="algq-recipient" name="recipient_name" required /></td></tr>
                    <tr><th><label for="algq-email"><?php esc_html_e('Recipient Email', 'algq-pdf-signature'); ?></label></th><td><input class="regular-text" id="algq-email" type="email" name="recipient_email" required /></td></tr>
                    <tr><th><label for="algq-property"><?php esc_html_e('Property Address', 'algq-pdf-signature'); ?></label></th><td><input class="large-text" id="algq-property" name="property_address" /></td></tr>
                    <tr><th><label for="algq-terms"><?php esc_html_e('Terms', 'algq-pdf-signature'); ?></label></th><td><textarea class="large-text" id="algq-terms" name="terms" rows="4"></textarea></td></tr>
                </table>
                <p><button class="button button-primary" type="submit"><?php esc_html_e('Render & Save Document', 'algq-pdf-signature'); ?></button></p>
            </form>

            <h2><?php esc_html_e('Document Archive & Execution Status', 'algq-pdf-signature'); ?></h2>
            <table class="widefat striped">
                <thead><tr><th><?php esc_html_e('UID', 'algq-pdf-signature'); ?></th><th><?php esc_html_e('Title', 'algq-pdf-signature'); ?></th><th><?php esc_html_e('Recipient', 'algq-pdf-signature'); ?></th><th><?php esc_html_e('Status', 'algq-pdf-signature'); ?></th><th><?php esc_html_e('Execution', 'algq-pdf-signature'); ?></th><th><?php esc_html_e('Signed', 'algq-pdf-signature'); ?></th><th><?php esc_html_e('Actions', 'algq-pdf-signature'); ?></th></tr></thead>
                <tbody>
                <?php if (empty($rows)) : ?>
                    <tr><td colspan="7"><?php esc_html_e('No documents yet.', 'algq-pdf-signature'); ?></td></tr>
                <?php endif; ?>
                <?php foreach ($rows as $row) : ?>
                    <tr>
                        <td><?php echo esc_html($row['document_uid']); ?></td>
                        <td><?php echo esc_html($row['title']); ?></td>
                        <td><?php echo esc_html($row['recipient_name'] . ' <' . $row['recipient_email'] . '>'); ?></td>
                        <td><?php echo esc_html($row['status']); ?></td>
                        <td><?php echo esc_html($row['execution_status']); ?></td>
                        <td><?php echo esc_html($row['signed_at'] ?: '—'); ?></td>
                        <td><?php $this->render_actions($row); ?></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    private function render_actions(array $row): void
    {
        $actions = [
            'PDF' => wp_nonce_url(admin_url('admin-post.php?action=algq_document_pdf&id=' . (int) $row['id']), 'algq_document_pdf'),
            'Send' => wp_nonce_url(admin_url('admin-post.php?action=algq_document_send&id=' . (int) $row['id']), 'algq_document_send'),
            'Archive' => wp_nonce_url(admin_url('admin-post.php?action=algq_document_archive&id=' . (int) $row['id']), 'algq_document_archive'),
            'Void' => wp_nonce_url(admin_url('admin-post.php?action=algq_document_void&id=' . (int) $row['id']), 'algq_document_void'),
        ];
        foreach ($actions as $label => $url) {
            echo '<a class="button button-small" href="' . esc_url($url) . '">' . esc_html($label) . '</a> ';
        }
        echo '<code>[algq_signature document_uid="' . esc_attr($row['document_uid']) . '"]</code>';
    }

    private function guard_action(string $nonce_action): void
    {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('Insufficient permissions.', 'algq-pdf-signature'));
        }
        check_admin_referer($nonce_action);
    }
}
