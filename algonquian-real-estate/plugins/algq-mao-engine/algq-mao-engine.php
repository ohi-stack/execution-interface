<?php
/**
 * Plugin Name: Algonquian MAO Engine
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
