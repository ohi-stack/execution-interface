<?php
/**
 * Contributors, creator network, and affiliate placeholders for OneGodian Members.
 *
 * @package OneGodian_Members
 */

if (!defined('ABSPATH')) {
    exit;
}

class OneGodian_Members_Contributors_Affiliates {
    const OPTION_KEY = 'ogm_contributors_affiliates_settings';

    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct() {
        add_action('init', array($this, 'register_shortcodes'));
        add_action('admin_menu', array($this, 'register_admin_sections'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_styles'));
    }

    public static function defaults() {
        return array(
            'contribute_url' => home_url('/become-an-affiliate'),
            'creator_network_url' => home_url('/creator-network'),
            'affiliate_signup_url' => home_url('/become-an-affiliate'),
            'affiliate_dashboard_url' => home_url('/affiliate-dashboard'),
            'woo_contribution_product_id' => '',
            'woo_creator_application_product_id' => '',
            'enable_public_contributor_wall' => '1',
            'enable_creator_network' => '1',
            'enable_affiliate_dashboard' => '1',
            'enable_referral_links' => '1',
            'enable_campaign_assets' => '1',
            'default_disclaimer_text' => self::compliance_notice(),
        );
    }

    public static function compliance_notice() {
        return 'Contributions are voluntary support payments for ONEGODIAN, LLC public-facing products, education, media, technology, membership, creator resources, and community infrastructure. Contributions are not equity, securities, loans, bonds, investment contracts, or promises of financial return.';
    }

    public static function affiliate_page_cluster() {
        return array(
            '/affiliates',
            '/become-an-affiliate',
            '/affiliate-dashboard',
            '/affiliate-resources',
            '/affiliate-links',
            '/commission-structure',
            '/marketing-materials',
            '/affiliate-training',
            '/affiliate-faq',
            '/affiliate-terms',
            '/creator-network',
            '/student-ambassador-program',
            '/campus-representatives',
        );
    }

    public static function contributor_tiers() {
        return array(
            array('name' => 'Supporter', 'amount' => '$11'),
            array('name' => 'Builder', 'amount' => '$33'),
            array('name' => 'Sustainer', 'amount' => '$77'),
            array('name' => 'Founder Circle', 'amount' => '$111'),
            array('name' => 'Infrastructure Partner', 'amount' => '$333+'),
            array('name' => 'Custom Contribution', 'amount' => 'Any amount'),
        );
    }

    public function get_settings() {
        return wp_parse_args((array) get_option(self::OPTION_KEY, array()), self::defaults());
    }

    public function register_shortcodes() {
        add_shortcode('onegodian_contributors_page', array($this, 'contributors_page_shortcode'));
        add_shortcode('onegodian_contributor_tiers', array($this, 'contributor_tiers_shortcode'));
        add_shortcode('onegodian_creator_network', array($this, 'creator_network_shortcode'));
        add_shortcode('onegodian_affiliate_dashboard', array($this, 'affiliate_dashboard_shortcode'));
        add_shortcode('onegodian_referral_link', array($this, 'referral_link_shortcode'));
        add_shortcode('onegodian_contributor_wall', array($this, 'contributor_wall_shortcode'));
        add_shortcode('onegodian_contributor_disclaimer', array($this, 'disclaimer_shortcode'));
    }

    public function register_admin_sections() {
        add_menu_page('OneGodian Members', 'OneGodian Members', 'manage_options', 'ogm-members', array($this, 'render_admin_page'), 'dashicons-groups', 58);
        $sections = array('Contributors', 'Creator Network', 'Affiliate Settings', 'Referral Links', 'Contributor Wall', 'Campaign Assets', 'Compliance Notices');
        foreach ($sections as $section) {
            add_submenu_page('ogm-members', $section, $section, 'manage_options', 'ogm-' . sanitize_title($section), array($this, 'render_admin_page'));
        }
    }

    public function register_settings() {
        register_setting('ogm_contributors_affiliates', self::OPTION_KEY, array($this, 'sanitize_settings'));
    }

    public function sanitize_settings($input) {
        $defaults = self::defaults();
        $output = array();
        foreach ($defaults as $key => $default) {
            if (false !== strpos($key, 'enable_')) {
                $output[$key] = empty($input[$key]) ? '0' : '1';
            } elseif (false !== strpos($key, '_url')) {
                $output[$key] = isset($input[$key]) ? esc_url_raw($input[$key]) : $default;
            } elseif (false !== strpos($key, 'product_id')) {
                $output[$key] = isset($input[$key]) ? absint($input[$key]) : '';
            } else {
                $output[$key] = isset($input[$key]) ? sanitize_textarea_field($input[$key]) : $default;
            }
        }
        return $output;
    }

    public function enqueue_styles() {
        wp_register_style('ogm-contributors-affiliates', false, array(), defined('OGM_VERSION') ? OGM_VERSION : '1.7.0');
        wp_enqueue_style('ogm-contributors-affiliates');
        wp_add_inline_style('ogm-contributors-affiliates', $this->brand_css());
    }

    private function brand_css() {
        return '.ogm-panel{background:linear-gradient(135deg,#07050b 0%,#161022 55%,#2a1147 100%);border:1px solid rgba(214,170,76,.45);border-radius:22px;color:#fff;padding:28px;margin:24px 0;box-shadow:0 18px 50px rgba(0,0,0,.35)}.ogm-panel h2,.ogm-panel h3{color:#f7d57a;margin-top:0}.ogm-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}.ogm-card{background:rgba(255,255,255,.06);border:1px solid rgba(247,213,122,.25);border-radius:16px;padding:18px}.ogm-pill{display:inline-block;background:#6d35b1;color:#fff;border:1px solid #f7d57a;border-radius:999px;padding:6px 12px;font-weight:700}.ogm-button{display:inline-block;background:linear-gradient(90deg,#f7d57a,#b9862d);border-radius:999px;color:#09060d!important;font-weight:800;padding:12px 20px;text-decoration:none}.ogm-muted{color:#d8cdea}.ogm-notice{border-left:4px solid #f7d57a;background:rgba(247,213,122,.1);padding:14px;border-radius:10px}';
    }

    public function contributors_page_shortcode() {
        $settings = $this->get_settings();
        return '<section class="ogm-panel"><span class="ogm-pill">ONEGODIAN Contributors</span><h2>Support public-facing education, media, technology, membership, creator resources, and community infrastructure.</h2>' . $this->contributor_tiers_shortcode() . '<p><a class="ogm-button" href="' . esc_url($settings['contribute_url']) . '">Contribute or Apply</a></p>' . $this->disclaimer_shortcode() . '</section>';
    }

    public function contributor_tiers_shortcode() {
        $html = '<div class="ogm-grid ogm-tiers">';
        foreach (self::contributor_tiers() as $tier) {
            $html .= '<article class="ogm-card"><h3>' . esc_html($tier['name']) . '</h3><p class="ogm-pill">' . esc_html($tier['amount']) . '</p></article>';
        }
        return $html . '</div>';
    }

    public function creator_network_shortcode() {
        $settings = $this->get_settings();
        if ('1' !== $settings['enable_creator_network']) {
            return '';
        }
        return '<section class="ogm-panel"><h2>Creator Network</h2><p class="ogm-muted">Apply to collaborate on ONEGODIAN creator education, media, and community campaigns.</p><a class="ogm-button" href="' . esc_url($settings['creator_network_url']) . '">Explore Creator Network</a></section>';
    }

    public function affiliate_dashboard_shortcode() {
        $settings = $this->get_settings();
        if ('1' !== $settings['enable_affiliate_dashboard']) {
            return '';
        }
        $items = array('Referral Link', 'Campaign Assets', 'Contributor Products', 'Creator Updates', 'Compliance Notice', 'Application Status');
        $html = '<section class="ogm-panel"><h2>Affiliate Dashboard</h2><div class="ogm-grid">';
        foreach ($items as $item) {
            $html .= '<article class="ogm-card"><h3>' . esc_html($item) . '</h3><p class="ogm-muted">Placeholder content will appear here when backend tracking and approvals are connected.</p></article>';
        }
        return $html . '</div>' . $this->disclaimer_shortcode() . '</section>';
    }

    public function referral_link_shortcode() {
        $settings = $this->get_settings();
        if ('1' !== $settings['enable_referral_links']) {
            return '';
        }
        return '<div class="ogm-card"><h3>Referral Link</h3><p class="ogm-muted">Referral links are placeholders until backend tracking exists.</p><code>' . esc_html(home_url('/?ref=creator-placeholder')) . '</code></div>';
    }

    public function contributor_wall_shortcode() {
        $settings = $this->get_settings();
        if ('1' !== $settings['enable_public_contributor_wall']) {
            return '';
        }
        return '<section class="ogm-panel"><h2>Contributor Wall</h2><p class="ogm-muted">Public contributor recognition will appear here after opt-in contributor records are available.</p></section>';
    }

    public function disclaimer_shortcode() {
        $settings = $this->get_settings();
        return '<div class="ogm-notice"><strong>Compliance Notice:</strong> ' . esc_html($settings['default_disclaimer_text']) . '</div>';
    }

    public function render_admin_page() {
        $settings = $this->get_settings();
        $sections = array('Contributors', 'Creator Network', 'Affiliate Settings', 'Referral Links', 'Contributor Wall', 'Campaign Assets', 'Compliance Notices');
        echo '<div class="wrap"><h1>OneGodian Contributors & Affiliates</h1><p>Configure contributor, creator network, and affiliate placeholders.</p><h2>Admin Sections</h2><ul>';
        foreach ($sections as $section) {
            echo '<li>' . esc_html($section) . '</li>';
        }
        echo '</ul><h2>Affiliate Page Cluster</h2><ul>';
        foreach (self::affiliate_page_cluster() as $path) {
            echo '<li><code>' . esc_html($path) . '</code></li>';
        }
        echo '</ul><form method="post" action="options.php">';
        settings_fields('ogm_contributors_affiliates');
        echo '<table class="form-table" role="presentation"><tbody>';
        foreach (self::defaults() as $key => $default) {
            echo '<tr><th scope="row"><label for="' . esc_attr($key) . '">' . esc_html($key) . '</label></th><td>';
            if (false !== strpos($key, 'enable_')) {
                echo '<input type="checkbox" id="' . esc_attr($key) . '" name="' . esc_attr(self::OPTION_KEY . '[' . $key . ']') . '" value="1" ' . checked('1', $settings[$key], false) . ' />';
            } elseif ('default_disclaimer_text' === $key) {
                echo '<textarea class="large-text" rows="4" id="' . esc_attr($key) . '" name="' . esc_attr(self::OPTION_KEY . '[' . $key . ']') . '">' . esc_textarea($settings[$key]) . '</textarea>';
            } else {
                echo '<input class="regular-text" type="text" id="' . esc_attr($key) . '" name="' . esc_attr(self::OPTION_KEY . '[' . $key . ']') . '" value="' . esc_attr($settings[$key]) . '" />';
            }
            echo '</td></tr>';
        }
        echo '</tbody></table>';
        submit_button('Save Settings');
        echo '</form></div>';
    }
}
