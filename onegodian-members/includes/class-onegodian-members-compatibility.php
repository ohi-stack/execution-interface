<?php
/**
 * Compatibility aliases and login guards for historical OneGodian Members shortcodes.
 *
 * @package OneGodian_Members
 */

if (!defined('ABSPATH')) {
    exit;
}

class OneGodian_Members_Compatibility {
    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('init', array($this, 'register_aliases'), 40);
        add_action('admin_menu', array($this, 'brand_admin_menu'), 99);
    }

    public function register_aliases() {
        $production = OneGodian_Members_Production_Experience::instance();

        // Make the historical dashboard shortcode use the production dashboard and login guard.
        add_shortcode('onegodian_member_dashboard', array($production, 'dashboard_shortcode'));

        // Member certificates are account records and should never render as a signed-out member surface.
        add_shortcode('onegodian_member_certificates', array($this, 'certificates_shortcode'));
    }

    public function brand_admin_menu() {
        global $menu, $submenu;

        if (is_array($menu)) {
            foreach ($menu as &$item) {
                if (isset($item[2]) && 'ogm-members' === $item[2]) {
                    $item[0] = __('OneGodian Members', 'onegodian-members');
                    break;
                }
            }
            unset($item);
        }

        if (isset($submenu['ogm-members']) && is_array($submenu['ogm-members'])) {
            foreach ($submenu['ogm-members'] as &$item) {
                if (isset($item[2]) && 'ogm-members' === $item[2]) {
                    $item[0] = __('Overview & Settings', 'onegodian-members');
                }
            }
            unset($item);
        }
    }

    public function certificates_shortcode() {
        if (!is_user_logged_in()) {
            return do_shortcode('[onegodian_login]');
        }

        $legacy = OneGodian_Members_Contributors_Affiliates::instance();
        if (is_callable(array($legacy, 'member_certificates_shortcode'))) {
            return $legacy->member_certificates_shortcode();
        }

        return '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">Certificates</span><h2>Member Certificates</h2><p>Your certificate module is connected to the member account, but no certificate renderer is currently available.</p></div></section>';
    }
}
