<?php

class Onegodian_Capital_Activator {
    public static function activate() {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset_collate = $wpdb->get_charset_collate();
        $prefix = $wpdb->prefix;

        $sql = [];
        $sql[] = "CREATE TABLE {$prefix}onegodian_capital_instruments (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, offering_id BIGINT UNSIGNED NOT NULL, instrument_type VARCHAR(20) NOT NULL, status VARCHAR(20) NOT NULL, created_at DATETIME NOT NULL, PRIMARY KEY (id)) $charset_collate;";
        $sql[] = "CREATE TABLE {$prefix}onegodian_capital_ledger (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, instrument_id BIGINT UNSIGNED NOT NULL, entry_type VARCHAR(50) NOT NULL, amount DECIMAL(18,2) NOT NULL DEFAULT 0.00, metadata LONGTEXT NULL, created_at DATETIME NOT NULL, PRIMARY KEY (id)) $charset_collate;";
        $sql[] = "CREATE TABLE {$prefix}onegodian_capital_disclosure_acceptances (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, disclosure_id VARCHAR(100) NOT NULL, investor_ref VARCHAR(100) NOT NULL, accepted_at DATETIME NOT NULL, PRIMARY KEY (id)) $charset_collate;";
        $sql[] = "CREATE TABLE {$prefix}onegodian_capital_certificates (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, certificate_id VARCHAR(100) NOT NULL, instrument_id BIGINT UNSIGNED NOT NULL, issued_at DATETIME NOT NULL, verification_hash VARCHAR(255) NULL, PRIMARY KEY (id), UNIQUE KEY certificate_id (certificate_id)) $charset_collate;";

        foreach ($sql as $statement) {
            dbDelta($statement);
        }
    }
}
