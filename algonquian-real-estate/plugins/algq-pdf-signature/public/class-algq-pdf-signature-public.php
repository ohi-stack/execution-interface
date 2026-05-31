<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_PDF_Signature_Public
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
        add_shortcode('algq_signature', [$this, 'render_signature_shortcode']);
        add_action('admin_post_nopriv_algq_public_sign', [$this, 'handle_public_sign']);
        add_action('admin_post_algq_public_sign', [$this, 'handle_public_sign']);
    }

    public function render_signature_shortcode(array $atts): string
    {
        $atts = shortcode_atts(['document_uid' => ''], $atts, 'algq_signature');
        $document = $this->repository->find_by_uid((string) $atts['document_uid']);
        if (!$document) {
            return '<p>' . esc_html__('Document not found.', 'algq-pdf-signature') . '</p>';
        }

        if (in_array($document['status'], ['signed', 'archived'], true)) {
            return '<p>' . esc_html__('This document has already been fully executed and archived.', 'algq-pdf-signature') . '</p>';
        }

        ob_start();
        ?>
        <div class="algq-signature-workflow">
            <h2><?php echo esc_html($document['title']); ?></h2>
            <p><strong><?php esc_html_e('Execution status:', 'algq-pdf-signature'); ?></strong> <?php echo esc_html($document['execution_status']); ?></p>
            <div class="algq-document-preview"><?php echo wp_kses_post($document['rendered_html']); ?></div>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('algq_public_sign_' . $document['document_uid']); ?>
                <input type="hidden" name="action" value="algq_public_sign" />
                <input type="hidden" name="document_uid" value="<?php echo esc_attr($document['document_uid']); ?>" />
                <p><label><?php esc_html_e('Legal name', 'algq-pdf-signature'); ?><br /><input name="signer_name" required /></label></p>
                <p><label><?php esc_html_e('Signature', 'algq-pdf-signature'); ?><br /><input name="signature" required placeholder="<?php esc_attr_e('Type your full legal name', 'algq-pdf-signature'); ?>" /></label></p>
                <p><button type="submit"><?php esc_html_e('Sign Document', 'algq-pdf-signature'); ?></button></p>
            </form>
        </div>
        <?php
        return (string) ob_get_clean();
    }

    public function handle_public_sign(): void
    {
        $uid = sanitize_text_field($_POST['document_uid'] ?? '');
        $document = $this->repository->find_by_uid($uid);
        if (!$document) {
            wp_die(esc_html__('Document not found.', 'algq-pdf-signature'));
        }

        check_admin_referer('algq_public_sign_' . $uid);
        if (in_array($document['status'], ['signed', 'archived', 'voided', 'expired'], true)) {
            wp_die(esc_html__('Document is not open for signature.', 'algq-pdf-signature'));
        }

        $signer = sanitize_text_field($_POST['signer_name'] ?? '');
        $signature = sanitize_text_field($_POST['signature'] ?? '');
        if ('' === $signer || '' === $signature) {
            wp_die(esc_html__('Signer name and signature are required.', 'algq-pdf-signature'));
        }

        $this->repository->sign_document((int) $document['id'], $signer, $signature, sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? ''));
        wp_safe_redirect(wp_get_referer() ?: home_url('/'));
        exit;
    }
}
