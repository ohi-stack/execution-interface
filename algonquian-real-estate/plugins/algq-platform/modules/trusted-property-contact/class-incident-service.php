<?php
if (!defined('ABSPATH')) { exit; }
final class ALGQ_TPC_Incident_Service {
    public static function create_from_request($request_id) {
        if (!current_user_can('algq_manage_incidents')) { return new WP_Error('forbidden', __('Incident management permission is required.', 'algq-platform')); }
        global $wpdb; $request = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . ALGQ_TPC_Database::table('service_requests') . ' WHERE id=%d', $request_id));
        if (!$request || !ALGQ_TPC_Property_Service::user_can_access($request->property_id)) { return new WP_Error('not_found', __('Service request not found.', 'algq-platform')); }
        $now = current_time('mysql'); $wpdb->insert(ALGQ_TPC_Database::table('incidents'), array('public_uid' => ALGQ_TPC_Database::uid(), 'status' => 'active', 'created_by' => get_current_user_id(), 'assigned_to' => $request->assigned_to, 'created_at' => $now, 'updated_at' => $now, 'access_level' => 'restricted', 'audit_version' => 1, 'property_id' => $request->property_id, 'service_request_id' => $request_id, 'incident_type' => $request->category, 'summary' => $request->description, 'escalation_stage' => 'owner_notification', 'occurred_at' => $now));
        $id = (int) $wpdb->insert_id; ALGQ_TPC_Database::log('created', 'incident', $id, array('property_id' => $request->property_id)); return $id;
    }
}
