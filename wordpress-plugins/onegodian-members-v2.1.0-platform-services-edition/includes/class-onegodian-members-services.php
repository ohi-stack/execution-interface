<?php
if (!defined('ABSPATH')) {
    exit;
}

class OneGodian_Members_Services {
    private $boundaries;

    public function __construct() {
        $this->boundaries = array(
            'auth' => array('status' => 'active', 'description' => 'Authentication session and member identity adapter boundary.'),
            'rbac' => array('status' => 'active', 'description' => 'Roles, capabilities, and protected action policy boundary.'),
            'dashboard' => array('status' => 'active', 'description' => 'Member dashboard read-model and status cards boundary.'),
            'lms' => array('status' => 'active', 'description' => 'Learning progress, course entitlement, and completion evidence boundary.'),
            'belief_mapper' => array('status' => 'active', 'description' => 'Belief Mapper profile and journey reflection boundary.'),
            'media' => array('status' => 'active', 'description' => 'Protected member media catalog and playback authorization boundary.'),
            'galaxy' => array('status' => 'active', 'description' => 'Galaxy membership tier and constellation navigation boundary.'),
            'registry' => array('status' => 'active', 'description' => 'Canonical member registry adapter boundary.'),
            'certificate' => array('status' => 'active', 'description' => 'Certificate, PDF, and digital credential issuance boundary.'),
            'digital_id' => array('status' => 'active', 'description' => 'Digital ID verification and presentation boundary.'),
            'woocommerce' => array('status' => 'active', 'description' => 'WooCommerce entitlement and order synchronization boundary.'),
            'stripe' => array('status' => 'active', 'description' => 'Stripe checkout and subscription reference boundary; secrets are stored only in WordPress options.'),
            'app_bridge' => array('status' => 'active', 'description' => 'Mobile/app bridge safe JSON contract boundary.'),
            'protected_content' => array('status' => 'active', 'description' => 'Protected content gates and shortcode rendering boundary.'),
            'buddypress' => array('status' => 'conditional', 'description' => 'BuddyPress profile, activity, group, and member navigation integration when BuddyPress is active.'),
            'auto_pages' => array('status' => 'active', 'description' => 'Activation-created dashboard, auth, certificate, digital ID, and community pages.'),
        );
    }

    public function get_boundaries() {
        return $this->boundaries;
    }

    public function get_status() {
        return array(
            'plugin' => 'onegodian-members',
            'version' => ONEGODIAN_MEMBERS_VERSION,
            'status' => 'ok',
            'rest_namespace' => ONEGODIAN_MEMBERS_REST_NAMESPACE,
            'buddypress_active' => $this->is_buddypress_active(),
            'woocommerce_active' => class_exists('WooCommerce'),
            'service_boundaries' => $this->get_boundaries(),
        );
    }

    public function is_buddypress_active() {
        return function_exists('buddypress') || class_exists('BuddyPress');
    }

    public function current_member_payload() {
        $user = wp_get_current_user();
        $authenticated = $user && $user->exists();

        return array(
            'authenticated' => (bool) $authenticated,
            'id' => $authenticated ? (int) $user->ID : 0,
            'display_name' => $authenticated ? $user->display_name : '',
            'roles' => $authenticated ? array_values((array) $user->roles) : array(),
            'capabilities' => array(
                'manage_members' => current_user_can('manage_onegodian_members'),
                'read_member_data' => current_user_can('read_onegodian_member_data') || current_user_can('read'),
            ),
        );
    }

    public function dashboard_payload() {
        return array(
            'member' => $this->current_member_payload(),
            'cards' => array(
                array('key' => 'certificate', 'label' => 'Certificate', 'state' => 'available'),
                array('key' => 'digital_id', 'label' => 'Digital ID', 'state' => 'available'),
                array('key' => 'lms', 'label' => 'LMS Progress', 'state' => 'ready'),
                array('key' => 'belief_mapper', 'label' => 'Belief Mapper', 'state' => 'ready'),
                array('key' => 'media', 'label' => 'Media Library', 'state' => 'ready'),
                array('key' => 'galaxy', 'label' => 'Galaxy', 'state' => 'ready'),
                array('key' => 'registry', 'label' => 'Registry', 'state' => 'ready'),
            ),
        );
    }

    public function certificate_payload($user_id = 0) {
        $user_id = $user_id ? absint($user_id) : get_current_user_id();
        $hash = hash('sha256', 'onegodian-members|' . ONEGODIAN_MEMBERS_VERSION . '|' . $user_id);

        return array(
            'user_id' => $user_id,
            'certificate_id' => 'OG-CERT-' . strtoupper(substr($hash, 0, 12)),
            'pdf_available' => true,
            'digital_id_available' => true,
            'verification_url' => home_url('/wp-json/' . ONEGODIAN_MEMBERS_REST_NAMESPACE . '/certificate/verify/' . strtoupper(substr($hash, 0, 12))),
        );
    }

    public function entitlement_payload() {
        return array(
            'woocommerce' => array('active' => class_exists('WooCommerce'), 'sync' => 'available'),
            'stripe' => array('configured' => (bool) get_option('onegodian_members_stripe_mode', ''), 'mode' => sanitize_key(get_option('onegodian_members_stripe_mode', 'not_configured'))),
            'protected_content' => array('active' => true, 'policy' => 'authenticated_member_or_capability'),
        );
    }
}
