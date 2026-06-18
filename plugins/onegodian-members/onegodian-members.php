<?php
/**
 * Plugin Name: OneGodian Members
 * Description: Membership, contributor, creator, and affiliate checkout shortcodes for OneGodian using WooCommerce checkout links.
 * Version: 1.7.1
 * Author: OneGodian
 * Text Domain: onegodian-members
 */

if (!defined('ABSPATH')) {
    exit;
}

final class OneGodian_Members {
    const VERSION = '1.7.1';
    const OPTION = 'onegodian_members_settings';
    const NOT_CONFIGURED = 'WooCommerce product is not configured.';

    private static $products = array(
        'woo_basic_member_product_id' => array('label' => 'Basic Member', 'description' => 'OneGodian member access and resources.', 'button' => 'Join as Basic Member'),
        'woo_premium_member_product_id' => array('label' => 'Premium Member', 'description' => 'Premium member access, resources, and enhanced support.', 'button' => 'Join as Premium Member'),
        'woo_contributor_product_id' => array('label' => 'Contributor', 'description' => 'Voluntary support for OneGodian public-facing infrastructure.', 'button' => 'Become a Contributor'),
        'woo_creator_application_product_id' => array('label' => 'Creator Application', 'description' => 'Apply for the OneGodian Creator Network.', 'button' => 'Apply to Creator Network'),
        'woo_affiliate_application_product_id' => array('label' => 'Affiliate Application', 'description' => 'Apply for the OneGodian Affiliate Program.', 'button' => 'Apply as Affiliate'),
    );

    public static function init() {
        add_action('admin_menu', array(__CLASS__, 'admin_menu'));
        add_action('admin_init', array(__CLASS__, 'register_settings'));
        add_action('admin_notices', array(__CLASS__, 'admin_notice'));
        add_shortcode('onegodian_membership_cta', array(__CLASS__, 'membership_cta'));
        add_shortcode('onegodian_members_pricing', array(__CLASS__, 'members_pricing'));
        add_shortcode('onegodian_membership_resources', array(__CLASS__, 'membership_resources'));
        add_shortcode('onegodian_member_certificates', array(__CLASS__, 'member_certificates'));
        add_shortcode('onegodian_member_dashboard', array(__CLASS__, 'member_dashboard'));
        add_shortcode('onegodian_member_support', array(__CLASS__, 'member_support'));
        add_shortcode('onegodian_contributors_page', array(__CLASS__, 'contributors_page'));
        add_shortcode('onegodian_contributor_tiers', array(__CLASS__, 'contributor_tiers'));
        add_shortcode('onegodian_creator_network', array(__CLASS__, 'creator_network'));
        add_shortcode('onegodian_affiliate_dashboard', array(__CLASS__, 'affiliate_dashboard'));
        add_shortcode('onegodian_referral_link', array(__CLASS__, 'referral_link'));
        add_shortcode('onegodian_contributor_wall', array(__CLASS__, 'contributor_wall'));
        add_shortcode('onegodian_contributor_disclaimer', array(__CLASS__, 'contributor_disclaimer'));
    }

    public static function admin_menu() {
        add_options_page('OneGodian Members', 'OneGodian Members', 'manage_options', 'onegodian-members', array(__CLASS__, 'settings_page'));
    }

    public static function register_settings() {
        register_setting('onegodian_members', self::OPTION, array(__CLASS__, 'sanitize_settings'));
        add_settings_section('onegodian_members_woocommerce', 'WooCommerce checkout products', function () {
            echo '<p>' . esc_html__('Payments are handled through WooCommerce checkout. Configure product IDs in plugin settings.', 'onegodian-members') . '</p>';
        }, 'onegodian-members');

        foreach (self::$products as $key => $product) {
            add_settings_field($key, esc_html($product['label'] . ' product ID'), function () use ($key) {
                $settings = self::settings();
                printf('<input type="number" min="1" name="%1$s[%2$s]" value="%3$s" class="regular-text" />', esc_attr(self::OPTION), esc_attr($key), esc_attr($settings[$key] ?? ''));
            }, 'onegodian-members', 'onegodian_members_woocommerce');
        }
    }

    public static function sanitize_settings($input) {
        $output = array();
        foreach (array_keys(self::$products) as $key) {
            $output[$key] = isset($input[$key]) ? absint($input[$key]) : 0;
        }
        return $output;
    }

    public static function admin_notice() {
        if (!current_user_can('manage_options')) {
            return;
        }
        echo '<div class="notice notice-info"><p>' . esc_html__('Payments are handled through WooCommerce checkout. Configure product IDs in plugin settings.', 'onegodian-members') . '</p></div>';
    }

    public static function settings_page() {
        echo '<div class="wrap"><h1>' . esc_html__('OneGodian Members', 'onegodian-members') . '</h1><form method="post" action="options.php">';
        settings_fields('onegodian_members');
        do_settings_sections('onegodian-members');
        submit_button();
        echo '</form></div>';
    }

    private static function settings() {
        $defaults = array_fill_keys(array_keys(self::$products), 0);
        return wp_parse_args((array) get_option(self::OPTION, array()), $defaults);
    }

    private static function cart_url($key) {
        $settings = self::settings();
        $product_id = absint($settings[$key] ?? 0);
        if (!$product_id) {
            return '';
        }
        return home_url('/cart/?add-to-cart=' . $product_id);
    }

    private static function checkout_button($key, $fallback_label = '') {
        $product = self::$products[$key];
        $label = $fallback_label ? $fallback_label : $product['button'];
        $url = self::cart_url($key);
        if (!$url) {
            return '<p class="onegodian-members-not-configured">' . esc_html__(self::NOT_CONFIGURED, 'onegodian-members') . '</p>';
        }
        return '<a class="onegodian-members-button" href="' . esc_url($url) . '">' . esc_html($label) . '</a>';
    }

    private static function card($key) {
        $product = self::$products[$key];
        return '<article class="onegodian-members-card"><h3>' . esc_html($product['label']) . '</h3><p>' . esc_html($product['description']) . '</p>' . self::checkout_button($key) . '</article>';
    }

    public static function membership_cta() {
        return '<div class="onegodian-members-cta"><h2>' . esc_html__('Become a OneGodian Member', 'onegodian-members') . '</h2>' . self::checkout_button('woo_basic_member_product_id') . self::checkout_button('woo_premium_member_product_id') . '</div>';
    }

    public static function members_pricing() {
        return '<div class="onegodian-members-pricing">' . self::card('woo_basic_member_product_id') . self::card('woo_premium_member_product_id') . self::card('woo_contributor_product_id') . '</div>';
    }

    public static function contributors_page() {
        return '<div class="onegodian-contributors"><h2>' . esc_html__('Contributors', 'onegodian-members') . '</h2><p>' . esc_html__('Support OneGodian products, education, media, technology, membership, and community infrastructure.', 'onegodian-members') . '</p>' . self::checkout_button('woo_contributor_product_id') . '</div>';
    }

    public static function contributor_tiers() {
        return '<div class="onegodian-contributor-tiers">' . self::card('woo_contributor_product_id') . '</div>';
    }

    public static function creator_network() {
        return '<div class="onegodian-creator-network"><h2>' . esc_html__('Creator Network', 'onegodian-members') . '</h2>' . self::checkout_button('woo_creator_application_product_id') . '</div>';
    }

    public static function affiliate_dashboard() {
        return '<div class="onegodian-affiliate-dashboard"><h2>' . esc_html__('Affiliate Dashboard', 'onegodian-members') . '</h2>' . self::checkout_button('woo_affiliate_application_product_id') . self::checkout_button('woo_creator_application_product_id') . '</div>';
    }

    public static function membership_resources() { return '<div class="onegodian-membership-resources">' . esc_html__('Member resources are available to active members.', 'onegodian-members') . '</div>'; }
    public static function member_certificates() { return '<div class="onegodian-member-certificates">' . esc_html__('Member certificate access is available to active members.', 'onegodian-members') . '</div>'; }
    public static function member_dashboard() { return '<div class="onegodian-member-dashboard">' . esc_html__('Member dashboard access is available to active members.', 'onegodian-members') . '</div>'; }
    public static function member_support() { return '<div class="onegodian-member-support">' . esc_html__('Member support is available to active members.', 'onegodian-members') . '</div>'; }
    public static function referral_link() { return '<div class="onegodian-referral-link">' . esc_html__('Referral links are available from the affiliate dashboard when enabled.', 'onegodian-members') . '</div>'; }
    public static function contributor_wall() { return '<div class="onegodian-contributor-wall">' . esc_html__('Contributor recognition will appear here when published.', 'onegodian-members') . '</div>'; }
    public static function contributor_disclaimer() { return '<p class="onegodian-contributor-disclaimer">' . esc_html__('Contributions are voluntary support payments. They are not equity, securities, loans, bonds, investment contracts, or promises of financial return.', 'onegodian-members') . '</p>'; }
}

OneGodian_Members::init();
