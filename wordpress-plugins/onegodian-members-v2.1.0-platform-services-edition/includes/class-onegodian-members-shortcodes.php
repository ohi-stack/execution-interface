<?php
if (!defined('ABSPATH')) {
    exit;
}

class OneGodian_Members_Shortcodes {
    private $services;

    public function __construct(OneGodian_Members_Services $services) {
        $this->services = $services;
        add_shortcode('onegodian_member_dashboard', array($this, 'dashboard'));
        add_shortcode('onegodian_member_login', array($this, 'login'));
        add_shortcode('onegodian_member_certificate', array($this, 'certificate'));
        add_shortcode('onegodian_member_digital_id', array($this, 'digital_id'));
        add_shortcode('onegodian_member_community', array($this, 'community'));
    }

    public function dashboard() {
        $payload = $this->services->dashboard_payload();
        $html = '<div class="onegodian-member-dashboard"><h2>OneGodian Member Dashboard</h2><ul>';
        foreach ($payload['cards'] as $card) {
            $html .= '<li><strong>' . esc_html($card['label']) . '</strong>: ' . esc_html($card['state']) . '</li>';
        }
        $html .= '</ul></div>';

        return $html;
    }

    public function login() {
        if (is_user_logged_in()) {
            return '<p>You are signed in.</p>';
        }

        return wp_login_form(array('echo' => false));
    }

    public function certificate() {
        $payload = $this->services->certificate_payload();
        return '<div class="onegodian-certificate"><h2>Certificate</h2><p>Certificate ID: <code>' . esc_html($payload['certificate_id']) . '</code></p><p>PDF available: yes</p></div>';
    }

    public function digital_id() {
        $payload = $this->services->certificate_payload();
        return '<div class="onegodian-digital-id"><h2>Digital ID</h2><p>Verification: <a href="' . esc_url($payload['verification_url']) . '">' . esc_html($payload['certificate_id']) . '</a></p></div>';
    }

    public function community() {
        if ($this->services->is_buddypress_active()) {
            return '<div class="onegodian-community"><h2>Community</h2><p>BuddyPress community integration is active.</p></div>';
        }

        return '<div class="onegodian-community"><h2>Community</h2><p>Community integration is ready and will activate when BuddyPress is available.</p></div>';
    }
}
