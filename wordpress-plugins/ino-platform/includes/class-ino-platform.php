<?php
if (!defined('ABSPATH')) {
    exit;
}

require_once INO_PLATFORM_DIR . 'includes/class-ino-platform-module.php';
require_once INO_PLATFORM_DIR . 'includes/class-ino-platform-security.php';
require_once INO_PLATFORM_DIR . 'includes/class-ino-platform-membership.php';
require_once INO_PLATFORM_DIR . 'includes/class-ino-platform-identity.php';
require_once INO_PLATFORM_DIR . 'includes/class-ino-platform-genealogy.php';
require_once INO_PLATFORM_DIR . 'includes/class-ino-platform-community.php';
require_once INO_PLATFORM_DIR . 'includes/class-ino-platform-treasury.php';
require_once INO_PLATFORM_DIR . 'includes/class-ino-platform-housing.php';
require_once INO_PLATFORM_DIR . 'includes/class-ino-platform-governance.php';
require_once INO_PLATFORM_DIR . 'includes/class-ino-platform-certificates.php';
require_once INO_PLATFORM_DIR . 'includes/class-ino-platform-volunteers.php';
require_once INO_PLATFORM_DIR . 'includes/class-ino-platform-forms.php';
require_once INO_PLATFORM_DIR . 'includes/class-ino-platform-rest.php';
require_once INO_PLATFORM_DIR . 'includes/class-ino-platform-admin.php';

final class INO_Platform {
    private static $instance = null;
    private $modules = array();

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->modules = array(
            'membership' => new INO_Platform_Membership($this),
            'identity' => new INO_Platform_Identity($this),
            'genealogy' => new INO_Platform_Genealogy($this),
            'community' => new INO_Platform_Community($this),
            'treasury' => new INO_Platform_Treasury($this),
            'housing' => new INO_Platform_Housing($this),
            'governance' => new INO_Platform_Governance($this),
            'certificates' => new INO_Platform_Certificates($this),
            'volunteers' => new INO_Platform_Volunteers($this),
            'forms' => new INO_Platform_Forms($this),
        );
        add_action('init', array($this, 'register_post_types'));
        add_action('init', array($this, 'register_shortcodes'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('rest_api_init', array(new INO_Platform_REST($this), 'register_routes'));
        add_action('admin_menu', array(new INO_Platform_Admin($this), 'register_menu'));
        foreach ($this->modules as $module) {
            $module->register_hooks();
        }
    }

    public static function activate() {
        self::add_roles();
        self::create_pages();
        self::instance()->register_post_types();
        foreach (self::instance()->modules() as $module) {
            $module->activation();
        }
        flush_rewrite_rules();
    }

    public static function deactivate() { flush_rewrite_rules(); }

    public static function add_roles() {
        add_role('ino_member', __('INO Member', 'ino-platform'), array('read' => true, 'ino_read_member_area' => true));
        add_role('ino_steward', __('INO Steward', 'ino-platform'), array('read' => true, 'ino_read_member_area' => true, 'ino_manage_records' => true));
        add_role('ino_treasurer', __('INO Treasurer', 'ino-platform'), array('read' => true, 'ino_read_member_area' => true, 'ino_manage_treasury' => true));
        $admin = get_role('administrator');
        if ($admin) {
            foreach (array('ino_read_member_area', 'ino_manage_records', 'ino_manage_treasury', 'ino_manage_governance') as $cap) {
                $admin->add_cap($cap);
            }
        }
    }

    public static function create_pages() {
        $pages = array('ino-dashboard' => 'INO Dashboard', 'ino-member-intake' => 'INO Member Intake', 'ino-governance' => 'INO Governance');
        foreach ($pages as $slug => $title) {
            if (!get_page_by_path($slug)) {
                wp_insert_post(array('post_title' => $title, 'post_name' => $slug, 'post_status' => 'publish', 'post_type' => 'page', 'post_content' => '[ino_platform module="' . esc_attr(str_replace('ino-', '', $slug)) . '"]'));
            }
        }
    }

    public function modules() { return $this->modules; }
    public function module($slug) { return isset($this->modules[$slug]) ? $this->modules[$slug] : null; }

    public function register_post_types() {
        $types = array(
            'ino_record' => array('Records', 'Record'), 'ino_genealogy' => array('Genealogy', 'Lineage Record'),
            'ino_grant' => array('Grants', 'Grant'), 'ino_housing' => array('Housing', 'Housing Case'),
            'ino_motion' => array('Governance', 'Motion'), 'ino_certificate' => array('Certificates', 'Certificate'),
            'ino_volunteer' => array('Volunteers', 'Volunteer Shift'), 'ino_form' => array('Forms', 'Form Submission'),
        );
        foreach ($types as $type => $labels) {
            register_post_type($type, array(
                'labels' => array('name' => __($labels[0], 'ino-platform'), 'singular_name' => __($labels[1], 'ino-platform')),
                'public' => false, 'show_ui' => true, 'show_in_rest' => true, 'supports' => array('title', 'editor', 'author', 'custom-fields'),
                'capability_type' => 'post', 'menu_icon' => 'dashicons-shield-alt',
            ));
        }
    }

    public function register_shortcodes() {
        add_shortcode('ino_platform', array($this, 'render_shortcode'));
    }

    public function render_shortcode($atts) {
        $atts = shortcode_atts(array('module' => 'dashboard'), $atts, 'ino_platform');
        return '<div class="ino-platform-card"><h2>' . esc_html__('INO Platform', 'ino-platform') . '</h2><p>' . esc_html(sprintf(__('Module: %s', 'ino-platform'), sanitize_key($atts['module']))) . '</p></div>';
    }

    public function enqueue_assets() {
        wp_enqueue_style('ino-platform', INO_PLATFORM_URL . 'assets/css/ino-platform.css', array(), INO_PLATFORM_VERSION);
        wp_enqueue_script('ino-platform', INO_PLATFORM_URL . 'assets/js/ino-platform.js', array(), INO_PLATFORM_VERSION, true);
    }
}
