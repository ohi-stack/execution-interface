<?php
/** Trusted Property Contact module bootstrap. */
if (!defined('ABSPATH')) { exit; }

final class ALGQ_Trusted_Property_Contact_Module {
    const VERSION = '1.0.0';
    private static $instance;

    public static function instance() {
        if (!self::$instance) { self::$instance = new self(); }
        return self::$instance;
    }

    private function __construct() {
        foreach (array('database', 'client-service', 'property-service', 'authorization-service', 'visit-service', 'maintenance-service', 'incident-service', 'notification-service', 'report-service', 'rest-controller', 'admin', 'shortcodes') as $file) {
            require_once __DIR__ . '/class-' . $file . '.php';
        }
        add_action('init', array($this, 'boot'));
        add_action('wp_enqueue_scripts', array($this, 'assets'));
        add_action('algq_stewardship_daily', array('ALGQ_TPC_Notification_Service', 'run_scheduled_rules'));
    }

    public function boot() {
        ALGQ_TPC_Shortcodes::register();
        ALGQ_TPC_Admin::register();
        ALGQ_TPC_REST_Controller::register();
    }

    public function assets() {
        wp_register_style('algq-stewardship', ALGQ_PLATFORM_URL . 'assets/css/stewardship.css', array(), self::VERSION);
        wp_register_script('algq-stewardship', ALGQ_PLATFORM_URL . 'assets/js/stewardship.js', array(), self::VERSION, true);
        wp_localize_script('algq-stewardship', 'algqStewardship', array('restUrl' => esc_url_raw(rest_url('algq/v1/stewardship')), 'nonce' => wp_create_nonce('wp_rest')));
    }

    public static function activate() {
        require_once __DIR__ . '/class-database.php';
        ALGQ_TPC_Database::install();
        self::add_roles();
        self::create_pages();
        if (!wp_next_scheduled('algq_stewardship_daily')) { wp_schedule_event(time(), 'daily', 'algq_stewardship_daily'); }
        flush_rewrite_rules();
    }

    public static function deactivate() {
        wp_clear_scheduled_hook('algq_stewardship_daily');
        flush_rewrite_rules();
    }

    private static function add_roles() {
        $caps = array('algq_view_stewardship_clients', 'algq_manage_stewardship_clients', 'algq_assign_property_contacts', 'algq_manage_property_visits', 'algq_upload_visit_photos', 'algq_manage_service_requests', 'algq_manage_vendors', 'algq_record_expenses', 'algq_manage_incidents', 'algq_view_sensitive_property_data', 'algq_generate_stewardship_reports', 'algq_manage_authorizations');
        $sets = array(
            'algq_stewardship_manager' => $caps,
            'algq_property_coordinator' => array_slice($caps, 0, 9),
            'algq_field_inspector' => array('algq_manage_property_visits', 'algq_upload_visit_photos'),
            'algq_authorized_vendor' => array('algq_manage_service_requests'),
            'algq_stewardship_client' => array('read'),
        );
        foreach ($sets as $slug => $grants) {
            $role_caps = array('read' => true);
            foreach ($grants as $cap) { $role_caps[$cap] = true; }
            add_role($slug, ucwords(str_replace('_', ' ', $slug)), $role_caps);
        }
        $admin = get_role('administrator');
        if ($admin) { foreach ($caps as $cap) { $admin->add_cap($cap); } }
    }

    private static function create_pages() {
        $pages = array(
            'trusted-property-contact' => array('Trusted Property Contact', '[algq_trusted_property_contact]'),
            'trusted-property-contact/enroll' => array('Stewardship Enrollment', '[algq_stewardship_enrollment]'),
            'property-stewardship' => array('Property Stewardship', '[algq_trusted_property_contact]'),
            'property-stewardship/portal' => array('Client Portal', '[algq_stewardship_client_portal]'),
            'property-stewardship/request-service' => array('Request Service', '[algq_stewardship_service_request]'),
            'property-stewardship/documents' => array('Stewardship Documents', '[algq_stewardship_report]'),
            'property-stewardship/contact' => array('Contact Your Coordinator', '[algq_stewardship_client_portal view="messages"]'),
            'admin/property-stewardship' => array('Property Stewardship Dashboard', '[algq_stewardship_dashboard]'),
        );
        foreach ($pages as $path => $definition) {
            if (get_page_by_path($path)) { continue; }
            $parent = 0;
            if (false !== strpos($path, '/')) {
                $parent_path = dirname($path);
                $parent_page = get_page_by_path($parent_path);
                if ($parent_page) { $parent = (int) $parent_page->ID; }
            }
            wp_insert_post(array('post_title' => $definition[0], 'post_name' => basename($path), 'post_parent' => $parent, 'post_content' => $definition[1], 'post_status' => 'publish', 'post_type' => 'page'));
        }
    }
}
