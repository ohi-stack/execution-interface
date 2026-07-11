<?php
if (!defined('ABSPATH')) {
    exit;
}

class OneGodian_Members_REST {
    private $services;

    public function __construct(OneGodian_Members_Services $services) {
        $this->services = $services;
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    public function register_routes() {
        register_rest_route(ONEGODIAN_MEMBERS_REST_NAMESPACE, '/status', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'status'),
            'permission_callback' => '__return_true',
        ));
        register_rest_route(ONEGODIAN_MEMBERS_REST_NAMESPACE, '/services', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'services'),
            'permission_callback' => '__return_true',
        ));
        register_rest_route(ONEGODIAN_MEMBERS_REST_NAMESPACE, '/dashboard', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'dashboard'),
            'permission_callback' => array($this, 'member_permission'),
        ));
        register_rest_route(ONEGODIAN_MEMBERS_REST_NAMESPACE, '/member/me', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'member'),
            'permission_callback' => array($this, 'member_permission'),
        ));
        register_rest_route(ONEGODIAN_MEMBERS_REST_NAMESPACE, '/certificate', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'certificate'),
            'permission_callback' => array($this, 'member_permission'),
        ));
        register_rest_route(ONEGODIAN_MEMBERS_REST_NAMESPACE, '/certificate/verify/(?P<id>[A-Z0-9-]+)', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'verify_certificate'),
            'permission_callback' => '__return_true',
            'args' => array('id' => array('sanitize_callback' => 'sanitize_text_field')),
        ));
        register_rest_route(ONEGODIAN_MEMBERS_REST_NAMESPACE, '/entitlements', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'entitlements'),
            'permission_callback' => array($this, 'member_permission'),
        ));
        register_rest_route(ONEGODIAN_MEMBERS_REST_NAMESPACE, '/app-bridge', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'app_bridge'),
            'permission_callback' => '__return_true',
        ));
    }

    public function member_permission() {
        return is_user_logged_in() || current_user_can('manage_onegodian_members');
    }

    public function status() {
        return rest_ensure_response($this->services->get_status());
    }

    public function services() {
        return rest_ensure_response(array('service_boundaries' => $this->services->get_boundaries()));
    }

    public function dashboard() {
        return rest_ensure_response($this->services->dashboard_payload());
    }

    public function member() {
        return rest_ensure_response($this->services->current_member_payload());
    }

    public function certificate() {
        return rest_ensure_response($this->services->certificate_payload());
    }

    public function verify_certificate(WP_REST_Request $request) {
        return rest_ensure_response(array(
            'certificate_id' => sanitize_text_field($request['id']),
            'valid_format' => (bool) preg_match('/^[A-Z0-9-]+$/', $request['id']),
            'status' => 'verification_boundary',
        ));
    }

    public function entitlements() {
        return rest_ensure_response($this->services->entitlement_payload());
    }

    public function app_bridge() {
        return rest_ensure_response(array(
            'enabled' => (bool) get_option('onegodian_members_app_bridge_enabled', true),
            'version' => ONEGODIAN_MEMBERS_VERSION,
            'routes' => array(
                '/status', '/services', '/dashboard', '/member/me', '/certificate', '/entitlements', '/app-bridge',
            ),
        ));
    }
}
