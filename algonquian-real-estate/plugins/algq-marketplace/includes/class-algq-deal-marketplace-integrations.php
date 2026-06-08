<?php
/**
 * Optional ARE suite integration checks for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Integrations
{
    private ALGQ_Deal_Marketplace_Cache $cache;

    public function __construct(ALGQ_Deal_Marketplace_Cache $cache)
    {
        $this->cache = $cache;
    }

    public function register_hooks(): void
    {
        add_action('admin_notices', [$this, 'render_optional_plugin_notice']);
    }

    /**
     * @return array<string, array{label: string, active: bool}>
     */
    public function suite_status(): array
    {
        $cached = $this->cache->get('integrations');

        if (is_array($cached)) {
            return $cached;
        }

        $plugins = [
            'deal_intake' => ['label' => 'Deal Intake', 'file' => 'algq-deal-intake/algq-deal-intake.php', 'function' => 'algq_deal_intake_core_available'],
            'pipeline_crm' => ['label' => 'Pipeline CRM', 'file' => 'algq-pipeline-crm/algq-pipeline-crm.php', 'class' => 'ALGQ_Pipeline_CRM'],
            'buyer_portal' => ['label' => 'Buyer Portal', 'file' => 'algq-buyer-portal/algq-buyer-portal.php', 'class' => 'ALGQ_Buyer_Portal'],
            'woocommerce_bridge' => ['label' => 'WooCommerce Bridge', 'file' => 'algq-woocommerce-bridge/algq-woocommerce-bridge.php', 'class' => 'ALGQ_WooCommerce_Bridge'],
            'digital_store' => ['label' => 'Digital Store', 'file' => 'algq-digital-products/algq-digital-products.php'],
            'document_library' => ['label' => 'Document Library', 'file' => 'algq-document-library/algq-document-library.php'],
            'command_center' => ['label' => 'Command Center', 'file' => 'algq-command-center/algq-command-center.php'],
        ];

        $status = [];

        foreach ($plugins as $key => $plugin) {
            $active = $this->is_plugin_available($plugin);
            $status[$key] = [
                'label' => $plugin['label'],
                'active' => $active,
            ];
        }

        $this->cache->set('integrations', $status, 60);
        return $status;
    }

    /**
     * @param array<string, string> $plugin
     */
    private function is_plugin_available(array $plugin): bool
    {
        if (!empty($plugin['class']) && class_exists($plugin['class'])) {
            return true;
        }

        if (!empty($plugin['function']) && function_exists($plugin['function'])) {
            return true;
        }

        if (!function_exists('is_plugin_active')) {
            $plugin_file = ABSPATH . 'wp-admin/includes/plugin.php';

            if (file_exists($plugin_file)) {
                require_once $plugin_file;
            }
        }

        return function_exists('is_plugin_active') && !empty($plugin['file']) && is_plugin_active($plugin['file']);
    }

    public function render_optional_plugin_notice(): void
    {
        if (!is_admin() || !current_user_can('algq_manage_deal_marketplace')) {
            return;
        }

        $missing = array_filter($this->suite_status(), static fn (array $plugin): bool => !$plugin['active']);

        if ([] === $missing) {
            return;
        }

        $labels = wp_list_pluck($missing, 'label');
        echo '<div class="notice notice-info"><p>' . esc_html(sprintf(__('Deal Marketplace is running. Optional ARE suite plugins inactive: %s.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN), implode(', ', $labels))) . '</p></div>';
    }
}
