<?php
if (!defined('ABSPATH')) {
    exit;
}

class INO_Platform_Generic_Module extends INO_Platform_Module {
    private $description;
    private $features;
    private $route;
    private $post_type;
    private $operational_status;

    public function __construct($plugin, $slug, $label, $description, $features = array(), $capability = 'ino_read_member_area', $route = '', $post_type = 'ino_record', $operational_status = 'documented_boundary') {
        parent::__construct($plugin, $slug, __($label, 'ino-platform'), $capability);
        $this->description = $description;
        $this->features = $features;
        $this->route = $route ? $route : '/' . str_replace('_', '-', $slug);
        $this->post_type = $post_type;
        $this->operational_status = $operational_status;
    }

    public function register_hooks() {
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    public function activation() {
        update_option('ino_platform_' . $this->slug() . '_schema_version', INO_PLATFORM_VERSION);
    }

    public function schema() {
        return array(
            'module' => $this->slug(),
            'label' => $this->label(),
            'description' => $this->description,
            'features' => $this->features,
            'post_type' => $this->post_type,
            'capability' => $this->capability(),
            'operational_status' => $this->operational_status,
        );
    }

    public function register_rest_routes() {
        register_rest_route(INO_PLATFORM_REST_NAMESPACE, $this->route, array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'read_model'),
            'permission_callback' => array($this, 'rest_permission'),
        ));
    }

    public function read_model($request) {
        return rest_ensure_response($this->schema());
    }
}
