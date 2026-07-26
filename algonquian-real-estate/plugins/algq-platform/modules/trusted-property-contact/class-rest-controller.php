<?php
if (!defined('ABSPATH')) { exit; }
final class ALGQ_TPC_REST_Controller {
    public static function register() { add_action('rest_api_init', array(__CLASS__, 'routes')); }
    public static function routes() {
        register_rest_route('algq/v1', '/stewardship/properties', array('methods' => 'GET', 'callback' => array(__CLASS__, 'properties'), 'permission_callback' => 'is_user_logged_in'));
        register_rest_route('algq/v1', '/stewardship/service-requests', array('methods' => 'POST', 'callback' => array(__CLASS__, 'service_request'), 'permission_callback' => 'is_user_logged_in', 'args' => array('property_id' => array('required' => true, 'type' => 'integer'), 'description' => array('required' => true, 'type' => 'string'))));
        register_rest_route('algq/v1', '/stewardship/documents/(?P<id>\d+)/download', array('methods' => 'GET', 'callback' => array(__CLASS__, 'download'), 'permission_callback' => 'is_user_logged_in'));
    }
    public static function properties() { return rest_ensure_response(ALGQ_TPC_Property_Service::for_current_user()); }
    public static function service_request(WP_REST_Request $request) { $result = ALGQ_TPC_Maintenance_Service::create_request($request->get_json_params()); return is_wp_error($result) ? $result : new WP_REST_Response(array('id' => $result), 201); }
    public static function download(WP_REST_Request $request) {
        global $wpdb; $doc = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . ALGQ_TPC_Database::table('stewardship_documents') . ' WHERE id=%d', absint($request['id'])));
        if (!$doc || ($doc->property_id && !ALGQ_TPC_Property_Service::user_can_access($doc->property_id))) { return new WP_Error('forbidden', __('Document access denied.', 'algq-platform'), array('status' => 403)); }
        $url = wp_get_attachment_url($doc->attachment_id); if (!$url) { return new WP_Error('not_found', __('Document not found.', 'algq-platform'), array('status' => 404)); }
        ALGQ_TPC_Database::log('downloaded', 'document', $doc->id, array('client_id' => $doc->client_id, 'property_id' => $doc->property_id));
        return new WP_REST_Response(array('download_url' => add_query_arg(array('algq_private_document' => $doc->public_uid, '_wpnonce' => wp_create_nonce('algq_download_' . $doc->id)), home_url('/'))));
    }
}
