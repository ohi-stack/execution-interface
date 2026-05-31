<?php
/**
 * Plugin Name: Algonquian Funding Tracker
 * Description: Funding request, committed capital, lender status, and command-center funding metric foundations.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 * Requires Plugins: algq-core
 * Text Domain: algq-funding-tracker
 */

if (!defined('ABSPATH')) {
    exit;
}

function algq_funding_tracker_core_available(): bool
{
    if (function_exists('algq_core')) {
        return true;
    }

    add_action('admin_notices', static function (): void {
        echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian Funding Tracker requires the Algonquian Core plugin to be active.', 'algq-funding-tracker') . '</p></div>';
    });

    return false;
}

add_action('plugins_loaded', static function (): void {
    if (!algq_funding_tracker_core_available()) {
        return;
    }

    add_shortcode('algq_funding_tracker', 'algq_funding_tracker_render_shortcode');
    add_filter('algq_command_center_funding_status', 'algq_funding_tracker_command_center_metrics');
});

function algq_funding_tracker_metrics(): array
{
    return [
        ['label' => 'Funding tracker', 'value' => 'Connected'],
        ['label' => 'Committed capital', 'value' => 'Module foundation'],
        ['label' => 'Open funding requests', 'value' => 'Module foundation'],
    ];
}

function algq_funding_tracker_command_center_metrics(array $fallback): array
{
    return algq_funding_tracker_metrics();
}

function algq_funding_tracker_render_shortcode(): string
{
    ob_start();
    echo '<section class="algq-funding-tracker"><h2>Funding Tracker</h2><p>Capital stack, lender status, and funding request workflows.</p><ul>';
    foreach (algq_funding_tracker_metrics() as $metric) {
        echo '<li><strong>' . esc_html($metric['label']) . '</strong>: ' . esc_html($metric['value']) . '</li>';
    }
    echo '</ul></section>';
    return (string) ob_get_clean();
}
