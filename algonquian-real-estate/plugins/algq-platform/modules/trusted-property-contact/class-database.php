<?php
if (!defined('ABSPATH')) { exit; }

final class ALGQ_TPC_Database {
    public static function table($name) { global $wpdb; return $wpdb->prefix . 'algq_' . $name; }
    public static function uid() { return wp_generate_uuid4(); }

    public static function install() {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $c = $wpdb->get_charset_collate();
        $base = "id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, public_uid CHAR(36) NOT NULL, status VARCHAR(40) NOT NULL DEFAULT 'active', created_by BIGINT UNSIGNED NULL, assigned_to BIGINT UNSIGNED NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, access_level VARCHAR(30) NOT NULL DEFAULT 'private', audit_version BIGINT UNSIGNED NOT NULL DEFAULT 1,";
        $tables = array(
            'stewardship_clients' => "user_id BIGINT UNSIGNED NULL, owner_name VARCHAR(190) NOT NULL, email VARCHAR(190) NOT NULL, phone VARCHAR(80) NULL, preferred_communication VARCHAR(30) NOT NULL DEFAULT 'email', secondary_contacts LONGTEXT NULL, retention_until DATE NULL",
            'stewardship_properties' => "client_id BIGINT UNSIGNED NOT NULL, address_1 VARCHAR(190) NOT NULL, address_2 VARCHAR(190) NULL, city VARCHAR(100) NOT NULL, region VARCHAR(100) NULL, postal_code VARCHAR(30) NULL, occupancy_status VARCHAR(30) NOT NULL, access_instructions_encrypted LONGTEXT NULL, assigned_staff_id BIGINT UNSIGNED NULL, service_start DATE NULL, service_end DATE NULL, service_level VARCHAR(40) NOT NULL",
            'stewardship_authorizations' => "client_id BIGINT UNSIGNED NOT NULL, property_id BIGINT UNSIGNED NOT NULL, authorized_services LONGTEXT NULL, may_contact_vendors TINYINT(1) NOT NULL DEFAULT 0, may_enter_property TINYINT(1) NOT NULL DEFAULT 0, may_receive_invoices TINYINT(1) NOT NULL DEFAULT 0, may_approve_work TINYINT(1) NOT NULL DEFAULT 0, spending_limit DECIMAL(12,2) NOT NULL DEFAULT 0, approval_threshold DECIMAL(12,2) NOT NULL DEFAULT 0, emergency_instructions_encrypted LONGTEXT NULL, signed_document_id BIGINT UNSIGNED NULL, effective_at DATETIME NULL, expires_at DATETIME NULL, consent_snapshot LONGTEXT NULL",
            'property_visits' => "property_id BIGINT UNSIGNED NOT NULL, recurrence_rule VARCHAR(190) NULL, scheduled_at DATETIME NULL, arrived_at DATETIME NULL, completed_at DATETIME NULL, inspector_id BIGINT UNSIGNED NULL, exterior_observations LONGTEXT NULL, interior_observations LONGTEXT NULL, findings LONGTEXT NULL, urgent TINYINT(1) NOT NULL DEFAULT 0, follow_up_required TINYINT(1) NOT NULL DEFAULT 0, report_document_id BIGINT UNSIGNED NULL",
            'visit_checklist_items' => "visit_id BIGINT UNSIGNED NOT NULL, item_key VARCHAR(100) NOT NULL, label VARCHAR(190) NOT NULL, result VARCHAR(40) NULL, notes TEXT NULL, completed_at DATETIME NULL",
            'visit_photos' => "visit_id BIGINT UNSIGNED NOT NULL, attachment_id BIGINT UNSIGNED NOT NULL, captured_at DATETIME NULL, caption TEXT NULL, file_hash VARCHAR(128) NULL",
            'service_requests' => "property_id BIGINT UNSIGNED NOT NULL, client_id BIGINT UNSIGNED NULL, category VARCHAR(40) NOT NULL, priority VARCHAR(30) NOT NULL DEFAULT 'normal', description LONGTEXT NOT NULL, owner_authorization_status VARCHAR(30) NOT NULL DEFAULT 'pending', emergency TINYINT(1) NOT NULL DEFAULT 0, approved_by BIGINT UNSIGNED NULL, approved_at DATETIME NULL",
            'vendor_assignments' => "service_request_id BIGINT UNSIGNED NOT NULL, vendor_user_id BIGINT UNSIGNED NULL, vendor_name VARCHAR(190) NOT NULL, vendor_email VARCHAR(190) NULL, vendor_phone VARCHAR(80) NULL, insurance_document_id BIGINT UNSIGNED NULL, scheduled_at DATETIME NULL, arrived_at DATETIME NULL, completed_at DATETIME NULL",
            'service_estimates' => "service_request_id BIGINT UNSIGNED NOT NULL, vendor_assignment_id BIGINT UNSIGNED NULL, amount DECIMAL(12,2) NOT NULL DEFAULT 0, scope LONGTEXT NULL, attachment_id BIGINT UNSIGNED NULL, decision VARCHAR(30) NOT NULL DEFAULT 'pending', decided_by BIGINT UNSIGNED NULL, decided_at DATETIME NULL",
            'service_expenses' => "service_request_id BIGINT UNSIGNED NOT NULL, estimate_id BIGINT UNSIGNED NULL, amount DECIMAL(12,2) NOT NULL DEFAULT 0, expense_type VARCHAR(40) NULL, attachment_id BIGINT UNSIGNED NULL, approved_by BIGINT UNSIGNED NULL, approved_at DATETIME NULL, warranty_document_id BIGINT UNSIGNED NULL",
            'incidents' => "property_id BIGINT UNSIGNED NOT NULL, service_request_id BIGINT UNSIGNED NULL, incident_type VARCHAR(80) NOT NULL, summary LONGTEXT NOT NULL, mitigation_actions LONGTEXT NULL, escalation_stage VARCHAR(40) NULL, external_references LONGTEXT NULL, occurred_at DATETIME NULL, resolved_at DATETIME NULL, report_document_id BIGINT UNSIGNED NULL",
            'emergency_contacts' => "client_id BIGINT UNSIGNED NOT NULL, property_id BIGINT UNSIGNED NULL, contact_name VARCHAR(190) NOT NULL, relationship VARCHAR(100) NULL, phone VARCHAR(80) NULL, email VARCHAR(190) NULL, contact_order INT UNSIGNED NOT NULL DEFAULT 1, instructions_encrypted LONGTEXT NULL",
            'client_messages' => "client_id BIGINT UNSIGNED NOT NULL, property_id BIGINT UNSIGNED NULL, sender_id BIGINT UNSIGNED NOT NULL, recipient_id BIGINT UNSIGNED NULL, subject VARCHAR(190) NULL, message LONGTEXT NOT NULL, read_at DATETIME NULL, delivery_status VARCHAR(40) NULL",
            'stewardship_documents' => "client_id BIGINT UNSIGNED NULL, property_id BIGINT UNSIGNED NULL, related_type VARCHAR(60) NULL, related_id BIGINT UNSIGNED NULL, document_type VARCHAR(80) NOT NULL, title VARCHAR(190) NOT NULL, attachment_id BIGINT UNSIGNED NULL, file_hash VARCHAR(128) NULL, generated_at DATETIME NULL, expires_at DATETIME NULL",
            'stewardship_activity_log' => "client_id BIGINT UNSIGNED NULL, property_id BIGINT UNSIGNED NULL, actor_id BIGINT UNSIGNED NULL, action VARCHAR(80) NOT NULL, object_type VARCHAR(60) NOT NULL, object_id BIGINT UNSIGNED NULL, ip_hash VARCHAR(128) NULL, metadata LONGTEXT NULL, occurred_at DATETIME NOT NULL",
        );
        foreach ($tables as $name => $columns) {
            $sql = 'CREATE TABLE ' . self::table($name) . " ($base $columns, PRIMARY KEY (id), UNIQUE KEY public_uid (public_uid), KEY status (status), KEY assigned_to (assigned_to), KEY created_at (created_at)) $c;";
            dbDelta($sql);
        }
        update_option('algq_tpc_db_version', ALGQ_Trusted_Property_Contact_Module::VERSION);
    }

    public static function log($action, $type, $id = null, $context = array()) {
        global $wpdb;
        $ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '';
        $wpdb->insert(self::table('stewardship_activity_log'), array(
            'public_uid' => self::uid(), 'status' => 'recorded', 'created_by' => get_current_user_id(), 'assigned_to' => null,
            'created_at' => current_time('mysql'), 'updated_at' => current_time('mysql'), 'access_level' => 'restricted', 'audit_version' => 1,
            'client_id' => isset($context['client_id']) ? absint($context['client_id']) : null, 'property_id' => isset($context['property_id']) ? absint($context['property_id']) : null,
            'actor_id' => get_current_user_id(), 'action' => sanitize_key($action), 'object_type' => sanitize_key($type), 'object_id' => $id ? absint($id) : null,
            'ip_hash' => hash_hmac('sha256', $ip, wp_salt('auth')), 'metadata' => wp_json_encode($context), 'occurred_at' => current_time('mysql'),
        ));
    }

    public static function encrypt($plaintext) {
        if (!$plaintext) { return ''; }
        if (!function_exists('openssl_encrypt')) { return new WP_Error('encryption_unavailable', __('Secure storage is unavailable.', 'algq-platform')); }
        $key = hash('sha256', wp_salt('secure_auth'), true); $iv = random_bytes(12); $tag = '';
        $cipher = openssl_encrypt($plaintext, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);
        return base64_encode($iv . $tag . $cipher);
    }

    public static function decrypt($payload) {
        if (!current_user_can('algq_view_sensitive_property_data') || !$payload || !function_exists('openssl_decrypt')) { return ''; }
        $raw = base64_decode($payload, true); if (false === $raw || strlen($raw) < 29) { return ''; }
        return (string) openssl_decrypt(substr($raw, 28), 'aes-256-gcm', hash('sha256', wp_salt('secure_auth'), true), OPENSSL_RAW_DATA, substr($raw, 0, 12), substr($raw, 12, 16));
    }
}
