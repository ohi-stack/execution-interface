<?php
if (!defined('ABSPATH')) { exit; }
class INO_PSRP_REST {
    private $data;
    public function __construct($data) { $this->data = $data; }
    public function init() { add_action('rest_api_init', array($this, 'routes')); }
    public function routes() {
        register_rest_route('ino-pequot/v1', '/health', array('methods' => 'GET', 'callback' => array($this, 'health'), 'permission_callback' => '__return_true'));
        register_rest_route('ino-pequot/v1', '/manifest', array('methods' => 'GET', 'callback' => array($this, 'manifest'), 'permission_callback' => '__return_true'));
    }
    public function health() { return rest_ensure_response(array('ok' => true, 'module' => 'ino-pequot-street-redevelopment', 'version' => INO_PSRP_VERSION)); }
    public function manifest() { return rest_ensure_response($this->data->manifest()); }
}
