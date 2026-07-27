<?php
if (!defined('ABSPATH')) { exit; }
final class ALGQ_TPC_Notification_Service {
    public static function send($to, $template, $tokens = array()) {
        $subjects = array('visit_complete' => __('Property visit completed', 'algq-platform'), 'approval_required' => __('Your approval is required', 'algq-platform'), 'emergency' => __('Urgent property alert', 'algq-platform'), 'authorization_expiring' => __('Service authorization expiring', 'algq-platform'));
        $subject = $subjects[$template] ?? __('Property stewardship update', 'algq-platform');
        $message = isset($tokens['message']) ? sanitize_textarea_field($tokens['message']) : $subject;
        $sent = function_exists('algq_send_mail') ? algq_send_mail(array('module'=>'trusted_property_contact','event'=>$template,'recipient'=>sanitize_email($to),'subject'=>$subject,'body'=>$message,'template'=>$template,'confidentiality'=>'private')) : false;
        $delivered = !is_wp_error($sent) && (bool) $sent;
        ALGQ_TPC_Database::log($delivered ? 'notification_delivered' : 'notification_failed', 'communication', null, array('template' => $template)); return $delivered;
    }
    public static function run_scheduled_rules() {
        global $wpdb; $now = current_time('mysql'); $in_thirty = gmdate('Y-m-d H:i:s', current_time('timestamp', true) + DAY_IN_SECONDS * 30);
        $expiring = $wpdb->get_results($wpdb->prepare('SELECT a.id,c.email FROM ' . ALGQ_TPC_Database::table('stewardship_authorizations') . ' a JOIN ' . ALGQ_TPC_Database::table('stewardship_clients') . ' c ON c.id=a.client_id WHERE a.status=%s AND a.expires_at BETWEEN %s AND %s', 'active', $now, $in_thirty));
        foreach ($expiring as $row) { self::send($row->email, 'authorization_expiring'); }
        $overdue = $wpdb->get_results($wpdb->prepare('SELECT id,property_id FROM ' . ALGQ_TPC_Database::table('property_visits') . ' WHERE status=%s AND scheduled_at < %s', 'scheduled', $now));
        foreach ($overdue as $visit) { $wpdb->update(ALGQ_TPC_Database::table('property_visits'), array('status' => 'overdue', 'updated_at' => $now), array('id' => $visit->id)); ALGQ_TPC_Database::log('overdue', 'visit', $visit->id, array('property_id' => $visit->property_id)); }
    }
}
