<?php
/**
 * Modern OneGodian Members WooCommerce, contributor, creator, affiliate, and INO platform UI.
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

    private $platform_modules = array(
        'public_website' => array('label' => 'Public Website', 'badge' => 'Public', 'description' => 'Information portal for INO identity, membership, governance, programs, housing, economic development, media, documents, contact, subscriptions, support, volunteer interest, membership applications, search, and certificate verification.', 'status' => 'Operational surface'),
        'user_accounts' => array('label' => 'User Accounts', 'badge' => 'Accounts', 'description' => 'Dashboard-ready account profile areas for photo, cover image, biography, preferences, privacy, notifications, timeline, saved applications, uploaded documents, and messages.', 'status' => 'UI framework'),
        'membership_portal' => array('label' => 'Membership Portal', 'badge' => 'Members', 'description' => 'Application, document upload, status tracking, renewal, certificate download, digital ID, profile update, history, and renewal reminders.', 'status' => 'WooCommerce mapped'),
        'identity_heritage' => array('label' => 'Identity & Heritage', 'badge' => 'Heritage', 'description' => 'Ancestral heritage, lineage, family tree, genealogy records, oral histories, photographs, family groups, People’s Book of Names, Tribal & Family Archives, and heritage certificates.', 'status' => 'Records model'),
        'social_community' => array('label' => 'Social Community', 'badge' => 'Community', 'description' => 'BuddyPress-style connections, follows, messaging, feeds, groups, forums, events, comments, likes, mentions, notifications, member directory, and online presence.', 'status' => 'Integration boundary'),
        'programs' => array('label' => 'Programs', 'badge' => 'Programs', 'description' => 'Program browsing, online applications, uploads, status tracking, requirements, notifications, and completion certificates.', 'status' => 'Workflow surface'),
        'volunteers' => array('label' => 'Volunteer Portal', 'badge' => 'Volunteers', 'description' => 'Applications, skills profiles, matching, scheduling, hour tracking, supervisor approval, recognition, and certificates.', 'status' => 'Workflow surface'),
        'housing' => array('label' => 'Housing Portal', 'badge' => 'Housing', 'description' => 'Housing applications, required documents, project browsing, waiting lists, notifications, and appointments.', 'status' => 'Workflow surface'),
        'treasury_grants' => array('label' => 'Treasury & Grants', 'badge' => 'Treasury', 'description' => 'Grant opportunities, proposal tracking, compliance requirements, reporting, performance metrics, deadlines, and grant documents.', 'status' => 'Admin module'),
        'learning_center' => array('label' => 'Learning Center', 'badge' => 'Learning', 'description' => 'Courses, lessons, quizzes, certificates, progress tracking, downloads, live classes, and webinars.', 'status' => 'Education module'),
        'events' => array('label' => 'Events', 'badge' => 'Events', 'description' => 'Registration, RSVP, reminders, check-in, and event history.', 'status' => 'Community module'),
        'document_center' => array('label' => 'Document Center', 'badge' => 'Documents', 'description' => 'Secure uploads, searchable files, download permissions, version history, shared folders, and document requests.', 'status' => 'Secure records'),
        'certificates' => array('label' => 'Certificate System', 'badge' => 'Certificates', 'description' => 'Membership, volunteer, program, identity, and recognition certificates with QR-code verification.', 'status' => 'Verification ready'),
        'communications' => array('label' => 'Communications', 'badge' => 'Comms', 'description' => 'Direct messages, group messages, email notifications, SMS integration, and announcements.', 'status' => 'Notification surface'),
        'marketplace' => array('label' => 'Marketplace', 'badge' => 'Optional', 'description' => 'WooCommerce products, digital resources, services, orders, and purchase history.', 'status' => 'Optional'),
        'media_center' => array('label' => 'Media Center', 'badge' => 'Media', 'description' => 'Photo, video, and audio uploads, albums, comments, and sharing.', 'status' => 'Media module'),
        'maps' => array('label' => 'Interactive Maps', 'badge' => 'Maps', 'description' => 'Communities, housing developments, events, offices, cultural sites, and service areas.', 'status' => 'Map boundary'),
        'mobile' => array('label' => 'Mobile Experience', 'badge' => 'Mobile', 'description' => 'Responsive interface, PWA planning, push notifications, QR scanning, and digital membership card.', 'status' => 'Responsive'),
        'admin_portal' => array('label' => 'Administrative Portal', 'badge' => 'Admin', 'description' => 'Management surfaces for members, heritage, citizenship, programs, volunteers, housing, grants, documents, certificates, events, communications, reports, forms, content, settings, checklist, documentation, and system status.', 'status' => 'Control panel'),
        'security_compliance' => array('label' => 'Security & Compliance', 'badge' => 'Security', 'description' => 'Role permissions, nonce verification, validation, escaping, secure file handling, logs, audit trails, timestamps, backups, recovery, and privacy controls.', 'status' => 'Required standard'),
        'reporting' => array('label' => 'Reporting & Analytics', 'badge' => 'Reports', 'description' => 'Reports for membership, programs, volunteers, housing, treasury, grants, documents, certificates, community engagement, compliance, and website activity.', 'status' => 'Reporting model'),
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
            'ino_platform_overview' => 'platform_overview_shortcode',
            'ino_public_portal' => 'public_portal_shortcode',
            'ino_identity_heritage' => 'identity_heritage_shortcode',
            'ino_programs_portal' => 'programs_portal_shortcode',
            'ino_volunteer_portal' => 'volunteer_portal_shortcode',
            'ino_housing_portal' => 'housing_portal_shortcode',
            'ino_treasury_grants' => 'treasury_grants_shortcode',
            'ino_learning_center' => 'learning_center_shortcode',
            'ino_document_center' => 'document_center_shortcode',
            'ino_communications' => 'communications_shortcode',
            'ino_media_center' => 'media_center_shortcode',
            'ino_interactive_maps' => 'interactive_maps_shortcode',
            'ino_admin_portal' => 'admin_portal_shortcode',
            'ino_security_compliance' => 'security_compliance_shortcode',
            'ino_reporting_analytics' => 'reporting_analytics_shortcode',
            'ino_certificate_verify' => 'certificate_verify_shortcode',
        );
        foreach ($map as $shortcode => $method) {
            add_shortcode($shortcode, array($this, $method));
        }
    }

    public function register_admin_sections() {
        add_menu_page('INO Platform', 'INO Platform', 'manage_options', 'ogm-members', array($this, 'render_admin_page'), 'dashicons-admin-multisite', 58);
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

    private function section($title, $subtitle, $content, $badge = 'INO Platform') {
        return '<section class="ogm-modern"><div class="ogm-hero"><span class="ogm-status">' . esc_html($badge) . '</span><h2>' . esc_html($title) . '</h2><p>' . esc_html($subtitle) . '</p></div>' . $content . '</section>';
    }

    private function widget($title, $body, $badge = 'Ready') {
        return '<article class="ogm-card"><span class="ogm-status">' . esc_html($badge) . '</span><h3>' . esc_html($title) . '</h3><p>' . esc_html($body) . '</p></article>';
    }

    private function module_grid($keys) {
        $html = '<div class="ogm-grid">';
        foreach ($keys as $key) {
            $module = $this->platform_modules[$key];
            $html .= $this->widget($module['label'], $module['description'], $module['badge'] . ' · ' . $module['status']);
        }
        return $html . '</div>';
    }

    private function all_module_keys() {
        return array_keys($this->platform_modules);
    }

    public function platform_overview_shortcode() { return $this->section('INO Platform Operating System', 'Unified public, member, community, records, governance, program, housing, grants, communications, and administrative platform map. Only configured, permission-controlled workflows should be presented as operational in production.', $this->module_grid($this->all_module_keys()), 'Digital OS'); }
    public function public_portal_shortcode() { return $this->section('INO Public Website', 'Public information and conversion paths for visitors.', $this->module_grid(array('public_website','membership_portal','identity_heritage','programs','housing','treasury_grants','events','document_center','certificates')), 'Public'); }
    public function identity_heritage_shortcode() { return $this->section('Identity & Heritage Records', 'Preserve heritage while separating ancestry records, INO membership, and external governmental or tribal recognition.', '<div class="ogm-grid">' . $this->widget('Record Classes', 'Self-declared, family-attested, document-supported, institutionally reviewed, and unverified records.', 'Classification') . $this->widget('Heritage Archive', 'Lineage, family tree, genealogy files, oral histories, photographs, family groups, People’s Book of Names, and Tribal & Family Archives.', 'Archive') . $this->widget('Recognition Boundary', 'Identity declarations do not by themselves imply citizenship, INO membership, or outside governmental or tribal recognition.', 'Boundary') . '</div>', 'Heritage'); }
    public function programs_portal_shortcode() { return $this->section('Programs Portal', 'Browse, apply, upload, track, complete, notify, and certify program participation.', $this->module_grid(array('programs','learning_center','certificates','document_center')), 'Programs'); }
    public function volunteer_portal_shortcode() { return $this->section('Volunteer Portal', 'Applications, skills, matching, scheduling, hours, approvals, recognition, and certificates.', $this->module_grid(array('volunteers','events','certificates','communications')), 'Volunteers'); }
    public function housing_portal_shortcode() { return $this->section('Housing Portal', 'Housing applications, project discovery, document intake, waiting lists, notifications, and appointments.', $this->module_grid(array('housing','document_center','maps','communications')), 'Housing'); }
    public function treasury_grants_shortcode() { return $this->section('Treasury & Grants', 'Grant opportunities, proposal tracking, compliance, reports, performance metrics, deadlines, and grant document controls.', $this->module_grid(array('treasury_grants','document_center','reporting','security_compliance')), 'Grants'); }
    public function learning_center_shortcode() { return $this->section('Learning Center', 'Courses, lessons, quizzes, certificates, progress tracking, downloads, live classes, and webinars.', $this->module_grid(array('learning_center','certificates','communications')), 'Learning'); }
    public function document_center_shortcode() { return $this->section('Document Center', 'Secure upload and controlled download surfaces with search, version history, shared folders, and document requests.', $this->module_grid(array('document_center','security_compliance','reporting')), 'Documents'); }
    public function communications_shortcode() { return $this->section('Communications Center', 'Direct messages, group messaging, email notifications, SMS integration, announcements, mentions, and reminders.', $this->module_grid(array('communications','social_community','events')), 'Comms'); }
    public function media_center_shortcode() { return $this->section('Media Center', 'Photos, videos, audio, albums, comments, and sharing for approved community media.', $this->module_grid(array('media_center','social_community','security_compliance')), 'Media'); }
    public function interactive_maps_shortcode() { return $this->section('Interactive Maps', 'Map communities, housing developments, events, offices, cultural sites, and service areas.', $this->module_grid(array('maps','housing','events','public_website')), 'Maps'); }
    public function admin_portal_shortcode() { return $this->section('Administrative Portal', 'Administrative control panel map for managing institutional platform modules.', $this->module_grid(array('admin_portal','membership_portal','identity_heritage','programs','volunteers','housing','treasury_grants','document_center','certificates','communications','reporting','security_compliance')), 'Admin'); }
    public function security_compliance_shortcode() { return $this->section('Security & Compliance', 'Required implementation standard for every operational feature.', $this->module_grid(array('security_compliance','document_center','reporting')), 'Security'); }
    public function reporting_analytics_shortcode() { return $this->section('Reporting & Analytics', 'Reports across membership, programs, volunteers, housing, treasury, grants, documents, certificates, community engagement, compliance, and website activity.', $this->module_grid(array('reporting','membership_portal','programs','volunteers','housing','treasury_grants','certificates')), 'Reports'); }
    public function certificate_verify_shortcode() { return $this->section('Certificate Verification', 'QR-code verification destination for membership, volunteer, program, identity, and recognition certificates.', '<div class="ogm-referral"><code>' . esc_html(home_url('/verify-certificate')) . '</code><span class="ogm-status">Verification Boundary</span></div>', 'Verify'); }

    public function membership_cta_shortcode() { return $this->section('Apply for INO Membership', 'Choose a membership path powered by WooCommerce checkout and connected to the broader INO Platform operating system.', '<div class="ogm-actions">' . $this->button_or_notice('woo_basic_member_product_id') . $this->button_or_notice('woo_premium_member_product_id') . '</div>', 'Membership'); }
    public function members_pricing_shortcode() { return $this->section('Membership Pricing', 'Modern membership cards with checkout-ready product mapping.', '<div class="ogm-grid">' . $this->product_card('woo_basic_member_product_id') . $this->product_card('woo_premium_member_product_id') . $this->product_card('woo_contributor_product_id') . '</div>', 'Pricing'); }
    public function membership_resources_shortcode() { return $this->section('Membership Resources', 'Quick access widgets for active members.', '<div class="ogm-grid">' . $this->widget('Resource Library', 'Guides, member updates, public documents, governance references, and education resources.', 'Library') . $this->widget('Community Tools', 'Branded tools for learning, participation, volunteering, programs, housing, and communications.', 'Tools') . '</div>', 'Resources'); }
    public function member_certificates_shortcode() { return $this->section('Member Certificates', 'Certificate status, digital ID, downloads, and QR-code verification information.', '<div class="ogm-grid">' . $this->widget('Certificate Status', 'Active member certificate access appears here when connected to approved records.', 'Status') . $this->widget('QR Verification', 'Membership, volunteer, program, identity, and recognition awards resolve to verification records.', 'Secure') . '</div>', 'Certificates'); }
    public function member_dashboard_shortcode() { return $this->section('Member Dashboard', 'Mobile-ready dashboard grid for membership status, identity declarations, family relationships, certificates, applications, volunteer hours, housing, programs, documents, notifications, activity, and announcements.', $this->module_grid(array('membership_portal','identity_heritage','programs','volunteers','housing','document_center','certificates','communications','social_community')), 'Dashboard'); }
    public function member_support_shortcode() { return $this->section('Member Support', 'Support widgets for account, membership, documents, programs, housing, checkout, and platform questions.', '<div class="ogm-grid">' . $this->widget('Account Help', 'Request support for membership access, profile data, privacy controls, or notifications.', 'Support') . $this->widget('Checkout Help', 'WooCommerce checkout remains the payment flow.', 'WooCommerce') . $this->widget('Records Help', 'Request assistance with documents, certificates, identity declarations, programs, housing, or volunteer records.', 'Records') . '</div>', 'Support'); }
    public function contributors_page_shortcode() { return $this->section('Support the Mission', 'Voluntary support payments for INO public-facing work and platform infrastructure.', '<div class="ogm-grid">' . $this->product_card('woo_contributor_product_id') . $this->widget('Contributor Wall', 'Opt-in recognition can be displayed when records are published.', 'Recognition') . $this->widget('Compliance Notice', $this->get_settings()['default_disclaimer_text'], 'Compliance') . '</div>', 'Contributors'); }
    public function contributor_tiers_shortcode() { $tiers = array('Supporter $11', 'Builder $33', 'Sustainer $77', 'Founder Circle $111', 'Infrastructure Partner $333+', 'Custom Contribution'); $html = '<div class="ogm-grid">'; foreach ($tiers as $tier) { $html .= $this->widget($tier, 'Voluntary contributor tier with WooCommerce checkout support.', 'Tier'); } return $this->section('Contributor Tiers', 'Responsive contributor cards for every support level.', $html . '</div>' . $this->product_card('woo_contributor_product_id'), 'Tiers'); }
    public function creator_network_shortcode() { return $this->section('Creator Network', 'Apply, collaborate, and access branded campaign widgets.', '<div class="ogm-grid">' . $this->product_card('woo_creator_application_product_id') . $this->widget('Campaign Assets', 'Creator-ready campaign assets and guidelines.', 'Assets') . $this->widget('Application Status', 'Creator application status can be connected here.', 'Status') . '</div>', 'Creator'); }
    public function affiliate_dashboard_shortcode() { return $this->section('Affiliate Dashboard', 'Affiliate application, referral, campaign, and compliance widgets.', '<div class="ogm-grid">' . $this->product_card('woo_affiliate_application_product_id') . $this->widget('Referral Link', $this->get_settings()['referral_base_url'], 'Referral') . $this->widget('Campaign Assets', 'Open approved copy, graphics, and campaign resources.', 'Assets') . $this->widget('Compliance Notice', $this->get_settings()['default_disclaimer_text'], 'Compliance') . '</div>', 'Affiliate'); }
    public function referral_link_shortcode() { return $this->section('Referral Link', 'Share your approved referral destination when enabled.', '<div class="ogm-referral"><code>' . esc_html($this->get_settings()['referral_base_url']) . '</code><span class="ogm-status">No popups</span></div>', 'Referral'); }
    public function contributor_wall_shortcode() { return $this->section('Contributor Wall', 'Opt-in contributor recognition in a polished card grid.', '<div class="ogm-grid">' . $this->widget('Community Supporters', 'Published supporter names can appear here after approval.', 'Opt-in') . $this->widget('Founder Circle', 'Recognition widgets remain compliant and non-investment based.', 'Compliant') . '</div>', 'Wall'); }
    public function disclaimer_shortcode() { return '<div class="ogm-modern ogm-compliance"><span class="ogm-status ogm-status-warning">Compliance Notice</span><p>' . esc_html($this->get_settings()['default_disclaimer_text']) . '</p></div>'; }

    public function render_admin_page() {
        $settings = $this->get_settings();
        $sections = array('Platform Operating System', 'Membership Products', 'Contributor Products', 'Creator Network', 'Affiliate Program', 'Campaign Assets', 'Compliance Notices', 'Shortcode Reference', 'Production Checklist', 'System Status');
        echo '<div class="wrap ogm-admin"><h1>INO Platform v' . esc_html(OGM_VERSION) . '</h1><p>Digital operating system for public information, secure member experience, identity and heritage preservation, community engagement, programs, volunteers, housing, grants, governance, documents, certificates, treasury support, reporting, and integrations. Payments are handled through WooCommerce checkout. Payments route through WooCommerce checkout.</p><form method="post" action="options.php">';
        settings_fields('ogm_contributors_affiliates');
        foreach ($sections as $section) {
            echo '<section class="ogm-modern"><div class="ogm-hero"><span class="ogm-status">Admin</span><h2>' . esc_html($section) . '</h2></div>';
            if ('Platform Operating System' === $section) {
                echo $this->module_grid($this->all_module_keys());
            } elseif ('Shortcode Reference' === $section) {
                echo '<div class="ogm-grid">';
                foreach (array('onegodian_membership_cta','onegodian_members_pricing','onegodian_membership_resources','onegodian_member_certificates','onegodian_member_dashboard','onegodian_member_support','onegodian_contributors_page','onegodian_contributor_tiers','onegodian_creator_network','onegodian_affiliate_dashboard','onegodian_referral_link','onegodian_contributor_wall','onegodian_contributor_disclaimer','ino_platform_overview','ino_public_portal','ino_identity_heritage','ino_programs_portal','ino_volunteer_portal','ino_housing_portal','ino_treasury_grants','ino_learning_center','ino_document_center','ino_communications','ino_media_center','ino_interactive_maps','ino_admin_portal','ino_security_compliance','ino_reporting_analytics','ino_certificate_verify') as $shortcode) {
                    echo '<code class="ogm-code">[' . esc_html($shortcode) . ']</code>';
                }
                echo '</div>';
            } elseif ('Production Checklist' === $section) {
                echo '<div class="ogm-grid">' . $this->widget('Operational Standard', 'Present a module as operational only after it is fully implemented, documented, tested, permission-controlled, and repeatable.', 'Required') . $this->widget('Security Controls', 'Validate input, escape output, verify nonces, enforce roles, protect files, timestamp records, and retain audit trails.', 'Security') . $this->widget('Integration Boundaries', 'Connect WordPress, WooCommerce, BuddyPress or BuddyBoss, Google Workspace, Maps, email, SMS, PDFs, REST APIs, and calendars through explicit settings and service adapters.', 'Integrations') . '</div>';
            } elseif ('System Status' === $section) {
                echo '<div class="ogm-grid">' . $this->widget('WooCommerce Checkout', class_exists('WooCommerce') ? 'WooCommerce is active.' : 'WooCommerce is not active in this environment.', class_exists('WooCommerce') ? 'Ready' : 'Check') . $this->widget('Browser Popups', 'No frontend checkout browser alert popups are registered by this plugin.', 'Removed') . $this->widget('Platform Scope', 'INO Platform modules are mapped in one administrative control panel with explicit production-readiness boundaries.', 'Unified') . '</div>';
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
        submit_button('Save INO Platform Settings');
        echo '</form></div>';
    }
}
