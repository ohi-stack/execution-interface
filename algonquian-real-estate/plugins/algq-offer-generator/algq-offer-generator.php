<?php
/**
 * Plugin Name: Algonquian Offer Generator
 * Description: Creative offer, amortization, legacy visualization, merge-field documents, PDF generation, and signature workflow bootstrap tools.
 * Version: 0.2.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-offer-generator
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ALGQ_OFFER_GENERATOR_VERSION', '0.2.0');
define('ALGQ_OFFER_GENERATOR_DIR', plugin_dir_path(__FILE__));

require_once ALGQ_OFFER_GENERATOR_DIR . 'includes/class-amortization-engine.php';
require_once ALGQ_OFFER_GENERATOR_DIR . 'includes/class-database.php';
require_once ALGQ_OFFER_GENERATOR_DIR . 'includes/class-audit-log.php';
require_once ALGQ_OFFER_GENERATOR_DIR . 'includes/class-merge-engine.php';
require_once ALGQ_OFFER_GENERATOR_DIR . 'includes/class-document-generator.php';
require_once ALGQ_OFFER_GENERATOR_DIR . 'includes/class-pdf-engine.php';
require_once ALGQ_OFFER_GENERATOR_DIR . 'includes/class-signature-engine.php';
require_once ALGQ_OFFER_GENERATOR_DIR . 'includes/class-connectors.php';

register_activation_hook(__FILE__, ['ALGQ_Offer_Database', 'activate']);

add_action('wp_enqueue_scripts', function (): void {
    wp_register_style('algq-offer-generator', plugins_url('assets/css/offer-generator.css', __FILE__), [], ALGQ_OFFER_GENERATOR_VERSION);
    wp_register_script('algq-offer-generator', plugins_url('assets/js/offer-generator.js', __FILE__), [], ALGQ_OFFER_GENERATOR_VERSION, true);
});

add_action('admin_post_algq_offer_document', 'algq_offer_generator_handle_document');

add_action('init', 'algq_offer_generator_register_patterns');

add_shortcode('algq_offer_generator', function (): string {
    wp_enqueue_style('algq-offer-generator');
    wp_enqueue_script('algq-offer-generator');
    $offer = null;
    $documents = [];
    if ('POST' === ($_SERVER['REQUEST_METHOD'] ?? '') && isset($_POST['algq_offer_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['algq_offer_nonce'])), 'algq_offer_generate')) {
        $engine = new ALGQ_Amortization_Engine();
        $offer = $engine->schedule((float) ($_POST['price'] ?? 0), (float) ($_POST['rate'] ?? 0), (int) ($_POST['term'] ?? 1));
    }

    if (current_user_can('manage_options')) {
        $documents = (new ALGQ_Offer_Database())->recent_documents(5);
    }

    ob_start();
    include __DIR__ . '/templates/app.php';
    algq_offer_generator_render_document_tools($documents);
    return (string) ob_get_clean();
});

function algq_offer_generator_handle_document(): void
{
    if (!current_user_can('manage_options')) {
        wp_die(esc_html__('Insufficient permissions.', 'algq-offer-generator'));
    }

    check_admin_referer('algq_offer_document');

    $connectors = new ALGQ_Offer_Connectors();
    $merge = new ALGQ_Offer_Merge_Engine();
    $generator = new ALGQ_Offer_Document_Generator($merge);
    $database = new ALGQ_Offer_Database();
    $audit = new ALGQ_Offer_Audit_Log();
    $pdf = new ALGQ_Offer_PDF_Engine();

    $deal_id = sanitize_text_field($_POST['deal_id'] ?? '');
    $payload = array_merge(
        $connectors->deal_payload($deal_id),
        [
            'seller_name' => sanitize_text_field($_POST['seller_name'] ?? ''),
            'seller_email' => sanitize_email($_POST['seller_email'] ?? ''),
            'property_address' => sanitize_text_field($_POST['property_address'] ?? ''),
            'purchase_price' => sanitize_text_field($_POST['purchase_price'] ?? ''),
            'earnest_money' => sanitize_text_field($_POST['earnest_money'] ?? ''),
            'closing_date' => sanitize_text_field($_POST['closing_date'] ?? ''),
            'offer_terms' => sanitize_textarea_field($_POST['offer_terms'] ?? ''),
        ]
    );

    $document = $generator->generate(sanitize_key($_POST['document_type'] ?? 'loi'), $payload);
    $document['deal_id'] = $deal_id;
    $binary = $pdf->render($document);
    $document['pdf_checksum'] = $pdf->checksum($binary);
    $document_id = $database->save_document($document);
    $audit->record('offer_document', (string) $document_id, 'document_generated', 'Offer document generated.', ['document_type' => $document['document_type']]);

    if (!empty($_POST['request_signature'])) {
        $saved = $database->find_document($document_id) ?: $document;
        $signature = (new ALGQ_Offer_Signature_Engine())->request_signature($saved);
        $saved['id'] = $document_id;
        $saved['signature_uid'] = $signature['signature_uid'];
        $saved['status'] = $signature['status'];
        if (!empty($signature['pdf_checksum'])) {
            $saved['pdf_checksum'] = $signature['pdf_checksum'];
        }
        $database->save_document($saved);
        $audit->record('offer_document', (string) $document_id, 'signature_requested', 'Signature workflow requested.', $signature);
    }

    wp_safe_redirect(add_query_arg(['algq_offer_document' => $document_id], wp_get_referer() ?: home_url('/')));
    exit;
}

function algq_offer_generator_render_document_tools(array $documents): void
{
    if (!current_user_can('manage_options')) {
        return;
    }
    ?>
    <section class="algq-offer-document-tools">
        <h2><?php esc_html_e('Document Generator', 'algq-offer-generator'); ?></h2>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <?php wp_nonce_field('algq_offer_document'); ?>
            <input type="hidden" name="action" value="algq_offer_document" />
            <p><label><?php esc_html_e('Deal ID', 'algq-offer-generator'); ?><br /><input name="deal_id" /></label></p>
            <p><label><?php esc_html_e('Document Type', 'algq-offer-generator'); ?><br />
                <select name="document_type">
                    <option value="loi"><?php esc_html_e('LOI', 'algq-offer-generator'); ?></option>
                    <option value="purchase_agreement"><?php esc_html_e('Purchase Agreement', 'algq-offer-generator'); ?></option>
                    <option value="seller_financing"><?php esc_html_e('Seller Financing', 'algq-offer-generator'); ?></option>
                    <option value="assignment_contract"><?php esc_html_e('Assignment Contract', 'algq-offer-generator'); ?></option>
                </select></label></p>
            <p><label><?php esc_html_e('Seller Name', 'algq-offer-generator'); ?><br /><input name="seller_name" /></label></p>
            <p><label><?php esc_html_e('Seller Email', 'algq-offer-generator'); ?><br /><input type="email" name="seller_email" /></label></p>
            <p><label><?php esc_html_e('Property Address', 'algq-offer-generator'); ?><br /><input name="property_address" /></label></p>
            <p><label><?php esc_html_e('Purchase Price', 'algq-offer-generator'); ?><br /><input name="purchase_price" /></label></p>
            <p><label><?php esc_html_e('Earnest Money', 'algq-offer-generator'); ?><br /><input name="earnest_money" /></label></p>
            <p><label><?php esc_html_e('Closing Date', 'algq-offer-generator'); ?><br /><input name="closing_date" /></label></p>
            <p><label><?php esc_html_e('Offer Terms', 'algq-offer-generator'); ?><br /><textarea name="offer_terms" rows="4"></textarea></label></p>
            <p><label><input type="checkbox" name="request_signature" value="1" /> <?php esc_html_e('Send to signature engine after generation', 'algq-offer-generator'); ?></label></p>
            <p><button type="submit"><?php esc_html_e('Generate Document', 'algq-offer-generator'); ?></button></p>
        </form>
        <?php if (!empty($documents)) : ?>
            <h3><?php esc_html_e('Recent Documents', 'algq-offer-generator'); ?></h3>
            <ul>
                <?php foreach ($documents as $document) : ?>
                    <li><strong><?php echo esc_html($document['title']); ?></strong> — <?php echo esc_html($document['status']); ?> <code><?php echo esc_html($document['document_uid']); ?></code></li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </section>
    <?php
}

function algq_offer_generator_register_patterns(): void
{
    if (!function_exists('register_block_pattern')) {
        return;
    }

    if (function_exists('register_block_pattern_category')) {
        register_block_pattern_category('algq-real-estate', ['label' => __('Algonquian Real Estate', 'algq-offer-generator')]);
    }

    register_block_pattern('algq-real-estate/offer-command-center', [
        'title' => __('Offer Generator Command Center', 'algq-offer-generator'),
        'description' => __('Embed the offer generator with operational context and document workflow links.', 'algq-offer-generator'),
        'categories' => ['algq-real-estate', 'call-to-action'],
        'viewportWidth' => 1200,
        'content' => '<!-- wp:group {"className":"algq-pattern-offer-command"} --><div class="wp-block-group algq-pattern-offer-command"><!-- wp:heading --><h2>Offer Generator Command Center</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Create offer summaries, LOIs, seller-financing sheets, PDFs, and signature-ready documents.</p><!-- /wp:paragraph --><!-- wp:shortcode -->[algq_offer_generator]<!-- /wp:shortcode --></div><!-- /wp:group -->',
    ]);

    register_block_pattern('algq-real-estate/navigation-overlay', [
        'title' => __('Navigation Overlay Template', 'algq-offer-generator'),
        'description' => __('Responsive overlay navigation for Algonquian operating modules.', 'algq-offer-generator'),
        'categories' => ['algq-real-estate', 'header'],
        'blockTypes' => ['core/template-part/header'],
        'viewportWidth' => 1200,
        'content' => '<!-- wp:group {"className":"algq-navigation-overlay"} --><div class="wp-block-group algq-navigation-overlay"><!-- wp:heading {"level":3} --><h3>Algonquian Real Estate</h3><!-- /wp:heading --><!-- wp:navigation --><!-- wp:navigation-link {"label":"Deals","url":"/deals"} /--><!-- wp:navigation-link {"label":"Offers","url":"/offers"} /--><!-- wp:navigation-link {"label":"Documents","url":"/documents"} /--><!-- wp:navigation-link {"label":"Command Center","url":"/command-center"} /--><!-- /wp:navigation --></div><!-- /wp:group -->',
    ]);
}
