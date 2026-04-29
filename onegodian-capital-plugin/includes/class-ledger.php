<?php

if (!defined('ABSPATH')) {
    exit;
}

class Onegodian_Capital_Ledger {
    public static function create_purchase_entry($instrument_id, $amount, $currency, $reference_id) {
        global $wpdb;

        $inserted = $wpdb->insert(
            $wpdb->prefix . 'onegodian_capital_ledger',
            [
                'instrument_id' => absint($instrument_id),
                'entry_type' => 'purchase',
                'amount' => (float) $amount,
                'currency' => sanitize_text_field($currency),
                'reference_id' => sanitize_text_field((string) $reference_id),
                'metadata' => wp_json_encode(['source' => 'woocommerce_order']),
                'created_at' => current_time('mysql'),
            ],
            ['%d', '%s', '%f', '%s', '%s', '%s', '%s']
        );

        return $inserted ? (int) $wpdb->insert_id : 0;
    }

    public static function get_rows($limit = 200) {
        global $wpdb;

        $table = $wpdb->prefix . 'onegodian_capital_ledger';
        return $wpdb->get_results($wpdb->prepare("SELECT * FROM {$table} ORDER BY created_at DESC LIMIT %d", absint($limit)), ARRAY_A);
    }
}
