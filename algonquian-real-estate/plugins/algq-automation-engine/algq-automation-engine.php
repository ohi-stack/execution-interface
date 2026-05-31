<?php
/**
 * Plugin Name: Algonquian Automation Engine
 * Description: Cross-module workflow trigger and action foundation for deal, buyer, funding, document, notification, and revenue automations.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 * Requires Plugins: algq-core
 * Text Domain: algq-automation-engine
 */

if (!defined('ABSPATH')) {
    exit;
}

function algq_automation_engine_core_available(): bool
{
    if (function_exists('algq_core')) {
        return true;
    }

    add_action('admin_notices', static function (): void {
        echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian Automation Engine requires the Algonquian Core plugin to be active.', 'algq-automation-engine') . '</p></div>';
    });

    return false;
}

add_action('plugins_loaded', static function (): void {
    if (!algq_automation_engine_core_available()) {
        return;
    }

    add_shortcode('algq_automation_engine', 'algq_automation_engine_render_shortcode');
    add_action('rest_api_init', 'algq_automation_engine_register_routes');
});

function algq_automation_engine_workflows(): array
{
    return [
        ['trigger' => 'Deal captured', 'action' => 'Notify acquisition manager'],
        ['trigger' => 'Offer sent', 'action' => 'Create follow-up activity'],
        ['trigger' => 'Document signed', 'action' => 'Update pipeline stage'],
        ['trigger' => 'Buyer interest submitted', 'action' => 'Notify disposition manager'],
    ];
}

function algq_automation_engine_render_shortcode(): string
{
    ob_start();
    echo '<section class="algq-automation-engine"><h2>Automation Engine</h2><p>Workflow triggers and actions shared across ARE platform modules.</p><ul>';
    foreach (algq_automation_engine_workflows() as $workflow) {
        echo '<li><strong>' . esc_html($workflow['trigger']) . '</strong> → ' . esc_html($workflow['action']) . '</li>';
    }
    echo '</ul></section>';
    return (string) ob_get_clean();
}

function algq_automation_engine_register_routes(): void
{
    register_rest_route('algq/v1', '/automation-engine', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => static function (): WP_REST_Response {
            return new WP_REST_Response([
                'name' => 'Automation Engine',
                'shortcode' => '[algq_automation_engine]',
                'workflows' => algq_automation_engine_workflows(),
            ]);
        },
    ]);
}
