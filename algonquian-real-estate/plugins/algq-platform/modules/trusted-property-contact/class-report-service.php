<?php
if (!defined('ABSPATH')) { exit; }
final class ALGQ_TPC_Report_Service {
    public static function document_types() { return array('service_authorization_agreement', 'property_information_sheet', 'emergency_instructions_form', 'property_visit_checklist', 'property_condition_report', 'maintenance_authorization', 'vendor_estimate_comparison', 'incident_report', 'monthly_stewardship_report', 'service_termination_transition_form'); }
    public static function condition_report($visit_id) {
        global $wpdb; $visit = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . ALGQ_TPC_Database::table('property_visits') . ' WHERE id=%d', $visit_id));
        if (!$visit || !ALGQ_TPC_Property_Service::user_can_access($visit->property_id)) { return new WP_Error('forbidden', __('Report access denied.', 'algq-platform')); }
        ALGQ_TPC_Database::log('viewed', 'visit_report', $visit_id, array('property_id' => $visit->property_id));
        return array('visit' => $visit, 'checklist' => $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . ALGQ_TPC_Database::table('visit_checklist_items') . ' WHERE visit_id=%d ORDER BY id', $visit_id)), 'photos' => $wpdb->get_results($wpdb->prepare('SELECT id,captured_at,caption FROM ' . ALGQ_TPC_Database::table('visit_photos') . ' WHERE visit_id=%d ORDER BY captured_at', $visit_id)));
    }
}
