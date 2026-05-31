<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_PDF_Signature_Activator
{
    public static function activate(): void
    {
        global $wpdb;

        $charset = $wpdb->get_charset_collate();
        $documents = ALGQ_PDF_Signature_Repository::documents_table();
        $events = ALGQ_PDF_Signature_Repository::events_table();

        $documents_sql = "CREATE TABLE {$documents} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            document_uid varchar(40) NOT NULL,
            title varchar(191) NOT NULL,
            document_type varchar(80) NOT NULL DEFAULT 'purchase_agreement',
            related_deal_id varchar(64) DEFAULT '',
            recipient_name varchar(191) NOT NULL,
            recipient_email varchar(191) NOT NULL,
            signer_name varchar(191) DEFAULT '',
            signature_hash varchar(128) DEFAULT '',
            status varchar(40) NOT NULL DEFAULT 'draft',
            execution_status varchar(40) NOT NULL DEFAULT 'not_started',
            source_payload longtext NULL,
            rendered_html longtext NULL,
            pdf_checksum varchar(128) DEFAULT '',
            archived_at datetime NULL,
            sent_at datetime NULL,
            signed_at datetime NULL,
            expires_at datetime NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY document_uid (document_uid),
            KEY document_type (document_type),
            KEY related_deal_id (related_deal_id),
            KEY status (status),
            KEY execution_status (execution_status),
            KEY recipient_email (recipient_email)
        ) {$charset};";

        $events_sql = "CREATE TABLE {$events} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            document_id bigint(20) unsigned NOT NULL,
            event_type varchar(80) NOT NULL,
            actor varchar(191) DEFAULT '',
            actor_ip varchar(64) DEFAULT '',
            message text NULL,
            metadata longtext NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY document_id (document_id),
            KEY event_type (event_type),
            KEY created_at (created_at)
        ) {$charset};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($documents_sql);
        dbDelta($events_sql);
    }
}
