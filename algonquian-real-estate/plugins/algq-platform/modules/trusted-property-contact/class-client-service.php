<?php
if (!defined('ABSPATH')) { exit; }
final class ALGQ_TPC_Client_Service {
    public static function create($data) {
        if (!current_user_can('algq_manage_stewardship_clients')) { return new WP_Error('forbidden', __('You cannot manage stewardship clients.', 'algq-platform'), array('status' => 403)); }
        global $wpdb; $now = current_time('mysql');
        $row = array('public_uid' => ALGQ_TPC_Database::uid(), 'status' => 'active', 'created_by' => get_current_user_id(), 'assigned_to' => absint($data['assigned_to'] ?? 0), 'created_at' => $now, 'updated_at' => $now, 'access_level' => 'private', 'audit_version' => 1, 'user_id' => absint($data['user_id'] ?? 0), 'owner_name' => sanitize_text_field($data['owner_name'] ?? ''), 'email' => sanitize_email($data['email'] ?? ''), 'phone' => sanitize_text_field($data['phone'] ?? ''), 'preferred_communication' => sanitize_key($data['preferred_communication'] ?? 'email'), 'secondary_contacts' => wp_json_encode($data['secondary_contacts'] ?? array()));
        if (!$row['owner_name'] || !is_email($row['email'])) { return new WP_Error('invalid_client', __('A name and valid email are required.', 'algq-platform'), array('status' => 400)); }
        $wpdb->insert(ALGQ_TPC_Database::table('stewardship_clients'), $row); $id = (int) $wpdb->insert_id;
        ALGQ_TPC_Database::log('created', 'client', $id, array('client_id' => $id)); return $id;
    }

    public static function client_id_for_user($user_id = 0) {
        global $wpdb; $user_id = $user_id ?: get_current_user_id();
        return (int) $wpdb->get_var($wpdb->prepare('SELECT id FROM ' . ALGQ_TPC_Database::table('stewardship_clients') . ' WHERE user_id=%d AND status != %s LIMIT 1', $user_id, 'deleted'));
    }
}
