<?php
if (!defined('ABSPATH')) { exit; }
final class ALGQ_TPC_Authorization_Service {
    public static function can_coordinate($property_id, $permission, $amount = 0) {
        global $wpdb; $allowed = array('may_contact_vendors', 'may_enter_property', 'may_receive_invoices', 'may_approve_work');
        if (!in_array($permission, $allowed, true)) { return false; }
        $row = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . ALGQ_TPC_Database::table('stewardship_authorizations') . ' WHERE property_id=%d AND status=%s AND (expires_at IS NULL OR expires_at >= %s) ORDER BY effective_at DESC LIMIT 1', $property_id, 'active', current_time('mysql')));
        if (!$row || !(int) $row->{$permission}) { return false; }
        if ($amount > 0 && ($amount > (float) $row->spending_limit || $amount > (float) $row->approval_threshold)) { return false; }
        return true;
    }
    public static function disclaimer() { return __('Algonquian Real Estate provides property stewardship and coordination only. ARE is not acting as an attorney, trustee, executor, conservator, guardian, financial adviser, or power of attorney.', 'algq-platform'); }
}
