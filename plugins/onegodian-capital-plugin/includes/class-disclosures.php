<?php

if (!defined('ABSPATH')) {
    exit;
}

class Onegodian_Capital_Disclosures {
    public static function create_acceptance($user_id, $offering_id, $disclosure_packet_version) {
        global $wpdb;

        $accepted_at = current_time('mysql');
        $ip_address = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '';
        $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])) : '';
        $acceptance_hash = hash('sha256', implode('|', [$user_id, $offering_id, $disclosure_packet_version, $accepted_at, $ip_address, $user_agent]));

        $inserted = $wpdb->insert(
            $wpdb->prefix . 'onegodian_capital_disclosure_acceptances',
            [
                'user_id' => absint($user_id),
                'offering_id' => absint($offering_id),
                'disclosure_packet_version' => sanitize_text_field($disclosure_packet_version),
                'accepted_at' => $accepted_at,
                'ip_address' => $ip_address,
                'user_agent' => $user_agent,
                'acceptance_hash' => $acceptance_hash,
            ],
            ['%d', '%d', '%s', '%s', '%s', '%s', '%s']
        );

        return $inserted ? (int) $wpdb->insert_id : 0;
    }

    public static function get_latest_acceptance($user_id, $offering_id) {
        global $wpdb;

        $table = $wpdb->prefix . 'onegodian_capital_disclosure_acceptances';
        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$table} WHERE user_id = %d AND offering_id = %d ORDER BY accepted_at DESC LIMIT 1",
                absint($user_id),
                absint($offering_id)
            ),
            ARRAY_A
        );
    }
}
