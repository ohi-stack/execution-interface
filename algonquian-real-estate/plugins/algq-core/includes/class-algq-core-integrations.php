<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Core_Integrations
{
    private const TABLE = 'algq_integrations';

    private const DEFAULT_PROVIDERS = [
        'woocommerce' => 'WooCommerce',
        'stripe' => 'Stripe',
        'paypal' => 'PayPal',
        'fluentcrm' => 'FluentCRM',
        'wp_mail_smtp' => 'WP Mail SMTP',
        'google_maps' => 'Google Maps',
        'openai' => 'OpenAI APIs',
    ];

    public function providers(): array
    {
        /**
         * Allows modules to register additional platform integration providers.
         *
         * @param array<string,string> $providers Provider slug to label map.
         */
        return apply_filters('algq_core_integration_providers', self::DEFAULT_PROVIDERS);
    }

    public function register(string $provider, string $status = 'inactive', array $metadata = []): bool
    {
        global $wpdb;
        $providers = $this->providers();
        $label = $providers[$provider] ?? ucwords(str_replace('_', ' ', $provider));
        $table = $wpdb->prefix . self::TABLE;
        return false !== $wpdb->replace($table, [
            'provider' => sanitize_key($provider),
            'label' => sanitize_text_field($label),
            'status' => sanitize_key($status),
            'credentials' => null,
            'metadata' => wp_json_encode($metadata),
            'updated_at' => current_time('mysql'),
        ], ['%s', '%s', '%s', '%s', '%s', '%s']);
    }
}
