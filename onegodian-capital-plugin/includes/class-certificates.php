<?php

if (!defined('ABSPATH')) {
    exit;
}

class Onegodian_Capital_Certificates {
    public static function create_certificate_for_instrument($instrument) {
        global $wpdb;

        $year = gmdate('Y');
        $table = $wpdb->prefix . 'onegodian_capital_certificates';
        $count = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} WHERE YEAR(issued_at) = %d", (int) $year));
        $certificate_number = sprintf('OCP-CERT-%s-%06d', $year, $count + 1);
        $issued_at = current_time('mysql');
        $verification_hash = hash('sha256', wp_json_encode([$instrument, $issued_at, wp_rand()]));

        $inserted = $wpdb->insert(
            $table,
            [
                'certificate_number' => $certificate_number,
                'instrument_id' => absint($instrument['id']),
                'issued_at' => $issued_at,
                'verification_hash' => $verification_hash,
                'pdf_url' => null,
            ],
            ['%s', '%d', '%s', '%s', '%s']
        );

        return $inserted ? (int) $wpdb->insert_id : 0;
    }
}
