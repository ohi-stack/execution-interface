<?php

class Onegodian_Capital_Activator {
    public static function activate() {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset_collate = $wpdb->get_charset_collate();
        $prefix = $wpdb->prefix;

        $sql = [];
        $sql[] = "CREATE TABLE {$prefix}onegodian_capital_instruments (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, user_id BIGINT UNSIGNED NOT NULL, offering_id BIGINT UNSIGNED NOT NULL, order_id BIGINT UNSIGNED NULL, instrument_number VARCHAR(64) NOT NULL, instrument_type VARCHAR(20) NOT NULL, principal_amount DECIMAL(18,2) NOT NULL DEFAULT 0.00, currency VARCHAR(8) NULL, status VARCHAR(20) NOT NULL, issue_date DATETIME NULL, maturity_date DATETIME NULL, created_at DATETIME NOT NULL, PRIMARY KEY (id), UNIQUE KEY instrument_number (instrument_number), KEY user_id (user_id), KEY offering_id (offering_id), KEY order_id (order_id)) $charset_collate;";
        $sql[] = "CREATE TABLE {$prefix}onegodian_capital_ledger (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, instrument_id BIGINT UNSIGNED NOT NULL, entry_type VARCHAR(50) NOT NULL, amount DECIMAL(18,2) NOT NULL DEFAULT 0.00, currency VARCHAR(8) NULL, reference_id VARCHAR(64) NULL, metadata LONGTEXT NULL, created_at DATETIME NOT NULL, PRIMARY KEY (id), KEY instrument_id (instrument_id)) $charset_collate;";
        $sql[] = "CREATE TABLE {$prefix}onegodian_capital_disclosure_acceptances (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, user_id BIGINT UNSIGNED NOT NULL, offering_id BIGINT UNSIGNED NOT NULL, disclosure_packet_version VARCHAR(100) NOT NULL, accepted_at DATETIME NOT NULL, ip_address VARCHAR(64) NULL, user_agent VARCHAR(255) NULL, acceptance_hash VARCHAR(255) NOT NULL, PRIMARY KEY (id), KEY user_id (user_id), KEY offering_id (offering_id), KEY acceptance_hash (acceptance_hash)) $charset_collate;";
        $sql[] = "CREATE TABLE {$prefix}onegodian_capital_certificates (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, certificate_number VARCHAR(100) NOT NULL, instrument_id BIGINT UNSIGNED NOT NULL, issued_at DATETIME NOT NULL, verification_hash VARCHAR(255) NULL, pdf_url TEXT NULL, PRIMARY KEY (id), UNIQUE KEY certificate_number (certificate_number), KEY instrument_id (instrument_id)) $charset_collate;";

        foreach ($sql as $statement) {
            dbDelta($statement);
        }
    }
}
