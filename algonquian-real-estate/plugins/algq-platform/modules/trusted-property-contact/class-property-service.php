<?php
if (!defined('ABSPATH')) { exit; }
final class ALGQ_TPC_Property_Service {
    const OCCUPANCIES = array('occupied', 'seasonal', 'vacant', 'inherited', 'transition_pending');
    const LEVELS = array('essential_watch', 'active_steward', 'transition_support');
    public static function user_can_access($property_id) {
        if (current_user_can('algq_view_stewardship_clients')) { return true; }
        global $wpdb; $client_id = ALGQ_TPC_Client_Service::client_id_for_user();
        return $client_id && (int) $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM ' . ALGQ_TPC_Database::table('stewardship_properties') . ' WHERE id=%d AND client_id=%d', $property_id, $client_id));
    }
    public static function for_current_user() {
        global $wpdb; $table = ALGQ_TPC_Database::table('stewardship_properties');
        if (current_user_can('algq_view_stewardship_clients')) { return $wpdb->get_results("SELECT * FROM $table WHERE status != 'deleted' ORDER BY updated_at DESC"); }
        $client_id = ALGQ_TPC_Client_Service::client_id_for_user();
        return $client_id ? $wpdb->get_results($wpdb->prepare("SELECT * FROM $table WHERE client_id=%d AND status != %s ORDER BY updated_at DESC", $client_id, 'deleted')) : array();
    }
}
