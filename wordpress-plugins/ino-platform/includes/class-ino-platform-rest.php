<?php
if (!defined('ABSPATH')) {
    exit;
}

class INO_Platform_REST {
    private $plugin;
    public function __construct($plugin) { $this->plugin = $plugin; }
    public function register_routes() {
        register_rest_route(INO_PLATFORM_REST_NAMESPACE, '/status', array('methods' => WP_REST_Server::READABLE, 'callback' => array($this, 'status'), 'permission_callback' => '__return_true'));
        register_rest_route(INO_PLATFORM_REST_NAMESPACE, '/modules', array('methods' => WP_REST_Server::READABLE, 'callback' => array($this, 'modules'), 'permission_callback' => array($this, 'member_permission')));
    }
    public function member_permission() { return is_user_logged_in() && current_user_can('ino_read_member_area'); }
    public function status() { return rest_ensure_response(array('name' => 'INO Platform', 'version' => INO_PLATFORM_VERSION, 'namespace' => INO_PLATFORM_REST_NAMESPACE)); }
    public function modules() { return rest_ensure_response(array_map(function($module) { return $module->schema(); }, $this->plugin->modules())); }
}
