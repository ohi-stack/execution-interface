<?php

if (!defined('ABSPATH')) {
    exit;
}

class Onegodian_Capital_Instruments {
    public static function handle_paid_order($order_id) {
        if (!Onegodian_Capital_WooCommerce::is_active() || !function_exists('wc_get_order')) {
            return;
        }

        $order = wc_get_order($order_id);
        if (!$order || !$order->is_paid()) {
            return;
        }

        $user_id = (int) $order->get_user_id();
        if ($user_id <= 0) {
            return;
        }

        foreach ($order->get_items() as $item) {
            $product_id = $item->get_product_id();
            $offering_id = (int) get_post_meta($product_id, '_onegodian_capital_offering_id', true);
            if ($offering_id <= 0 || get_post_type($offering_id) !== 'onegodian_offering') {
                continue;
            }

            $acceptance = Onegodian_Capital_Disclosures::get_latest_acceptance($user_id, $offering_id);
            if (!$acceptance) {
                continue;
            }

            self::create_from_paid_order($user_id, $offering_id, $order, $item);
        }
    }

    private static function create_from_paid_order($user_id, $offering_id, $order, $item) {
        global $wpdb;
        $instruments = $wpdb->prefix . 'onegodian_capital_instruments';

        $existing_id = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$instruments} WHERE user_id = %d AND offering_id = %d AND order_id = %d LIMIT 1",
            $user_id,
            $offering_id,
            $order->get_id()
        ));
        if ($existing_id > 0) {
            return;
        }

        $type_meta = strtolower((string) get_post_meta($offering_id, '_onegodian_instrument_type', true));
        $instrument_type = $type_meta === 'bond' ? 'bond' : 'note';
        $instrument_number = self::generate_instrument_number($instrument_type);

        $inserted = $wpdb->insert(
            $instruments,
            [
                'user_id' => $user_id,
                'offering_id' => $offering_id,
                'order_id' => $order->get_id(),
                'instrument_number' => $instrument_number,
                'instrument_type' => $instrument_type,
                'principal_amount' => (float) $item->get_total(),
                'currency' => $order->get_currency(),
                'status' => 'active',
                'issue_date' => current_time('mysql'),
                'maturity_date' => null,
                'created_at' => current_time('mysql'),
            ],
            ['%d', '%d', '%d', '%s', '%s', '%f', '%s', '%s', '%s', '%s', '%s']
        );

        if (!$inserted) {
            return;
        }

        $instrument_id = (int) $wpdb->insert_id;
        Onegodian_Capital_Ledger::create_purchase_entry($instrument_id, $item->get_total(), $order->get_currency(), $order->get_id());
        Onegodian_Capital_Certificates::create_certificate_for_instrument(['id' => $instrument_id, 'instrument_number' => $instrument_number]);
    }

    private static function generate_instrument_number($instrument_type) {
        global $wpdb;

        $year = gmdate('Y');
        $prefix = $instrument_type === 'bond' ? 'OCP-BOND' : 'OCP-NOTE';
        $table = $wpdb->prefix . 'onegodian_capital_instruments';
        $count = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} WHERE YEAR(created_at) = %d AND instrument_type = %s", (int) $year, $instrument_type));

        return sprintf('%s-%s-%06d', $prefix, $year, $count + 1);
    }
}
