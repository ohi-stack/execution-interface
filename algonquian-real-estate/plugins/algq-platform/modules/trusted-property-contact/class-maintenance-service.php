<?php
if (!defined('ABSPATH')) { exit; }
final class ALGQ_TPC_Maintenance_Service {
    const CATEGORIES = array('plumbing', 'electrical', 'hvac', 'landscaping', 'security', 'structural', 'cleaning', 'storm_damage', 'general_maintenance');
    public static function create_request($data) {
        $property_id = absint($data['property_id'] ?? 0);
        if (!$property_id || !ALGQ_TPC_Property_Service::user_can_access($property_id)) { return new WP_Error('forbidden', __('Property access denied.', 'algq-platform'), array('status' => 403)); }
        $category = sanitize_key($data['category'] ?? 'general_maintenance'); if (!in_array($category, self::CATEGORIES, true)) { $category = 'general_maintenance'; }
        global $wpdb; $now = current_time('mysql'); $client_id = ALGQ_TPC_Client_Service::client_id_for_user();
        $wpdb->insert(ALGQ_TPC_Database::table('service_requests'), array('public_uid' => ALGQ_TPC_Database::uid(), 'status' => 'proposed', 'created_by' => get_current_user_id(), 'assigned_to' => 0, 'created_at' => $now, 'updated_at' => $now, 'access_level' => 'private', 'audit_version' => 1, 'property_id' => $property_id, 'client_id' => $client_id ?: null, 'category' => $category, 'priority' => sanitize_key($data['priority'] ?? 'normal'), 'description' => sanitize_textarea_field($data['description'] ?? ''), 'owner_authorization_status' => 'pending', 'emergency' => empty($data['emergency']) ? 0 : 1));
        $id = (int) $wpdb->insert_id; ALGQ_TPC_Database::log('created', 'service_request', $id, array('client_id' => $client_id, 'property_id' => $property_id));
        if (!empty($data['emergency'])) { do_action('algq_stewardship_emergency_reported', $id); } return $id;
    }
}
