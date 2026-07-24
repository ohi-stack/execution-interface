<?php
if (!defined('ABSPATH')) {
    exit;
}

class INO_Platform_Genealogy extends INO_Platform_Module {
    public function __construct($plugin) {
        parent::__construct($plugin, 'genealogy', __('Genealogy', 'ino-platform'), 'ino_manage_records');
    }

    public function register_hooks() {
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    public function activation() {
        update_option('ino_platform_genealogy_schema_version', INO_PLATFORM_VERSION);
    }

    public function schema() {
        return array(
            'module' => 'genealogy',
            'label' => 'Genealogy',
            'description' => 'Genealogy records, family links, evidence notes, and review status.',
            'post_type' => 'ino_genealogy',
            'capability' => $this->capability(),
        );
    }

    public function register_rest_routes() {
        register_rest_route(INO_PLATFORM_REST_NAMESPACE, '/lineage', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'list_records'),
                'permission_callback' => array($this, 'rest_permission'),
            ),
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_record'),
                'permission_callback' => array($this, 'rest_permission'),
                'args' => array(
                    'title' => array('required' => true, 'sanitize_callback' => 'sanitize_text_field'),
                    'content' => array('required' => false, 'sanitize_callback' => 'wp_kses_post'),
                ),
            ),
        ));
    }

    public function list_records($request) {
        $records = get_posts(array('post_type' => 'ino_genealogy', 'post_status' => 'any', 'numberposts' => 20));
        return rest_ensure_response(array('module' => 'genealogy', 'items' => array_map(array($this, 'format_record'), $records)));
    }

    public function create_record($request) {
        $post_id = wp_insert_post(array(
            'post_type' => 'ino_genealogy',
            'post_status' => 'private',
            'post_title' => $request->get_param('title'),
            'post_content' => $request->get_param('content'),
        ), true);
        if (is_wp_error($post_id)) {
            return $post_id;
        }
        update_post_meta($post_id, '_ino_module', 'genealogy');
        update_post_meta($post_id, '_ino_security_state', 'restricted');
        return rest_ensure_response(array('id' => $post_id, 'module' => 'genealogy'));
    }

    public function format_record($post) {
        return array('id' => $post->ID, 'title' => get_the_title($post), 'status' => $post->post_status, 'module' => 'genealogy');
    }
}
