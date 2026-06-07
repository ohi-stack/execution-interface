<?php
/**
 * Frontend membership shortcodes for Onegodian Members.
 *
 * @package Onegodian_Members
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Onegodian_Members_Shortcodes
{
    /** @var callable */
    private $settings_callback;

    /** @param callable $settings_callback Returns the plugin settings array. */
    public function __construct(callable $settings_callback)
    {
        $this->settings_callback = $settings_callback;
    }

    public function register(): void
    {
        add_shortcode('onegodian_membership_cta', array($this, 'render_membership_cta'));
        add_shortcode('onegodian_members_pricing', array($this, 'render_members_pricing'));
        add_shortcode('onegodian_membership_resources', array($this, 'render_membership_resources'));
        add_shortcode('onegodian_member_certificates', array($this, 'render_member_certificates'));
        add_shortcode('onegodian_member_dashboard', array($this, 'render_member_dashboard'));
        add_shortcode('onegodian_member_support', array($this, 'render_member_support'));
    }

    /** @param array<string, string>|string $atts */
    public function render_membership_cta($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Join the OneGodian Membership', 'onegodian-members'),
            'subtitle' => __('Access member guidance, resources, certificates, and support from the OneGodian membership hub.', 'onegodian-members'),
            'button_text' => __('Join membership', 'onegodian-members'),
            'secondary_text' => __('Member login', 'onegodian-members'),
            'join_url' => $this->default_join_url(),
            'login_url' => wp_login_url($this->current_url()),
        ), $atts, 'onegodian_membership_cta');

        return $this->section('ogm-membership-cta', sprintf(
            '<div class="ogm-shortcode__content"><p class="ogm-kicker">%s</p><h2>%s</h2><p>%s</p></div><div class="ogm-shortcode__actions"><a class="ogm-button ogm-button-primary" href="%s">%s</a><a class="ogm-button ogm-button-secondary" href="%s">%s</a></div>',
            esc_html__('Membership', 'onegodian-members'),
            esc_html($atts['title']),
            wp_kses_post($atts['subtitle']),
            esc_url($atts['join_url']),
            esc_html($atts['button_text']),
            esc_url($atts['login_url']),
            esc_html($atts['secondary_text'])
        ));
    }

    /** @param array<string, string>|string $atts */
    public function render_members_pricing($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Membership options', 'onegodian-members'),
            'description' => __('Choose the membership level that matches your current path. Pricing and checkout can be connected through existing WooCommerce membership products when configured.', 'onegodian-members'),
            'join_url' => $this->default_join_url(),
            'button_text' => __('Get started', 'onegodian-members'),
        ), $atts, 'onegodian_members_pricing');

        $cards = '';
        foreach ($this->membership_tiers() as $tier) {
            $cards .= sprintf(
                '<article class="ogm-pricing-card"><h3>%s</h3><p>%s</p><a class="ogm-button ogm-button-primary" href="%s">%s</a></article>',
                esc_html($tier),
                esc_html(sprintf(__('%s membership access with OneGodian member resources and support.', 'onegodian-members'), $tier)),
                esc_url($atts['join_url']),
                esc_html($atts['button_text'])
            );
        }

        return $this->section('ogm-members-pricing', sprintf(
            '<header class="ogm-shortcode__header"><h2>%s</h2><p>%s</p></header><div class="ogm-pricing-grid">%s</div>',
            esc_html($atts['title']),
            wp_kses_post($atts['description']),
            $cards
        ));
    }

    /** @param array<string, string>|string $atts */
    public function render_membership_resources($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Member resources', 'onegodian-members'),
            'description' => __('Use these membership resources to orient your OneGodian journey.', 'onegodian-members'),
            'dashboard_url' => $this->dashboard_url(),
            'support_url' => $this->support_url(),
        ), $atts, 'onegodian_membership_resources');

        $resources = array(
            array(__('Member dashboard', 'onegodian-members'), __('Open your membership overview, profile, and next steps.', 'onegodian-members'), $atts['dashboard_url']),
            array(__('Certificates', 'onegodian-members'), __('Review certificate status and member identification details.', 'onegodian-members'), $this->current_url()),
            array(__('Support', 'onegodian-members'), __('Request help with membership access, certificates, or resources.', 'onegodian-members'), $atts['support_url']),
        );

        $items = '';
        foreach ($resources as $resource) {
            $items .= sprintf(
                '<li class="ogm-resource-card"><h3>%s</h3><p>%s</p><a href="%s">%s</a></li>',
                esc_html($resource[0]),
                esc_html($resource[1]),
                esc_url($resource[2]),
                esc_html__('Open resource', 'onegodian-members')
            );
        }

        return $this->section('ogm-membership-resources', sprintf(
            '<header class="ogm-shortcode__header"><h2>%s</h2><p>%s</p></header><ul class="ogm-resource-list">%s</ul>',
            esc_html($atts['title']),
            wp_kses_post($atts['description']),
            $items
        ));
    }

    /** @param array<string, string>|string $atts */
    public function render_member_certificates($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Member certificates', 'onegodian-members'),
            'logged_out_message' => __('Sign in to view your member certificate details.', 'onegodian-members'),
            'login_url' => wp_login_url($this->current_url()),
        ), $atts, 'onegodian_member_certificates');

        if (!is_user_logged_in()) {
            return $this->logged_out_card($atts['title'], $atts['logged_out_message'], $atts['login_url']);
        }

        $user_id = get_current_user_id();
        $certificate_id = (string) get_user_meta($user_id, 'ogm_certificate_id', true);
        $certificate_status = $certificate_id ? __('Issued', 'onegodian-members') : __('Pending review', 'onegodian-members');
        $issued_at = (string) get_user_meta($user_id, 'ogm_certificate_issued_at', true);

        return $this->section('ogm-member-certificates', sprintf(
            '<h2>%s</h2><dl class="ogm-definition-list"><div><dt>%s</dt><dd>%s</dd></div><div><dt>%s</dt><dd>%s</dd></div><div><dt>%s</dt><dd>%s</dd></div></dl>',
            esc_html($atts['title']),
            esc_html__('Certificate ID', 'onegodian-members'),
            esc_html($certificate_id ?: __('Not issued yet', 'onegodian-members')),
            esc_html__('Status', 'onegodian-members'),
            esc_html($certificate_status),
            esc_html__('Issued', 'onegodian-members'),
            esc_html($issued_at ?: __('Not available', 'onegodian-members'))
        ));
    }

    /** @param array<string, string>|string $atts */
    public function render_member_dashboard($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Member dashboard', 'onegodian-members'),
            'logged_out_message' => __('Sign in or join the membership to access your OneGodian member dashboard.', 'onegodian-members'),
            'login_url' => wp_login_url($this->current_url()),
            'join_url' => $this->default_join_url(),
        ), $atts, 'onegodian_member_dashboard');

        if (!is_user_logged_in()) {
            return $this->section('ogm-member-dashboard ogm-member-dashboard--logged-out', sprintf(
                '<h2>%s</h2><p>%s</p><div class="ogm-shortcode__actions"><a class="ogm-button ogm-button-primary" href="%s">%s</a><a class="ogm-button ogm-button-secondary" href="%s">%s</a></div>',
                esc_html($atts['title']),
                wp_kses_post($atts['logged_out_message']),
                esc_url($atts['login_url']),
                esc_html__('Log in', 'onegodian-members'),
                esc_url($atts['join_url']),
                esc_html__('Join membership', 'onegodian-members')
            ));
        }

        $user = wp_get_current_user();
        $membership_tier = (string) get_user_meta($user->ID, 'ogm_membership_tier', true);
        $ohsid = (string) get_user_meta($user->ID, 'ogm_ohsid', true);

        return $this->section('ogm-member-dashboard', sprintf(
            '<h2>%s</h2><p>%s</p><dl class="ogm-definition-list"><div><dt>%s</dt><dd>%s</dd></div><div><dt>%s</dt><dd>%s</dd></div><div><dt>%s</dt><dd>%s</dd></div></dl><div class="ogm-shortcode__actions"><a class="ogm-button ogm-button-secondary" href="%s">%s</a></div>',
            esc_html($atts['title']),
            esc_html(sprintf(__('Welcome back, %s.', 'onegodian-members'), $user->display_name ?: $user->user_login)),
            esc_html__('Membership tier', 'onegodian-members'),
            esc_html($membership_tier ?: __('Member', 'onegodian-members')),
            esc_html__('OHSID', 'onegodian-members'),
            esc_html($ohsid ?: __('Not assigned', 'onegodian-members')),
            esc_html__('Email', 'onegodian-members'),
            esc_html($user->user_email),
            esc_url(get_edit_profile_url($user->ID)),
            esc_html__('Edit profile', 'onegodian-members')
        ));
    }

    /** @param array<string, string>|string $atts */
    public function render_member_support($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Member support', 'onegodian-members'),
            'description' => __('Need help with your membership, dashboard access, certificates, or resources? Contact support and include your account email when possible.', 'onegodian-members'),
            'support_url' => $this->support_url(),
            'button_text' => __('Contact member support', 'onegodian-members'),
        ), $atts, 'onegodian_member_support');

        return $this->section('ogm-member-support', sprintf(
            '<h2>%s</h2><p>%s</p><a class="ogm-button ogm-button-primary" href="%s">%s</a>',
            esc_html($atts['title']),
            wp_kses_post($atts['description']),
            esc_url($atts['support_url']),
            esc_html($atts['button_text'])
        ));
    }

    private function section(string $class_name, string $content): string
    {
        return '<section class="ogm-shortcode ' . esc_attr($class_name) . '">' . $content . '</section>';
    }

    private function logged_out_card(string $title, string $message, string $login_url): string
    {
        return $this->section('ogm-member-login-required', sprintf(
            '<h2>%s</h2><p>%s</p><a class="ogm-button ogm-button-primary" href="%s">%s</a>',
            esc_html($title),
            wp_kses_post($message),
            esc_url($login_url),
            esc_html__('Log in', 'onegodian-members')
        ));
    }

    /** @return array<string, string> */
    private function settings(): array
    {
        $settings = call_user_func($this->settings_callback);
        return is_array($settings) ? $settings : array();
    }

    /** @return array<int, string> */
    private function membership_tiers(): array
    {
        $settings = $this->settings();
        $tiers = isset($settings['membership_tiers']) ? explode(',', (string) $settings['membership_tiers']) : array();
        $tiers = array_values(array_filter(array_map('trim', $tiers)));
        return $tiers ?: array(__('Standard', 'onegodian-members'), __('Premium', 'onegodian-members'), __('Founding', 'onegodian-members'));
    }

    private function dashboard_url(): string
    {
        $settings = $this->settings();
        if (!empty($settings['app_dashboard_url'])) {
            return (string) $settings['app_dashboard_url'];
        }
        if (!empty($settings['app_url'])) {
            return trailingslashit((string) $settings['app_url']);
        }
        return home_url('/member-dashboard/');
    }

    private function default_join_url(): string
    {
        return home_url('/membership/');
    }

    private function support_url(): string
    {
        return home_url('/contact/');
    }

    private function current_url(): string
    {
        global $wp;

        if (isset($wp) && isset($wp->request)) {
            return home_url('/' . ltrim((string) $wp->request, '/'));
        }

        return home_url('/');
    }
}
