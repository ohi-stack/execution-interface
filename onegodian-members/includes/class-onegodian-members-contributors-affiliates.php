<?php
/**
 * Modern OneGodian Members WooCommerce, contributor, creator, and affiliate UI.
 *
 * @package OneGodian_Members
 */

if (!defined('ABSPATH')) {
    exit;
}

class OneGodian_Members_Contributors_Affiliates {
    const OPTION_KEY = 'ogm_contributors_affiliates_settings';
    const NOT_CONFIGURED = 'WooCommerce product is not configured.';

    private static $instance = null;

    private $products = array(
        'woo_basic_member_product_id' => array('label' => 'Basic Member', 'badge' => 'Membership', 'description' => 'Member resources, certificates, dashboard access, and community support.', 'button' => 'Join Basic'),
        'woo_premium_member_product_id' => array('label' => 'Premium Member', 'badge' => 'Premium', 'description' => 'Enhanced membership access, premium resources, and priority support.', 'button' => 'Join Premium'),
        'woo_contributor_product_id' => array('label' => 'Contributor Support', 'badge' => 'Voluntary', 'description' => 'Voluntary support for ONEGODIAN education, media, technology, and community infrastructure.', 'button' => 'Contribute'),
        'woo_creator_application_product_id' => array('label' => 'Creator Application', 'badge' => 'Creator', 'description' => 'Apply to collaborate with the ONEGODIAN Creator Network.', 'button' => 'Apply as Creator'),
        'woo_affiliate_application_product_id' => array('label' => 'Affiliate Application', 'badge' => 'Affiliate', 'description' => 'Apply to share ONEGODIAN campaigns with compliant affiliate resources.', 'button' => 'Apply as Affiliate'),
    );

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
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    }

    public static function compliance_notice() {
        return 'Contributions are voluntary support payments and are not equity, securities, loans, bonds, investment contracts, or promises of financial return.';
    }

    public function defaults() {
        return array(
            'woo_basic_member_product_id' => '',
            'woo_premium_member_product_id' => '',
            'woo_contributor_product_id' => '',
            'woo_creator_application_product_id' => '',
            'woo_affiliate_application_product_id' => '',
            'campaign_assets_url' => home_url('/marketing-materials'),
            'affiliate_dashboard_url' => home_url('/affiliate-dashboard'),
            'referral_base_url' => home_url('/?ref=onegodian'),
            'default_disclaimer_text' => self::compliance_notice(),
        );
    }

    public function register_shortcodes() {
        $map = array(
            'onegodian_membership_cta' => 'membership_cta_shortcode',
            'onegodian_members_pricing' => 'members_pricing_shortcode',
            'onegodian_membership_resources' => 'membership_resources_shortcode',
            'onegodian_member_certificates' => 'member_certificates_shortcode',
            'onegodian_member_dashboard' => 'member_dashboard_shortcode',
            'onegodian_member_support' => 'member_support_shortcode',
            'onegodian_contributors_page' => 'contributors_page_shortcode',
            'onegodian_contributor_tiers' => 'contributor_tiers_shortcode',
            'onegodian_creator_network' => 'creator_network_shortcode',
            'onegodian_affiliate_dashboard' => 'affiliate_dashboard_shortcode',
            'onegodian_referral_link' => 'referral_link_shortcode',
            'onegodian_contributor_wall' => 'contributor_wall_shortcode',
            'onegodian_contributor_disclaimer' => 'disclaimer_shortcode',
        );
        foreach ($map as $shortcode => $method) {
            add_shortcode($shortcode, array($this, $method));
        }
    }

    public function register_admin_sections() {
        add_menu_page('OneGodian Members', 'OneGodian Members', 'manage_options', 'ogm-members', array($this, 'render_admin_page'), 'dashicons-groups', 58);
    }

    public function register_settings() {
        register_setting('ogm_contributors_affiliates', self::OPTION_KEY, array($this, 'sanitize_settings'));
    }

    public function sanitize_settings($input) {
        $input = (array) $input;
        $output = array();
        foreach ($this->defaults() as $key => $default) {
            if (false !== strpos($key, 'product_id')) {
                $output[$key] = isset($input[$key]) ? absint($input[$key]) : '';
            } elseif (false !== strpos($key, '_url')) {
                $output[$key] = isset($input[$key]) ? esc_url_raw($input[$key]) : $default;
            } else {
                $output[$key] = isset($input[$key]) ? sanitize_textarea_field($input[$key]) : $default;
            }
        }
        return $output;
    }

    public function get_settings() {
        return wp_parse_args((array) get_option(self::OPTION_KEY, array()), $this->defaults());
    }

    public function enqueue_assets() {
        wp_enqueue_style('onegodian-members-modern-ui', OGM_PLUGIN_URL . 'assets/css/onegodian-members-modern-ui.css', array(), OGM_VERSION);
    }

    public function enqueue_admin_assets($hook) {
        if (false !== strpos((string) $hook, 'ogm-members')) {
            $this->enqueue_assets();
        }
    }

    private function product_url($key) {
        $settings = $this->get_settings();
        $product_id = absint($settings[$key] ?? 0);
        if (!$product_id) {
            return '';
        }
        return function_exists('wc_get_cart_url') ? add_query_arg('add-to-cart', $product_id, wc_get_cart_url()) : home_url('/cart/?add-to-cart=' . $product_id);
    }

    private function button_or_notice($key) {
        $product = $this->products[$key];
        $url = $this->product_url($key);
        if (!$url) {
            return '<div class="ogm-product-notice"><span class="ogm-status ogm-status-warning">Product mapping notice</span><strong>' . esc_html__(self::NOT_CONFIGURED, 'onegodian-members') . '</strong></div>';
        }
        return '<a class="ogm-btn" href="' . esc_url($url) . '">' . esc_html($product['button']) . '</a><p class="ogm-map">WooCommerce Product Status: mapped to checkout.</p>';
    }

    private function product_card($key) {
        $product = $this->products[$key];
        return '<article class="ogm-card ogm-product-card"><span class="ogm-status">' . esc_html($product['badge']) . '</span><h3>' . esc_html($product['label']) . '</h3><p>' . esc_html($product['description']) . '</p>' . $this->button_or_notice($key) . '</article>';
    }

    private function section($title, $subtitle, $content, $badge = 'ONEGODIAN') {
        return '<section class="ogm-modern"><div class="ogm-hero"><span class="ogm-status">' . esc_html($badge) . '</span><h2>' . esc_html($title) . '</h2><p>' . esc_html($subtitle) . '</p></div>' . $content . '</section>';
    }

    private function widget($title, $body, $badge = 'Ready') {
        return '<article class="ogm-card"><span class="ogm-status">' . esc_html($badge) . '</span><h3>' . esc_html($title) . '</h3><p>' . esc_html($body) . '</p></article>';
    }

    public function membership_cta_shortcode() {
        return $this->section('Become a OneGodian Member', 'Choose a membership path powered by WooCommerce checkout.', '<div class="ogm-actions">' . $this->button_or_notice('woo_basic_member_product_id') . $this->button_or_notice('woo_premium_member_product_id') . '</div>', 'Membership');
    }

    public function members_pricing_shortcode() {
        return $this->section('Membership Pricing', 'Modern membership cards with checkout-ready product mapping.', '<div class="ogm-grid">' . $this->product_card('woo_basic_member_product_id') . $this->product_card('woo_premium_member_product_id') . $this->product_card('woo_contributor_product_id') . '</div>', 'Pricing');
    }

    public function membership_resources_shortcode() { return $this->section('Membership Resources', 'Quick access widgets for active members.', '<div class="ogm-grid">' . $this->widget('Resource Library', 'Guides, member updates, and education resources.', 'Library') . $this->widget('Community Tools', 'Branded tools for learning and participation.', 'Tools') . '</div>', 'Resources'); }
    public function member_certificates_shortcode() { return $this->section('Member Certificates', 'Certificate status and access information.', '<div class="ogm-grid">' . $this->widget('Certificate Status', 'Active member certificate access appears here.', 'Status') . $this->widget('Verification', 'Use member records to verify eligibility.', 'Secure') . '</div>', 'Certificates'); }
    public function member_dashboard_shortcode() { return $this->section('Member Dashboard', 'Mobile-ready dashboard grid for membership status, resources, and support.', '<div class="ogm-grid">' . $this->widget('Membership Status', 'Review your active membership path.', 'Active') . $this->widget('Resources', 'Open member resources and updates.', 'Member') . $this->widget('Support', 'Get help from the OneGodian support flow.', 'Help') . $this->widget('WooCommerce Product Status', 'Checkout products are mapped from plugin settings.', 'Checkout') . '</div>', 'Dashboard'); }
    public function member_support_shortcode() { return $this->section('Member Support', 'Support widgets for account, resource, and checkout questions.', '<div class="ogm-grid">' . $this->widget('Account Help', 'Request support for membership access.', 'Support') . $this->widget('Checkout Help', 'WooCommerce checkout remains the payment flow.', 'WooCommerce') . '</div>', 'Support'); }
    public function contributors_page_shortcode() { return $this->section('Contributors', 'Voluntary support payments for ONEGODIAN public-facing work.', '<div class="ogm-grid">' . $this->product_card('woo_contributor_product_id') . $this->widget('Contributor Wall', 'Opt-in recognition can be displayed when records are published.', 'Recognition') . $this->widget('Compliance Notice', $this->get_settings()['default_disclaimer_text'], 'Compliance') . '</div>', 'Contributors'); }
    public function contributor_tiers_shortcode() { $tiers = array('Supporter $11', 'Builder $33', 'Sustainer $77', 'Founder Circle $111', 'Infrastructure Partner $333+', 'Custom Contribution'); $html = '<div class="ogm-grid">'; foreach ($tiers as $tier) { $html .= $this->widget($tier, 'Voluntary contributor tier with WooCommerce checkout support.', 'Tier'); } return $this->section('Contributor Tiers', 'Responsive contributor cards for every support level.', $html . '</div>' . $this->product_card('woo_contributor_product_id'), 'Tiers'); }
    public function creator_network_shortcode() { return $this->section('Creator Network', 'Apply, collaborate, and access branded campaign widgets.', '<div class="ogm-grid">' . $this->product_card('woo_creator_application_product_id') . $this->widget('Campaign Assets', 'Creator-ready campaign assets and guidelines.', 'Assets') . $this->widget('Application Status', 'Creator application status can be connected here.', 'Status') . '</div>', 'Creator'); }
    public function affiliate_dashboard_shortcode() { return $this->section('Affiliate Dashboard', 'Affiliate application, referral, campaign, and compliance widgets.', '<div class="ogm-grid">' . $this->product_card('woo_affiliate_application_product_id') . $this->widget('Referral Link', $this->get_settings()['referral_base_url'], 'Referral') . $this->widget('Campaign Assets', 'Open approved copy, graphics, and campaign resources.', 'Assets') . $this->widget('Compliance Notice', $this->get_settings()['default_disclaimer_text'], 'Compliance') . '</div>', 'Affiliate'); }
    public function referral_link_shortcode() { return $this->section('Referral Link', 'Share your approved referral destination when enabled.', '<div class="ogm-referral"><code>' . esc_html($this->get_settings()['referral_base_url']) . '</code><span class="ogm-status">No popups</span></div>', 'Referral'); }
    public function contributor_wall_shortcode() { return $this->section('Contributor Wall', 'Opt-in contributor recognition in a polished card grid.', '<div class="ogm-grid">' . $this->widget('Community Supporters', 'Published supporter names can appear here after approval.', 'Opt-in') . $this->widget('Founder Circle', 'Recognition widgets remain compliant and non-investment based.', 'Compliant') . '</div>', 'Wall'); }
    public function disclaimer_shortcode() { return '<div class="ogm-modern ogm-compliance"><span class="ogm-status ogm-status-warning">Compliance Notice</span><p>' . esc_html($this->get_settings()['default_disclaimer_text']) . '</p></div>'; }

    public function render_admin_page() {
        $settings = $this->get_settings();
        $sections = array('Membership Products', 'Contributor Products', 'Creator Network', 'Affiliate Program', 'Campaign Assets', 'Compliance Notices', 'Shortcode Reference', 'System Status');
        echo '<div class="wrap ogm-admin"><h1>OneGodian Members v' . esc_html(OGM_VERSION) . '</h1><p>Modern black, gold, and purple WooCommerce-powered widgets. Payments route through WooCommerce checkout.</p><form method="post" action="options.php">';
        settings_fields('ogm_contributors_affiliates');
        foreach ($sections as $section) {
            echo '<section class="ogm-modern"><div class="ogm-hero"><span class="ogm-status">Admin</span><h2>' . esc_html($section) . '</h2></div>';
            if ('Shortcode Reference' === $section) {
                echo '<div class="ogm-grid">';
                foreach (array('onegodian_membership_cta','onegodian_members_pricing','onegodian_membership_resources','onegodian_member_certificates','onegodian_member_dashboard','onegodian_member_support','onegodian_contributors_page','onegodian_contributor_tiers','onegodian_creator_network','onegodian_affiliate_dashboard','onegodian_referral_link','onegodian_contributor_wall','onegodian_contributor_disclaimer') as $shortcode) {
                    echo '<code class="ogm-code">[' . esc_html($shortcode) . ']</code>';
                }
                echo '</div>';
            } elseif ('System Status' === $section) {
                echo '<div class="ogm-grid">' . $this->widget('WooCommerce Checkout', class_exists('WooCommerce') ? 'WooCommerce is active.' : 'WooCommerce is not active in this environment.', class_exists('WooCommerce') ? 'Ready' : 'Check') . $this->widget('Browser Popups', 'No frontend checkout browser alert popups are registered by this plugin.', 'Removed') . '</div>';
            } else {
                echo '<table class="form-table" role="presentation"><tbody>';
                foreach ($this->defaults() as $key => $default) {
                    echo '<tr><th scope="row"><label for="' . esc_attr($key) . '">' . esc_html($key) . '</label></th><td>';
                    if ('default_disclaimer_text' === $key) {
                        echo '<textarea class="large-text" rows="4" id="' . esc_attr($key) . '" name="' . esc_attr(self::OPTION_KEY . '[' . $key . ']') . '">' . esc_textarea($settings[$key]) . '</textarea>';
                    } else {
                        echo '<input class="regular-text" type="text" id="' . esc_attr($key) . '" name="' . esc_attr(self::OPTION_KEY . '[' . $key . ']') . '" value="' . esc_attr($settings[$key]) . '" />';
                    }
                    echo '</td></tr>';
                }
                echo '</tbody></table>';
            }
            echo '</section>';
        }
        submit_button('Save OneGodian Members Settings');
        echo '</form></div>';
    }
}
