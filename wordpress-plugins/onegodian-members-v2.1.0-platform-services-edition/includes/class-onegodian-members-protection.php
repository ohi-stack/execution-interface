<?php
if (!defined('ABSPATH')) {
    exit;
}

class OneGodian_Members_Protection {
    private $services;

    public function __construct(OneGodian_Members_Services $services) {
        $this->services = $services;
        add_shortcode('onegodian_protected', array($this, 'protected_content'));
        add_filter('the_content', array($this, 'content_boundary_marker'), 8);
    }

    public function protected_content($atts, $content = '') {
        $atts = shortcode_atts(array('capability' => 'read'), $atts, 'onegodian_protected');
        $capability = sanitize_key($atts['capability']);

        if (is_user_logged_in() && current_user_can($capability)) {
            return do_shortcode($content);
        }

        return '<div class="onegodian-protected-content"><p>This content is available to OneGodian members.</p></div>';
    }

    public function content_boundary_marker($content) {
        if (is_admin() || !is_singular()) {
            return $content;
        }

        return $content;
    }
}
