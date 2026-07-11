<?php
if (!defined('ABSPATH')) {
    exit;
}

class OneGodian_Members_Community {
    private $services;

    public function __construct(OneGodian_Members_Services $services) {
        $this->services = $services;
        add_action('bp_setup_nav', array($this, 'register_buddypress_nav'));
        add_action('bp_activity_posted_update', array($this, 'activity_bridge_notice'), 10, 3);
    }

    public function register_buddypress_nav() {
        if (!$this->services->is_buddypress_active() || !function_exists('bp_core_new_nav_item')) {
            return;
        }

        bp_core_new_nav_item(array(
            'name' => __('OneGodian', 'onegodian-members'),
            'slug' => 'onegodian',
            'screen_function' => array($this, 'render_buddypress_screen'),
            'position' => 75,
            'default_subnav_slug' => 'dashboard',
        ));
    }

    public function render_buddypress_screen() {
        add_action('bp_template_content', array($this, 'render_buddypress_content'));
        bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
    }

    public function render_buddypress_content() {
        echo do_shortcode('[onegodian_member_dashboard]');
    }

    public function activity_bridge_notice($content, $user_id, $activity_id) {
        do_action('onegodian_members_buddypress_activity_recorded', $activity_id, $user_id, $content);
    }
}
