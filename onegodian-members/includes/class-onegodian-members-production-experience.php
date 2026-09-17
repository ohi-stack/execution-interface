<?php
/**
 * Production membership experience for OneGodian Members.
 *
 * @package OneGodian_Members
 */

if (!defined('ABSPATH')) {
    exit;
}

class OneGodian_Members_Production_Experience {
    const SETTINGS_KEY = 'ogm_production_settings';
    const PAGE_IDS_KEY = 'ogm_managed_page_ids';
    const PAGE_STATUS_KEY = 'ogm_managed_page_status';
    const INSTALLED_VERSION_KEY = 'ogm_production_installed_version';
    const MANAGED_MARKER = '<!-- onegodian-members:managed -->';

    private static $instance = null;

    private $shortcodes = array(
        'onegodian_membership_hub',
        'onegodian_login',
        'onegodian_my_account',
        'onegodian_member_dashboard_shell',
        'onegodian_member_navigation',
        'onegodian_member_profile',
        'onegodian_profile_completion',
        'onegodian_community_hub',
        'onegodian_members_directory',
        'onegodian_groups',
        'onegodian_activity',
        'onegodian_messages',
        'onegodian_notifications',
        'onegodian_members_status',
    );

    private $page_map = array(
        'membership' => array('title' => 'OneGodian Membership', 'slug' => 'membership', 'shortcode' => '[onegodian_membership_hub]'),
        'member_dashboard' => array('title' => 'Member Dashboard', 'slug' => 'member-dashboard', 'shortcode' => '[onegodian_member_dashboard_shell]'),
        'member_account' => array('title' => 'Member Account', 'slug' => 'member-account', 'shortcode' => '[onegodian_my_account]'),
        'member_profile' => array('title' => 'Member Profile', 'slug' => 'member-profile', 'shortcode' => '[onegodian_member_profile]'),
        'community' => array('title' => 'OneGodian Community', 'slug' => 'community', 'shortcode' => '[onegodian_community_hub]'),
        'members' => array('title' => 'Members Directory', 'slug' => 'members', 'shortcode' => '[onegodian_members_directory]'),
        'groups' => array('title' => 'Community Groups', 'slug' => 'member-groups', 'shortcode' => '[onegodian_groups]'),
        'activity' => array('title' => 'Community Activity', 'slug' => 'member-activity', 'shortcode' => '[onegodian_activity]'),
        'messages' => array('title' => 'Member Messages', 'slug' => 'member-messages', 'shortcode' => '[onegodian_messages]'),
        'notifications' => array('title' => 'Member Notifications', 'slug' => 'member-notifications', 'shortcode' => '[onegodian_notifications]'),
        'resources' => array('title' => 'Membership Resources', 'slug' => 'membership-resources', 'shortcode' => '[onegodian_membership_resources]'),
        'certificates' => array('title' => 'Member Certificates', 'slug' => 'member-certificates', 'shortcode' => '[onegodian_member_certificates]'),
        'join' => array('title' => 'Join OneGodian', 'slug' => 'join', 'shortcode' => '[onegodian_members_pricing]'),
        'login' => array('title' => 'Member Login', 'slug' => 'login', 'shortcode' => '[onegodian_login]'),
    );

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function activate() {
        $instance = self::instance();
        $instance->ensure_settings();
        $instance->ensure_pages(true);
        flush_rewrite_rules(false);
    }

    private function __construct() {
        add_action('init', array($this, 'register_shortcodes'), 30);
        add_action('init', array($this, 'register_woocommerce_endpoint'), 20);
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_action('widgets_init', array($this, 'register_widgets'));
        add_action('admin_menu', array($this, 'register_admin_page'), 30);
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_init', array($this, 'maybe_upgrade_pages'), 40);
        add_action('admin_post_ogm_rotate_bridge_key', array($this, 'rotate_bridge_key'));
        add_action('admin_post_ogm_sync_pages', array($this, 'manual_sync_pages'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'), 30);
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'), 30);
        add_action('bp_setup_nav', array($this, 'register_buddypress_nav'), 50);
        add_filter('woocommerce_account_menu_items', array($this, 'woocommerce_account_menu_items'), 30);
        add_action('woocommerce_account_onegodian-dashboard_endpoint', array($this, 'woocommerce_dashboard_endpoint'));
    }

    public function defaults() {
        return array(
            'app_url' => 'https://app.onegodian.com/members',
            'support_url' => home_url('/contact/'),
            'auto_sync_pages' => 'yes',
            'app_bridge_key' => '',
            'brand_label' => 'OneGodian Members',
        );
    }

    public function ensure_settings() {
        $settings = wp_parse_args((array) get_option(self::SETTINGS_KEY, array()), $this->defaults());
        if (empty($settings['app_bridge_key'])) {
            $settings['app_bridge_key'] = wp_generate_password(48, false, false);
        }
        update_option(self::SETTINGS_KEY, $settings, false);
        return $settings;
    }

    public function get_settings() {
        return wp_parse_args((array) get_option(self::SETTINGS_KEY, array()), $this->defaults());
    }

    public function register_settings() {
        register_setting('ogm_production', self::SETTINGS_KEY, array($this, 'sanitize_settings'));
    }

    public function sanitize_settings($input) {
        $input = (array) $input;
        $current = $this->ensure_settings();
        return array(
            'app_url' => isset($input['app_url']) ? esc_url_raw($input['app_url']) : $current['app_url'],
            'support_url' => isset($input['support_url']) ? esc_url_raw($input['support_url']) : $current['support_url'],
            'auto_sync_pages' => !empty($input['auto_sync_pages']) ? 'yes' : 'no',
            'app_bridge_key' => $current['app_bridge_key'],
            'brand_label' => isset($input['brand_label']) ? sanitize_text_field($input['brand_label']) : $current['brand_label'],
        );
    }

    public function register_shortcodes() {
        add_shortcode('onegodian_membership_hub', array($this, 'membership_hub_shortcode'));
        add_shortcode('onegodian_login', array($this, 'login_shortcode'));
        add_shortcode('onegodian_my_account', array($this, 'my_account_shortcode'));
        add_shortcode('onegodian_member_dashboard_shell', array($this, 'dashboard_shortcode'));
        add_shortcode('onegodian_member_navigation', array($this, 'navigation_shortcode'));
        add_shortcode('onegodian_member_profile', array($this, 'profile_shortcode'));
        add_shortcode('onegodian_profile_completion', array($this, 'profile_completion_shortcode'));
        add_shortcode('onegodian_community_hub', array($this, 'community_shortcode'));
        add_shortcode('onegodian_members_directory', array($this, 'members_directory_shortcode'));
        add_shortcode('onegodian_groups', array($this, 'groups_shortcode'));
        add_shortcode('onegodian_activity', array($this, 'activity_shortcode'));
        add_shortcode('onegodian_messages', array($this, 'messages_shortcode'));
        add_shortcode('onegodian_notifications', array($this, 'notifications_shortcode'));
        add_shortcode('onegodian_members_status', array($this, 'status_shortcode'));

        if (!shortcode_exists('my-account')) {
            add_shortcode('my-account', array($this, 'my_account_shortcode'));
        }
    }

    public function enqueue_assets() {
        wp_enqueue_style('onegodian-members-production', OGM_PLUGIN_URL . 'assets/css/onegodian-members-production.css', array(), OGM_VERSION);
    }

    public function enqueue_admin_assets($hook) {
        if (false !== strpos((string) $hook, 'ogm-members')) {
            $this->enqueue_assets();
        }
    }

    private function page_url($key, $fallback = '/') {
        $ids = (array) get_option(self::PAGE_IDS_KEY, array());
        if (!empty($ids[$key]) && 'publish' === get_post_status(absint($ids[$key]))) {
            return get_permalink(absint($ids[$key]));
        }
        return home_url($fallback);
    }

    private function current_url() {
        $scheme = is_ssl() ? 'https' : 'http';
        $host = isset($_SERVER['HTTP_HOST']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_HOST'])) : wp_parse_url(home_url(), PHP_URL_HOST);
        $uri = isset($_SERVER['REQUEST_URI']) ? esc_url_raw(wp_unslash($_SERVER['REQUEST_URI'])) : '/';
        return esc_url_raw($scheme . '://' . $host . $uri);
    }

    private function login_prompt($message = 'Sign in to access your OneGodian member tools.') {
        $login = $this->page_url('login', '/login/');
        $join = $this->page_url('join', '/join/');
        return '<section class="ogm-pro ogm-auth-card"><span class="ogm-pro-badge">Member Access</span><h2>Sign in to continue</h2><p>' . esc_html($message) . '</p><div class="ogm-pro-actions"><a class="ogm-pro-btn" href="' . esc_url($login) . '">Member Login</a><a class="ogm-pro-btn ogm-pro-btn-secondary" href="' . esc_url($join) . '">Join OneGodian</a></div></section>';
    }

    private function bp_active() {
        return function_exists('buddypress') || defined('BP_VERSION');
    }

    private function bp_component_url($component, $user_id = 0) {
        if (!$this->bp_active()) {
            return '';
        }
        if ('members' === $component && function_exists('bp_get_members_directory_permalink')) {
            return bp_get_members_directory_permalink();
        }
        if ('groups' === $component && function_exists('bp_get_groups_directory_permalink')) {
            return bp_get_groups_directory_permalink();
        }
        if ('activity' === $component && function_exists('bp_get_activity_directory_permalink')) {
            return bp_get_activity_directory_permalink();
        }
        $user_id = $user_id ? absint($user_id) : get_current_user_id();
        if (!$user_id || !function_exists('bp_core_get_user_domain')) {
            return '';
        }
        $domain = bp_core_get_user_domain($user_id);
        $map = array(
            'profile' => 'profile/',
            'messages' => 'messages/',
            'notifications' => 'notifications/',
            'settings' => 'settings/',
            'friends' => 'friends/',
            'activity-user' => 'activity/',
            'groups-user' => 'groups/',
        );
        return isset($map[$component]) ? trailingslashit($domain . $map[$component]) : $domain;
    }

    private function links($user_id = 0) {
        $user_id = $user_id ? absint($user_id) : get_current_user_id();
        $settings = $this->get_settings();
        $links = array(
            'dashboard' => $this->page_url('member_dashboard', '/member-dashboard/'),
            'account' => $this->page_url('member_account', '/member-account/'),
            'profile' => $this->page_url('member_profile', '/member-profile/'),
            'community' => $this->page_url('community', '/community/'),
            'members' => $this->page_url('members', '/members/'),
            'groups' => $this->page_url('groups', '/member-groups/'),
            'activity' => $this->page_url('activity', '/member-activity/'),
            'messages' => $this->page_url('messages', '/member-messages/'),
            'notifications' => $this->page_url('notifications', '/member-notifications/'),
            'resources' => $this->page_url('resources', '/membership-resources/'),
            'certificates' => $this->page_url('certificates', '/member-certificates/'),
            'support' => $settings['support_url'],
            'app' => $settings['app_url'],
        );
        if ($this->bp_active()) {
            $links['profile'] = $this->bp_component_url('profile', $user_id) ?: $links['profile'];
            $links['members'] = $this->bp_component_url('members') ?: $links['members'];
            $links['groups'] = $this->bp_component_url('groups') ?: $links['groups'];
            $links['activity'] = $this->bp_component_url('activity') ?: $links['activity'];
            $links['messages'] = $this->bp_component_url('messages', $user_id) ?: $links['messages'];
            $links['notifications'] = $this->bp_component_url('notifications', $user_id) ?: $links['notifications'];
        }
        return $links;
    }

    private function card($title, $body, $url = '', $label = 'Open', $badge = '') {
        $html = '<article class="ogm-pro-card">';
        if ($badge) {
            $html .= '<span class="ogm-pro-badge">' . esc_html($badge) . '</span>';
        }
        $html .= '<h3>' . esc_html($title) . '</h3><p>' . esc_html($body) . '</p>';
        if ($url) {
            $html .= '<a class="ogm-pro-link" href="' . esc_url($url) . '">' . esc_html($label) . ' →</a>';
        }
        return $html . '</article>';
    }

    public function membership_hub_shortcode() {
        $links = $this->links();
        $welcome = is_user_logged_in() ? 'Welcome back. Your account, profile, community, resources, certificates, and social tools are organized here.' : 'Join, sign in, and use one consistent member experience across OneGodian membership, resources, certificates, and community.';
        $html = '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">OneGodian Members</span><h2>Your OneGodian membership home</h2><p>' . esc_html($welcome) . '</p></div><div class="ogm-pro-grid">';
        if (!is_user_logged_in()) {
            $html .= $this->card('Member Login', 'Sign in to access your dashboard and profile.', $this->page_url('login', '/login/'), 'Sign In', 'Account');
            $html .= $this->card('Join OneGodian', 'Review membership pathways and create your account.', $this->page_url('join', '/join/'), 'View Membership', 'Join');
        } else {
            $html .= $this->card('Dashboard', 'Your member command center and quick actions.', $links['dashboard'], 'Open Dashboard', 'Member');
            $html .= $this->card('Profile', 'Manage your identity, avatar, biography, and community profile.', $links['profile'], 'Open Profile', 'Profile');
        }
        $html .= $this->card('Community', 'Connect through members, activity, groups, messages, and notifications.', $links['community'], 'Open Community', $this->bp_active() ? 'BuddyPress Connected' : 'Community');
        $html .= $this->card('Resources', 'Member resources, education, tools, and support.', $links['resources'], 'View Resources', 'Resources');
        return $html . '</div></section>';
    }

    public function login_shortcode() {
        if (is_user_logged_in()) {
            $user = wp_get_current_user();
            return '<section class="ogm-pro ogm-auth-card"><span class="ogm-pro-badge">Signed In</span><h2>Welcome, ' . esc_html($user->display_name) . '</h2><p>You are already signed in.</p><div class="ogm-pro-actions"><a class="ogm-pro-btn" href="' . esc_url($this->page_url('member_dashboard', '/member-dashboard/')) . '">Open Dashboard</a><a class="ogm-pro-btn ogm-pro-btn-secondary" href="' . esc_url(wp_logout_url(home_url('/'))) . '">Sign Out</a></div></section>';
        }
        if (shortcode_exists('woocommerce_my_account')) {
            return '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">Secure Account</span><h2>Member login</h2><p>Sign in or register through the OneGodian account system.</p></div><div class="ogm-pro-account-shell">' . do_shortcode('[woocommerce_my_account]') . '</div></section>';
        }
        ob_start();
        wp_login_form(array('echo' => true, 'redirect' => $this->page_url('member_dashboard', '/member-dashboard/'), 'remember' => true));
        $form = ob_get_clean();
        return '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">Secure Account</span><h2>Member login</h2><p>Sign in with your WordPress account.</p></div><div class="ogm-pro-account-shell">' . $form . '</div></section>';
    }

    public function my_account_shortcode() {
        if (!is_user_logged_in()) {
            return $this->login_shortcode();
        }
        if (shortcode_exists('woocommerce_my_account')) {
            return '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">My Account</span><h2>Orders, addresses, downloads, and account details</h2><p>Your commerce account remains powered by WooCommerce while OneGodian Members adds profile, community, certificates, and member navigation.</p></div><div class="ogm-pro-account-shell">' . do_shortcode('[woocommerce_my_account]') . '</div></section>';
        }
        return $this->profile_shortcode();
    }

    public function navigation_shortcode() {
        if (!is_user_logged_in()) {
            return $this->login_prompt();
        }
        $links = $this->links();
        $items = array(
            'Dashboard' => $links['dashboard'], 'Account' => $links['account'], 'Profile' => $links['profile'], 'Community' => $links['community'], 'Members' => $links['members'], 'Groups' => $links['groups'], 'Activity' => $links['activity'], 'Messages' => $links['messages'], 'Notifications' => $links['notifications'], 'Certificates' => $links['certificates'], 'Resources' => $links['resources'], 'OneGodian App' => $links['app'],
        );
        $html = '<nav class="ogm-pro-nav" aria-label="OneGodian member navigation">';
        foreach ($items as $label => $url) {
            $html .= '<a href="' . esc_url($url) . '">' . esc_html($label) . '</a>';
        }
        return $html . '</nav>';
    }

    private function profile_completion($user_id) {
        $user = get_userdata($user_id);
        if (!$user) {
            return array('score' => 0, 'complete' => 0, 'total' => 6);
        }
        $fields = array(
            (bool) $user->user_email,
            (bool) get_user_meta($user_id, 'first_name', true),
            (bool) get_user_meta($user_id, 'last_name', true),
            (bool) get_user_meta($user_id, 'description', true),
            (bool) $user->display_name,
            (bool) get_avatar_url($user_id),
        );
        $complete = count(array_filter($fields));
        return array('score' => (int) round(($complete / count($fields)) * 100), 'complete' => $complete, 'total' => count($fields));
    }

    public function profile_completion_shortcode() {
        if (!is_user_logged_in()) {
            return $this->login_prompt('Sign in to view your profile completion status.');
        }
        $status = $this->profile_completion(get_current_user_id());
        return '<div class="ogm-pro-completion"><div><strong>Profile completion</strong><span>' . esc_html($status['score']) . '%</span></div><div class="ogm-pro-progress" role="progressbar" aria-valuenow="' . esc_attr($status['score']) . '" aria-valuemin="0" aria-valuemax="100"><span style="width:' . esc_attr($status['score']) . '%"></span></div></div>';
    }

    public function profile_shortcode() {
        if (!is_user_logged_in()) {
            return $this->login_prompt('Sign in to view and manage your member profile.');
        }
        $user = wp_get_current_user();
        $links = $this->links($user->ID);
        $bio = get_user_meta($user->ID, 'description', true);
        $html = '<section class="ogm-pro"><div class="ogm-pro-profile"><div class="ogm-pro-avatar">' . get_avatar($user->ID, 128) . '</div><div><span class="ogm-pro-badge">Member Profile</span><h2>' . esc_html($user->display_name) . '</h2><p>' . esc_html($bio ?: 'Add a short biography so other community members can understand who you are and what you are building.') . '</p><div class="ogm-pro-actions"><a class="ogm-pro-btn" href="' . esc_url($links['profile']) . '">Edit Community Profile</a><a class="ogm-pro-btn ogm-pro-btn-secondary" href="' . esc_url($links['account']) . '">Account Settings</a></div></div></div>';
        $html .= $this->profile_completion_shortcode();
        return $html . '</section>';
    }

    public function dashboard_shortcode() {
        if (!is_user_logged_in()) {
            return $this->login_prompt('Your member dashboard is available after sign in.');
        }
        $user = wp_get_current_user();
        $links = $this->links($user->ID);
        $html = '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">Member Dashboard</span><h2>Welcome, ' . esc_html($user->display_name) . '</h2><p>Manage your OneGodian account, profile, community activity, resources, certificates, messages, and connected app experience from one place.</p></div>';
        $html .= $this->navigation_shortcode();
        $html .= '<div class="ogm-pro-grid">';
        $html .= $this->card('My Account', 'Orders, downloads, addresses, subscriptions, and account details.', $links['account'], 'Open Account', 'Commerce');
        $html .= $this->card('My Profile', 'Avatar, biography, community identity, and profile completion.', $links['profile'], 'Open Profile', 'Identity');
        $html .= $this->card('Community', 'Members, activity, groups, connections, and social networking.', $links['community'], 'Open Community', $this->bp_active() ? 'Connected' : 'Community');
        $html .= $this->card('Messages', 'Private community messages and conversations.', $links['messages'], 'Open Messages', 'Social');
        $html .= $this->card('Notifications', 'Community and membership notifications.', $links['notifications'], 'View Notifications', 'Updates');
        $html .= $this->card('Certificates', 'Membership and recognition certificates.', $links['certificates'], 'View Certificates', 'Records');
        $html .= $this->card('Resources', 'Learning, downloads, member resources, and support.', $links['resources'], 'View Resources', 'Learning');
        $html .= $this->card('OneGodian App', 'Open the connected OneGodian App members command center.', $links['app'], 'Open App', 'App Bridge');
        return $html . '</div>' . $this->profile_completion_shortcode() . '</section>';
    }

    public function community_shortcode() {
        $links = $this->links();
        $html = '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">Community</span><h2>OneGodian social community</h2><p>Member profiles, activity, groups, messages, notifications, and community discovery use BuddyPress/BuddyBoss when available and fall back to the OneGodian member pages when those components are not installed.</p></div><div class="ogm-pro-grid">';
        $html .= $this->card('Members', 'Browse the community member directory.', $links['members'], 'Browse Members', 'Directory');
        $html .= $this->card('Activity', 'Follow community activity and updates.', $links['activity'], 'Open Activity', 'Feed');
        $html .= $this->card('Groups', 'Discover and participate in community groups.', $links['groups'], 'Browse Groups', 'Groups');
        if (is_user_logged_in()) {
            $html .= $this->card('Messages', 'Open your private member conversations.', $links['messages'], 'Open Messages', 'Private');
            $html .= $this->card('Notifications', 'Review your social and membership alerts.', $links['notifications'], 'View Notifications', 'Alerts');
            $html .= $this->card('My Profile', 'Manage your public community profile.', $links['profile'], 'Open Profile', 'Profile');
        } else {
            $html .= $this->card('Member Login', 'Sign in to message members and manage your community profile.', $this->page_url('login', '/login/'), 'Sign In', 'Account');
        }
        return $html . '</div></section>';
    }

    public function members_directory_shortcode() {
        $url = $this->bp_component_url('members');
        if ($url) {
            return '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">BuddyPress Connected</span><h2>Members Directory</h2><p>The canonical social directory is managed by BuddyPress/BuddyBoss so profiles, privacy, pagination, search, and connections stay inside the native community system.</p><a class="ogm-pro-btn" href="' . esc_url($url) . '">Open Members Directory</a></div></section>';
        }
        return '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">Community Module</span><h2>Members Directory</h2><p>Install and configure BuddyPress or BuddyBoss to activate the production social directory. The OneGodian Members plugin will automatically connect this page after activation.</p></div></section>';
    }

    public function groups_shortcode() {
        $url = $this->bp_component_url('groups');
        if ($url) {
            return '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">BuddyPress Connected</span><h2>Community Groups</h2><p>Groups are managed by the native community layer for membership, invitations, privacy, activity, and moderation.</p><a class="ogm-pro-btn" href="' . esc_url($url) . '">Open Groups</a></div></section>';
        }
        return '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">Community Module</span><h2>Community Groups</h2><p>BuddyPress/BuddyBoss groups are not active. This page will connect automatically when the groups component is available.</p></div></section>';
    }

    public function activity_shortcode() {
        $url = $this->bp_component_url('activity');
        if ($url) {
            return '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">Activity Feed</span><h2>Community Activity</h2><p>Open the native activity stream for posts, comments, mentions, group updates, and community participation.</p><a class="ogm-pro-btn" href="' . esc_url($url) . '">Open Activity Feed</a></div></section>';
        }
        return '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">Community Module</span><h2>Community Activity</h2><p>BuddyPress/BuddyBoss activity is not active on this site.</p></div></section>';
    }

    public function messages_shortcode() {
        if (!is_user_logged_in()) {
            return $this->login_prompt('Sign in to access private member messages.');
        }
        $url = $this->bp_component_url('messages', get_current_user_id());
        if ($url) {
            return '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">Private</span><h2>Member Messages</h2><p>Private messages are handled by the connected BuddyPress/BuddyBoss messaging component.</p><a class="ogm-pro-btn" href="' . esc_url($url) . '">Open Messages</a></div></section>';
        }
        return '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">Messaging</span><h2>Member Messages</h2><p>Private messaging requires the BuddyPress/BuddyBoss messages component.</p></div></section>';
    }

    public function notifications_shortcode() {
        if (!is_user_logged_in()) {
            return $this->login_prompt('Sign in to view member notifications.');
        }
        $url = $this->bp_component_url('notifications', get_current_user_id());
        if ($url) {
            return '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">Notifications</span><h2>Member Notifications</h2><p>Community notifications are managed by the connected BuddyPress/BuddyBoss component.</p><a class="ogm-pro-btn" href="' . esc_url($url) . '">View Notifications</a></div></section>';
        }
        return '<section class="ogm-pro"><div class="ogm-pro-hero"><span class="ogm-pro-badge">Notifications</span><h2>Member Notifications</h2><p>BuddyPress/BuddyBoss notifications are not active on this site.</p></div></section>';
    }

    public function status_shortcode() {
        $page_status = (array) get_option(self::PAGE_STATUS_KEY, array());
        $managed = count(array_filter($page_status, static function ($status) { return 'managed' === $status || 'created' === $status || 'updated' === $status; }));
        return '<section class="ogm-pro"><div class="ogm-pro-grid">' . $this->card('Plugin Version', OGM_VERSION, '', '', 'OneGodian Members') . $this->card('WooCommerce', class_exists('WooCommerce') ? 'Connected' : 'Not detected', '', '', class_exists('WooCommerce') ? 'Connected' : 'Optional') . $this->card('BuddyPress / BuddyBoss', $this->bp_active() ? 'Connected' : 'Not detected', '', '', $this->bp_active() ? 'Connected' : 'Optional') . $this->card('Managed Pages', $managed . ' of ' . count($this->page_map) . ' page definitions synchronized.', '', '', 'Page Sync') . '</div></section>';
    }

    public function register_woocommerce_endpoint() {
        if (function_exists('add_rewrite_endpoint')) {
            add_rewrite_endpoint('onegodian-dashboard', EP_ROOT | EP_PAGES);
        }
    }

    public function woocommerce_account_menu_items($items) {
        if (!is_array($items)) {
            return $items;
        }
        $new = array();
        foreach ($items as $key => $label) {
            $new[$key] = $label;
            if ('dashboard' === $key) {
                $new['onegodian-dashboard'] = __('OneGodian Dashboard', 'onegodian-members');
            }
        }
        return $new;
    }

    public function woocommerce_dashboard_endpoint() {
        echo wp_kses_post($this->dashboard_shortcode());
    }

    public function register_buddypress_nav() {
        if (!$this->bp_active() || !function_exists('bp_core_new_nav_item') || !is_user_logged_in()) {
            return;
        }
        bp_core_new_nav_item(array(
            'name' => __('OneGodian', 'onegodian-members'),
            'slug' => 'onegodian',
            'position' => 85,
            'screen_function' => array($this, 'buddypress_screen'),
            'show_for_displayed_user' => false,
            'default_subnav_slug' => 'onegodian',
            'item_css_id' => 'onegodian-members-nav',
        ));
    }

    public function buddypress_screen() {
        add_action('bp_template_content', array($this, 'buddypress_screen_content'));
        if (function_exists('bp_core_load_template')) {
            bp_core_load_template('members/single/plugins');
        }
    }

    public function buddypress_screen_content() {
        echo wp_kses_post($this->dashboard_shortcode());
    }

    public function register_widgets() {
        if (!class_exists('WP_Widget')) {
            return;
        }
        register_widget('OneGodian_Members_Account_Widget');
        register_widget('OneGodian_Members_Community_Widget');
        register_widget('OneGodian_Members_Status_Widget');
    }

    public function register_rest_routes() {
        register_rest_route('onegodian-members/v1', '/health', array('methods' => 'GET', 'callback' => array($this, 'rest_health'), 'permission_callback' => '__return_true'));
        register_rest_route('onegodian-members/v1', '/manifest', array('methods' => 'GET', 'callback' => array($this, 'rest_manifest'), 'permission_callback' => '__return_true'));
        register_rest_route('onegodian-members/v1', '/me', array('methods' => 'GET', 'callback' => array($this, 'rest_me'), 'permission_callback' => static function () { return is_user_logged_in(); }));
        register_rest_route('onegodian-members/v1', '/admin/summary', array('methods' => 'GET', 'callback' => array($this, 'rest_admin_summary'), 'permission_callback' => static function () { return current_user_can('manage_options'); }));
        register_rest_route('onegodian-members/v1', '/sync/status', array('methods' => 'GET', 'callback' => array($this, 'rest_sync_status'), 'permission_callback' => array($this, 'bridge_permission')));
    }

    public function bridge_permission($request) {
        if (current_user_can('manage_options')) {
            return true;
        }
        $settings = $this->get_settings();
        $provided = $request->get_header('x-onegodian-members-key');
        return !empty($provided) && !empty($settings['app_bridge_key']) && hash_equals((string) $settings['app_bridge_key'], (string) $provided);
    }

    private function page_manifest() {
        $ids = (array) get_option(self::PAGE_IDS_KEY, array());
        $statuses = (array) get_option(self::PAGE_STATUS_KEY, array());
        $pages = array();
        foreach ($this->page_map as $key => $definition) {
            $id = isset($ids[$key]) ? absint($ids[$key]) : 0;
            $pages[$key] = array(
                'title' => $definition['title'],
                'slug' => $definition['slug'],
                'shortcode' => $definition['shortcode'],
                'page_id' => $id,
                'url' => $id ? get_permalink($id) : home_url('/' . $definition['slug'] . '/'),
                'status' => isset($statuses[$key]) ? $statuses[$key] : 'pending',
            );
        }
        return $pages;
    }

    public function rest_health() {
        return rest_ensure_response(array(
            'status' => 'ok',
            'service' => 'onegodian-members',
            'version' => OGM_VERSION,
            'wordpress' => get_bloginfo('version'),
            'woocommerce' => class_exists('WooCommerce'),
            'buddypress' => $this->bp_active(),
            'auto_page_sync' => 'yes' === $this->get_settings()['auto_sync_pages'],
            'timestamp_utc' => gmdate('c'),
        ));
    }

    public function rest_manifest() {
        $settings = $this->get_settings();
        return rest_ensure_response(array(
            'id' => 'onegodian-members',
            'name' => 'OneGodian Members & Community',
            'version' => OGM_VERSION,
            'status' => 'functional',
            'features' => array('membership', 'login', 'woocommerce-account', 'profile', 'dashboard', 'widgets', 'page-sync', 'buddypress-compatibility', 'community-navigation', 'rest-api', 'app-bridge'),
            'shortcodes' => $this->shortcodes,
            'legacy_shortcodes' => array('onegodian_membership_cta', 'onegodian_members_pricing', 'onegodian_membership_resources', 'onegodian_member_certificates', 'onegodian_member_dashboard', 'onegodian_member_support'),
            'pages' => $this->page_manifest(),
            'integrations' => array('woocommerce' => class_exists('WooCommerce'), 'buddypress' => $this->bp_active(), 'onegodian_app' => $settings['app_url']),
            'endpoints' => array('/health', '/manifest', '/me', '/admin/summary', '/sync/status'),
        ));
    }

    public function rest_me() {
        $user = wp_get_current_user();
        $links = $this->links($user->ID);
        return rest_ensure_response(array(
            'id' => $user->ID,
            'display_name' => $user->display_name,
            'avatar_url' => get_avatar_url($user->ID, array('size' => 192)),
            'profile_completion' => $this->profile_completion($user->ID),
            'links' => $links,
            'community' => array('buddypress' => $this->bp_active()),
        ));
    }

    public function rest_admin_summary() {
        $counts = count_users();
        return rest_ensure_response(array(
            'version' => OGM_VERSION,
            'users_total' => isset($counts['total_users']) ? absint($counts['total_users']) : 0,
            'woocommerce' => class_exists('WooCommerce'),
            'buddypress' => $this->bp_active(),
            'pages' => $this->page_manifest(),
            'app_url' => $this->get_settings()['app_url'],
            'timestamp_utc' => gmdate('c'),
        ));
    }

    public function rest_sync_status() {
        $manifest = $this->rest_manifest()->get_data();
        return rest_ensure_response(array(
            'status' => 'ok',
            'version' => OGM_VERSION,
            'manifest_hash' => hash('sha256', wp_json_encode($manifest)),
            'pages' => $this->page_manifest(),
            'timestamp_utc' => gmdate('c'),
        ));
    }

    public function ensure_pages($force = false) {
        $ids = (array) get_option(self::PAGE_IDS_KEY, array());
        $statuses = array();
        foreach ($this->page_map as $key => $definition) {
            $post = null;
            if (!empty($ids[$key])) {
                $post = get_post(absint($ids[$key]));
            }
            if (!$post) {
                $post = get_page_by_path($definition['slug'], OBJECT, 'page');
            }
            $content = self::MANAGED_MARKER . "\n" . $definition['shortcode'];
            if (!$post) {
                $page_id = wp_insert_post(array('post_title' => $definition['title'], 'post_name' => $definition['slug'], 'post_type' => 'page', 'post_status' => 'publish', 'post_content' => $content), true);
                if (!is_wp_error($page_id)) {
                    $ids[$key] = absint($page_id);
                    $statuses[$key] = 'created';
                } else {
                    $statuses[$key] = 'error';
                }
                continue;
            }
            $ids[$key] = absint($post->ID);
            $managed = false !== strpos((string) $post->post_content, self::MANAGED_MARKER);
            if (!$managed && trim(wp_strip_all_tags((string) $post->post_content))) {
                $statuses[$key] = 'preserved-unmanaged';
                continue;
            }
            if ($force || $managed || !trim((string) $post->post_content)) {
                $needs_update = $post->post_title !== $definition['title'] || trim((string) $post->post_content) !== trim($content);
                if ($needs_update) {
                    wp_update_post(array('ID' => $post->ID, 'post_title' => $definition['title'], 'post_content' => $content));
                    $statuses[$key] = 'updated';
                } else {
                    $statuses[$key] = 'managed';
                }
            }
        }
        update_option(self::PAGE_IDS_KEY, $ids, false);
        update_option(self::PAGE_STATUS_KEY, $statuses, false);
        update_option(self::INSTALLED_VERSION_KEY, OGM_VERSION, false);
        return $statuses;
    }

    public function maybe_upgrade_pages() {
        $settings = $this->ensure_settings();
        if ('yes' !== $settings['auto_sync_pages']) {
            return;
        }
        if ((string) get_option(self::INSTALLED_VERSION_KEY, '') !== (string) OGM_VERSION) {
            $this->ensure_pages(false);
            flush_rewrite_rules(false);
        }
    }

    public function register_admin_page() {
        add_submenu_page('ogm-members', 'Members Production', 'Members Production', 'manage_options', 'ogm-members-production', array($this, 'render_admin_page'));
    }

    public function render_admin_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        $settings = $this->get_settings();
        $pages = $this->page_manifest();
        echo '<div class="wrap ogm-pro-admin"><h1>OneGodian Members — Production Control</h1><p>Membership UX, login/account integration, BuddyPress compatibility, app bridge status, shortcodes, widgets, and managed page synchronization.</p>';
        echo $this->status_shortcode();
        echo '<div class="ogm-pro-admin-grid"><section class="ogm-pro-admin-panel"><h2>App Bridge</h2><form method="post" action="options.php">';
        settings_fields('ogm_production');
        echo '<p><label>OneGodian App Members URL<br><input class="regular-text" name="' . esc_attr(self::SETTINGS_KEY) . '[app_url]" value="' . esc_attr($settings['app_url']) . '"></label></p>';
        echo '<p><label>Support URL<br><input class="regular-text" name="' . esc_attr(self::SETTINGS_KEY) . '[support_url]" value="' . esc_attr($settings['support_url']) . '"></label></p>';
        echo '<p><label><input type="checkbox" name="' . esc_attr(self::SETTINGS_KEY) . '[auto_sync_pages]" value="1" ' . checked('yes', $settings['auto_sync_pages'], false) . '> Automatically create/update plugin-managed shortcode pages after version upgrades.</label></p>';
        echo '<p><label>Bridge Key<br><input class="large-text code" readonly value="' . esc_attr($settings['app_bridge_key']) . '"></label></p>';
        submit_button('Save Members Settings');
        echo '</form><form method="post" action="' . esc_url(admin_url('admin-post.php')) . '"><input type="hidden" name="action" value="ogm_rotate_bridge_key">';
        wp_nonce_field('ogm_rotate_bridge_key');
        submit_button('Rotate Bridge Key', 'secondary', 'submit', false);
        echo '</form></section>';
        echo '<section class="ogm-pro-admin-panel"><h2>Managed Pages</h2><table class="widefat striped"><thead><tr><th>Page</th><th>Shortcode</th><th>Status</th></tr></thead><tbody>';
        foreach ($pages as $page) {
            echo '<tr><td><a href="' . esc_url($page['url']) . '" target="_blank" rel="noopener">' . esc_html($page['title']) . '</a></td><td><code>' . esc_html($page['shortcode']) . '</code></td><td>' . esc_html($page['status']) . '</td></tr>';
        }
        echo '</tbody></table><form method="post" action="' . esc_url(admin_url('admin-post.php')) . '" style="margin-top:16px"><input type="hidden" name="action" value="ogm_sync_pages">';
        wp_nonce_field('ogm_sync_pages');
        submit_button('Regenerate Managed Pages', 'secondary', 'submit', false);
        echo '</form></section>';
        echo '<section class="ogm-pro-admin-panel"><h2>REST API</h2><p><code>/wp-json/onegodian-members/v1/health</code></p><p><code>/wp-json/onegodian-members/v1/manifest</code></p><p><code>/wp-json/onegodian-members/v1/me</code></p><p><code>/wp-json/onegodian-members/v1/admin/summary</code></p><p><code>/wp-json/onegodian-members/v1/sync/status</code></p><p>Server-to-server sync uses <code>X-OneGodian-Members-Key</code>.</p></section>';
        echo '<section class="ogm-pro-admin-panel"><h2>New Shortcodes</h2><div class="ogm-pro-code-grid">';
        foreach ($this->shortcodes as $shortcode) {
            echo '<code>[' . esc_html($shortcode) . ']</code>';
        }
        echo '</div></section></div></div>';
    }

    public function rotate_bridge_key() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('Insufficient permissions.', 'onegodian-members'));
        }
        check_admin_referer('ogm_rotate_bridge_key');
        $settings = $this->get_settings();
        $settings['app_bridge_key'] = wp_generate_password(48, false, false);
        update_option(self::SETTINGS_KEY, $settings, false);
        wp_safe_redirect(add_query_arg('rotated', '1', admin_url('admin.php?page=ogm-members-production')));
        exit;
    }

    public function manual_sync_pages() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('Insufficient permissions.', 'onegodian-members'));
        }
        check_admin_referer('ogm_sync_pages');
        $this->ensure_pages(true);
        flush_rewrite_rules(false);
        wp_safe_redirect(add_query_arg('synced', '1', admin_url('admin.php?page=ogm-members-production')));
        exit;
    }
}

if (class_exists('WP_Widget')) {
    class OneGodian_Members_Account_Widget extends WP_Widget {
        public function __construct() { parent::__construct('ogm_account_widget', 'OneGodian Member Account', array('description' => 'Login/account and dashboard access for OneGodian members.')); }
        public function widget($args, $instance) { echo $args['before_widget']; echo do_shortcode(is_user_logged_in() ? '[onegodian_member_profile]' : '[onegodian_login]'); echo $args['after_widget']; }
        public function form($instance) { echo '<p>' . esc_html__('Automatically shows login or the signed-in member profile.', 'onegodian-members') . '</p>'; }
    }

    class OneGodian_Members_Community_Widget extends WP_Widget {
        public function __construct() { parent::__construct('ogm_community_widget', 'OneGodian Community', array('description' => 'Community navigation for members, activity, groups, messages, and notifications.')); }
        public function widget($args, $instance) { echo $args['before_widget']; echo do_shortcode('[onegodian_community_hub]'); echo $args['after_widget']; }
        public function form($instance) { echo '<p>' . esc_html__('Uses BuddyPress/BuddyBoss when available.', 'onegodian-members') . '</p>'; }
    }

    class OneGodian_Members_Status_Widget extends WP_Widget {
        public function __construct() { parent::__construct('ogm_status_widget', 'OneGodian Members Status', array('description' => 'Plugin, WooCommerce, BuddyPress, and managed-page status.')); }
        public function widget($args, $instance) { echo $args['before_widget']; echo do_shortcode('[onegodian_members_status]'); echo $args['after_widget']; }
        public function form($instance) { echo '<p>' . esc_html__('Displays production integration status.', 'onegodian-members') . '</p>'; }
    }
}
