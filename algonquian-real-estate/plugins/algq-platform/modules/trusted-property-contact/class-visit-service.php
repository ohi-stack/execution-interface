<?php
if (!defined('ABSPATH')) { exit; }
final class ALGQ_TPC_Visit_Service {
    public static function complete($visit_id, $observations) {
        if (!current_user_can('algq_manage_property_visits')) { return new WP_Error('forbidden', __('You cannot complete visits.', 'algq-platform')); }
        global $wpdb; $visit = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . ALGQ_TPC_Database::table('property_visits') . ' WHERE id=%d', $visit_id));
        if (!$visit || !ALGQ_TPC_Property_Service::user_can_access($visit->property_id)) { return new WP_Error('not_found', __('Visit not found.', 'algq-platform')); }
        $wpdb->update(ALGQ_TPC_Database::table('property_visits'), array('status' => 'completed', 'completed_at' => current_time('mysql'), 'updated_at' => current_time('mysql'), 'exterior_observations' => wp_kses_post($observations['exterior'] ?? ''), 'interior_observations' => wp_kses_post($observations['interior'] ?? ''), 'findings' => wp_kses_post($observations['findings'] ?? ''), 'urgent' => empty($observations['urgent']) ? 0 : 1, 'follow_up_required' => empty($observations['follow_up_required']) ? 0 : 1), array('id' => $visit_id));
        ALGQ_TPC_Database::log('completed', 'visit', $visit_id, array('property_id' => $visit->property_id));
        do_action('algq_stewardship_visit_completed', $visit_id); return true;
    }
}
