<?php
if (!defined('ABSPATH')) {
    exit;
}

require_once INO_PSRP_PATH . 'includes/class-ino-psrp-data.php';
require_once INO_PSRP_PATH . 'includes/class-ino-psrp-admin.php';
require_once INO_PSRP_PATH . 'includes/class-ino-psrp-rest.php';
require_once INO_PSRP_PATH . 'includes/class-ino-psrp-shortcodes.php';

final class INO_PSRP {
    private static $instance = null;
    public $data;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function init() {
        $this->data = new INO_PSRP_Data();
        (new INO_PSRP_Admin($this->data))->init();
        (new INO_PSRP_REST($this->data))->init();
        (new INO_PSRP_Shortcodes($this->data))->init();
        add_action('init', array($this, 'register_records'));
        add_action('wp_enqueue_scripts', array($this, 'assets'));
    }

    public function assets() {
        wp_register_style('ino-psrp', INO_PSRP_URL . 'assets/css/ino-psrp.css', array(), INO_PSRP_VERSION);
    }

    public function register_records() {
        $types = array(
            'ino_parcel' => 'Parcels',
            'ino_survey' => 'Surveys',
            'ino_doc' => 'Documents',
            'ino_timeline' => 'Timeline Records',
            'ino_notice' => 'Legal Notices',
        );
        foreach ($types as $type => $label) {
            register_post_type($type, array(
                'labels' => array('name' => $label, 'singular_name' => rtrim($label, 's')),
                'public' => false,
                'show_ui' => true,
                'show_in_rest' => true,
                'capability_type' => 'ino_project_record',
                'map_meta_cap' => true,
                'supports' => array('title', 'editor', 'author', 'revisions', 'custom-fields'),
            ));
        }
    }

    public static function activate() {
        $caps = array('read_ino_project_record', 'read_private_ino_project_records', 'edit_ino_project_record', 'edit_ino_project_records', 'edit_others_ino_project_records', 'publish_ino_project_records', 'delete_ino_project_record', 'delete_ino_project_records');
        foreach (array('administrator', 'editor') as $role_name) {
            $role = get_role($role_name);
            if ($role) {
                foreach ($caps as $cap) {
                    $role->add_cap($cap);
                }
            }
        }
        add_role('ino_housing_reviewer', 'INO Housing Reviewer', array('read' => true, 'read_ino_project_record' => true, 'read_private_ino_project_records' => true));
        flush_rewrite_rules();
    }

    public static function deactivate() {
        flush_rewrite_rules();
    }
}
