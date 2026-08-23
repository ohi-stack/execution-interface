<?php
if (!defined('ABSPATH')) {
    exit;
}

require_once ONEGODIAN_MEMBERS_DIR . 'includes/class-onegodian-members-services.php';
require_once ONEGODIAN_MEMBERS_DIR . 'includes/class-onegodian-members-admin.php';
require_once ONEGODIAN_MEMBERS_DIR . 'includes/class-onegodian-members-rest.php';
require_once ONEGODIAN_MEMBERS_DIR . 'includes/class-onegodian-members-community.php';
require_once ONEGODIAN_MEMBERS_DIR . 'includes/class-onegodian-members-shortcodes.php';
require_once ONEGODIAN_MEMBERS_DIR . 'includes/class-onegodian-members-protection.php';
require_once ONEGODIAN_MEMBERS_DIR . 'includes/class-onegodian-members-affiliates.php';

final class OneGodian_Members {
    private static $instance = null;
    private $services;
    private $affiliates;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public static function activate() {
        self::ensure_roles();
        self::ensure_pages();
        OneGodian_Members_Affiliates::activate();
        update_option('onegodian_members_version', ONEGODIAN_MEMBERS_VERSION, false);
        flush_rewrite_rules();
    }

    public static function deactivate() {
        flush_rewrite_rules();
    }

    private function __construct() {
        $this->services = new OneGodian_Members_Services();
        $this->affiliates = new OneGodian_Members_Affiliates();

        add_action('init', array($this, 'register_assets'));
        add_action('init', array($this, 'register_member_post_types'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_filter('plugin_action_links_' . plugin_basename(ONEGODIAN_MEMBERS_FILE), array($this, 'settings_link'));

        new OneGodian_Members_Admin($this->services);
        new OneGodian_Members_REST($this->services);
        new OneGodian_Members_Community($this->services);
        new OneGodian_Members_Shortcodes($this->services);
        new OneGodian_Members_Protection($this->services);
    }

    public function register_assets() {
        wp_register_style(
            'onegodian-members-admin',
            ONEGODIAN_MEMBERS_URL . 'assets/css/admin.css',
            array(),
            ONEGODIAN_MEMBERS_VERSION
        );
        wp_register_style(
            'onegodian-members-affiliate-ui',
            ONEGODIAN_MEMBERS_URL . 'assets/css/affiliate.css',
            array(),
            ONEGODIAN_MEMBERS_VERSION
        );
    }

    public function enqueue_frontend_assets() {
        wp_enqueue_style('onegodian-members-affiliate-ui');
    }

    public function register_member_post_types() {
        register_post_type('og_certificate', array(
            'labels' => array(
                'name' => __('Certificates', 'onegodian-members'),
                'singular_name' => __('Certificate', 'onegodian-members'),
            ),
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => 'onegodian-members',
            'supports' => array('title', 'author', 'custom-fields'),
            'capability_type' => 'post',
        ));

        register_post_type('og_digital_id', array(
            'labels' => array(
                'name' => __('Digital IDs', 'onegodian-members'),
                'singular_name' => __('Digital ID', 'onegodian-members'),
            ),
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => 'onegodian-members',
            'supports' => array('title', 'author', 'custom-fields'),
            'capability_type' => 'post',
        ));
    }

    public function settings_link($links) {
        $settings = sprintf(
            '<a href="%s">%s</a>',
            esc_url(admin_url('admin.php?page=onegodian-members')),
            esc_html__('Settings', 'onegodian-members')
        );
        array_unshift($links, $settings);

        return $links;
    }

    public static function ensure_roles() {
        add_role('onegodian_member', __('OneGodian Member', 'onegodian-members'), array('read' => true));
        add_role('onegodian_manager', __('OneGodian Manager', 'onegodian-members'), array(
            'read' => true,
            'manage_onegodian_members' => true,
        ));

        $administrator = get_role('administrator');
        if ($administrator) {
            $administrator->add_cap('manage_onegodian_members');
            $administrator->add_cap('read_onegodian_member_data');
        }
    }

    public static function ensure_pages() {
        $pages = array(
            'onegodian-dashboard' => array('OneGodian Dashboard', '[onegodian_member_dashboard]'),
            'onegodian-login' => array('OneGodian Login', '[onegodian_member_login]'),
            'onegodian-certificate' => array('OneGodian Certificate', '[onegodian_member_certificate]'),
            'onegodian-digital-id' => array('OneGodian Digital ID', '[onegodian_member_digital_id]'),
            'onegodian-community' => array('OneGodian Community', '[onegodian_member_community]'),
            'affiliate-dashboard' => array('Affiliate Dashboard', '[onegodian_affiliate_dashboard]'),
            'affiliate-links' => array('Affiliate Referral Link', '[onegodian_referral_link]'),
        );

        $created = get_option('onegodian_members_auto_pages', array());
        if (!is_array($created)) {
            $created = array();
        }

        foreach ($pages as $slug => $page) {
            $existing = get_page_by_path($slug);
            if (!$existing) {
                $page_id = wp_insert_post(array(
                    'post_title' => $page[0],
                    'post_name' => $slug,
                    'post_content' => $page[1],
                    'post_status' => 'publish',
                    'post_type' => 'page',
                ));
                if (!is_wp_error($page_id)) {
                    $created[$slug] = (int) $page_id;
                }
            } else {
                $created[$slug] = (int) $existing->ID;
            }
        }

        update_option('onegodian_members_auto_pages', $created, false);
    }
}
