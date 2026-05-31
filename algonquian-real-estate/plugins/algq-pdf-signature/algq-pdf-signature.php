<?php
/**
 * Plugin Name: Algonquian PDF & Signature Engine
 * Description: PDF rendering, signature workflow, document archive, and execution status tracking for Algonquian Real Estate documents.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 * Requires Plugins: algq-core
 * Text Domain: algq-pdf-signature
 */

if (!defined('ABSPATH')) {
    exit;
}


function algq_pdf_signature_core_available(): bool
{
    if (function_exists('algq_core')) {
        return true;
    }

    add_action('admin_notices', static function (): void {
        echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian PDF & Signature Engine requires the Algonquian Core plugin to be active.', 'algq-pdf-signature') . '</p></div>';
    });

    return false;
}

define('ALGQ_PDF_SIGNATURE_VERSION', '0.1.0');
define('ALGQ_PDF_SIGNATURE_FILE', __FILE__);
define('ALGQ_PDF_SIGNATURE_DIR', plugin_dir_path(__FILE__));

require_once ALGQ_PDF_SIGNATURE_DIR . 'includes/class-algq-pdf-signature-repository.php';
require_once ALGQ_PDF_SIGNATURE_DIR . 'includes/class-algq-pdf-signature-renderer.php';
require_once ALGQ_PDF_SIGNATURE_DIR . 'includes/class-algq-pdf-signature-activator.php';
require_once ALGQ_PDF_SIGNATURE_DIR . 'includes/class-algq-pdf-signature-rest-controller.php';
require_once ALGQ_PDF_SIGNATURE_DIR . 'admin/class-algq-pdf-signature-admin.php';
require_once ALGQ_PDF_SIGNATURE_DIR . 'public/class-algq-pdf-signature-public.php';
require_once ALGQ_PDF_SIGNATURE_DIR . 'includes/class-algq-pdf-signature-plugin.php';

register_activation_hook(__FILE__, ['ALGQ_PDF_Signature_Activator', 'activate']);

add_action('plugins_loaded', static function (): void {
    if (!algq_pdf_signature_core_available()) {
        return;
    }

    ALGQ_PDF_Signature_Plugin::instance()->run();
});
