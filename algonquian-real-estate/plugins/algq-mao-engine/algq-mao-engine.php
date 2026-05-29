<?php
/**
 * Plugin Name: Algonquian MAO Engine
 * Plugin URI: https://algonquianrealestate.com
 * Description: Maximum Allowable Offer calculator and underwriting API for Algonquian Real Estate acquisition workflows.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-mao-engine
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 8.0
 * License: GPL-2.0-or-later
 */

if (! defined('ABSPATH')) {
    exit;
}

define('ALGQ_MAO_ENGINE_VERSION', '0.1.0');
define('ALGQ_MAO_ENGINE_FILE', __FILE__);
define('ALGQ_MAO_ENGINE_PATH', plugin_dir_path(__FILE__));
define('ALGQ_MAO_ENGINE_URL', plugin_dir_url(__FILE__));

require_once ALGQ_MAO_ENGINE_PATH . 'includes/class-algq-mao-activator.php';
require_once ALGQ_MAO_ENGINE_PATH . 'includes/class-algq-mao-calculator.php';
require_once ALGQ_MAO_ENGINE_PATH . 'includes/class-algq-mao-repository.php';
require_once ALGQ_MAO_ENGINE_PATH . 'includes/class-algq-mao-rest-controller.php';
require_once ALGQ_MAO_ENGINE_PATH . 'admin/class-algq-mao-admin.php';
require_once ALGQ_MAO_ENGINE_PATH . 'public/class-algq-mao-public.php';
require_once ALGQ_MAO_ENGINE_PATH . 'includes/class-algq-mao-plugin.php';

register_activation_hook(__FILE__, array('ALGQ_MAO_Activator', 'activate'));
register_deactivation_hook(__FILE__, array('ALGQ_MAO_Activator', 'deactivate'));

function algq_mao_engine(): ALGQ_MAO_Plugin
{
    static $plugin = null;

    if (null === $plugin) {
        $plugin = new ALGQ_MAO_Plugin();
    }

    return $plugin;
}

add_action('plugins_loaded', array(algq_mao_engine(), 'run'));
 * Description: Maximum allowable offer calculator and underwriting service.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/includes/class-underwriter.php';

add_shortcode('algq_mao_engine', function (): string {
    $result = null;
    if ('POST' === ($_SERVER['REQUEST_METHOD'] ?? '') && isset($_POST['algq_mao_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['algq_mao_nonce'])), 'algq_mao_calculate')) {
        $underwriter = new ALGQ_Underwriter();
        $result = $underwriter->analyze((float) ($_POST['arv'] ?? 0), (float) ($_POST['rehab'] ?? 0), (float) ($_POST['assignment_fee'] ?? 0));
    }

    ob_start();
    ?>
    <form class="algq-mao-engine" method="post">
        <?php wp_nonce_field('algq_mao_calculate', 'algq_mao_nonce'); ?>
        <p><label>ARV <input required name="arv" type="number" min="0" step="0.01" /></label></p>
        <p><label>Rehab Estimate <input required name="rehab" type="number" min="0" step="0.01" /></label></p>
        <p><label>Assignment Fee <input required name="assignment_fee" type="number" min="0" step="0.01" /></label></p>
        <p><button type="submit">Calculate MAO</button></p>
    </form>
    <?php if ($result) : ?>
        <div class="algq-mao-result">
            <p><strong>MAO:</strong> <?php echo esc_html(number_format($result['mao'], 2)); ?></p>
            <p><strong>Profit Spread:</strong> <?php echo esc_html(number_format($result['profit_spread'], 2)); ?></p>
            <p><strong>Risk Score:</strong> <?php echo esc_html($result['risk_score']); ?></p>
        </div>
    <?php endif; ?>
    <?php
    return (string) ob_get_clean();
});
