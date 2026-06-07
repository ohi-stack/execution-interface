<?php
/**
 * Contributor, creator network, affiliate, referral, and campaign asset shortcodes.
 *
 * @package Onegodian_Members
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Onegodian_Members_Contributors_Affiliates
{
    private const CONTRIBUTOR_DISCLAIMER = 'Contributions are voluntary support payments for ONEGODIAN, LLC public-facing products, education, media, technology, membership, and community infrastructure. Contributions are not equity, securities, loans, bonds, investment contracts, or promises of financial return.';

    /** @var callable */
    private $settings_callback;

    /** @param callable $settings_callback Returns the plugin settings array. */
    public function __construct(callable $settings_callback)
    {
        $this->settings_callback = $settings_callback;
    }

    public function register(): void
    {
        add_shortcode('onegodian_contributors_page', array($this, 'render_contributors_page'));
        add_shortcode('onegodian_contributor_tiers', array($this, 'render_contributor_tiers'));
        add_shortcode('onegodian_creator_network', array($this, 'render_creator_network'));
        add_shortcode('onegodian_affiliate_dashboard', array($this, 'render_affiliate_dashboard'));
        add_shortcode('onegodian_referral_link', array($this, 'render_referral_link'));
        add_shortcode('onegodian_contributor_wall', array($this, 'render_contributor_wall'));
        add_shortcode('onegodian_contributor_disclaimer', array($this, 'render_contributor_disclaimer'));
    }

    /** @param array<string, string>|string $atts */
    public function render_contributors_page($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Support ONEGODIAN infrastructure', 'onegodian-members'),
            'description' => __('Contributors help sustain public-facing products, education, media, technology, membership, and community infrastructure. Payment processing is intentionally not included in this module yet.', 'onegodian-members'),
        ), $atts, 'onegodian_contributors_page');

        return $this->section('ogm-contributors-page', sprintf(
            '<header class="ogm-shortcode__header"><p class="ogm-kicker">%s</p><h2>%s</h2><p>%s</p></header>%s%s%s%s',
            esc_html__('Contributors', 'onegodian-members'),
            esc_html($atts['title']),
            wp_kses_post($atts['description']),
            $this->render_contributor_tiers(array('title' => __('Contributor tiers', 'onegodian-members'))),
            $this->render_creator_network(array('title' => __('Creator Network', 'onegodian-members'))),
            $this->campaign_assets_section(),
            $this->render_contributor_disclaimer(array())
        ));
    }

    /** @param array<string, string>|string $atts */
    public function render_contributor_tiers($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Contributor tiers', 'onegodian-members'),
            'description' => __('Choose a voluntary support level when contribution processing is connected. No payment processing is included here.', 'onegodian-members'),
        ), $atts, 'onegodian_contributor_tiers');

        $cards = '';
        foreach ($this->contributor_tiers() as $tier) {
            $cards .= sprintf(
                '<article class="ogm-pricing-card ogm-contributor-tier"><h3>%s</h3><strong>%s</strong><p>%s</p></article>',
                esc_html($tier['name']),
                esc_html($tier['amount']),
                esc_html($tier['description'])
            );
        }

        return $this->section('ogm-contributor-tiers', sprintf(
            '<header class="ogm-shortcode__header"><h2>%s</h2><p>%s</p></header><div class="ogm-pricing-grid">%s</div>',
            esc_html($atts['title']),
            wp_kses_post($atts['description']),
            $cards
        ));
    }

    /** @param array<string, string>|string $atts */
    public function render_creator_network($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Creator Network', 'onegodian-members'),
            'description' => __('A frontend home for creators, educators, media partners, and community builders who want to collaborate with ONEGODIAN public-facing products and campaigns.', 'onegodian-members'),
        ), $atts, 'onegodian_creator_network');

        $items = array(
            __('Creator onboarding placeholder', 'onegodian-members'),
            __('Campaign collaboration placeholder', 'onegodian-members'),
            __('Affiliate and referral education placeholder', 'onegodian-members'),
        );

        return $this->section('ogm-creator-network', sprintf(
            '<header class="ogm-shortcode__header"><p class="ogm-kicker">%s</p><h2>%s</h2><p>%s</p></header>%s%s',
            esc_html__('Creator program', 'onegodian-members'),
            esc_html($atts['title']),
            wp_kses_post($atts['description']),
            $this->list_items($items),
            $this->campaign_assets_section()
        ));
    }

    /** @param array<string, string>|string $atts */
    public function render_affiliate_dashboard($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Affiliate Dashboard', 'onegodian-members'),
            'logged_out_message' => __('Log in to view your affiliate dashboard placeholder and referral tools.', 'onegodian-members'),
            'login_url' => wp_login_url($this->current_url()),
        ), $atts, 'onegodian_affiliate_dashboard');

        if (!is_user_logged_in()) {
            return $this->logged_out_card($atts['title'], $atts['logged_out_message'], $atts['login_url']);
        }

        $user = wp_get_current_user();

        return $this->section('ogm-affiliate-dashboard', sprintf(
            '<h2>%s</h2><p>%s</p><dl class="ogm-definition-list"><div><dt>%s</dt><dd>%s</dd></div><div><dt>%s</dt><dd>%s</dd></div><div><dt>%s</dt><dd>%s</dd></div></dl>%s',
            esc_html($atts['title']),
            esc_html__('Affiliate reporting, referral attribution, and campaign metrics will appear here after the program is connected. No commission or payment processing logic is active in this placeholder.', 'onegodian-members'),
            esc_html__('Account', 'onegodian-members'),
            esc_html($user->display_name ?: $user->user_login),
            esc_html__('Affiliate status', 'onegodian-members'),
            esc_html__('Pending program setup', 'onegodian-members'),
            esc_html__('Referral link', 'onegodian-members'),
            wp_kses_post($this->referral_link_markup()),
            $this->campaign_assets_section()
        ));
    }

    /** @param array<string, string>|string $atts */
    public function render_referral_link($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Your referral link', 'onegodian-members'),
            'logged_out_message' => __('Log in to generate your referral link.', 'onegodian-members'),
            'login_url' => wp_login_url($this->current_url()),
        ), $atts, 'onegodian_referral_link');

        if (!is_user_logged_in()) {
            return $this->logged_out_card($atts['title'], $atts['logged_out_message'], $atts['login_url']);
        }

        return $this->section('ogm-referral-link', sprintf(
            '<h2>%s</h2><p>%s</p>%s',
            esc_html($atts['title']),
            esc_html__('Share this placeholder referral URL while attribution workflows are prepared.', 'onegodian-members'),
            $this->referral_link_markup()
        ));
    }

    /** @param array<string, string>|string $atts */
    public function render_contributor_wall($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Contributor Wall', 'onegodian-members'),
            'description' => __('Public contributor recognition will appear here after approvals, privacy preferences, and publishing workflows are connected.', 'onegodian-members'),
        ), $atts, 'onegodian_contributor_wall');

        return $this->section('ogm-contributor-wall', sprintf(
            '<h2>%s</h2><p>%s</p><div class="ogm-placeholder-card"><strong>%s</strong><p>%s</p></div>',
            esc_html($atts['title']),
            wp_kses_post($atts['description']),
            esc_html__('Contributor wall placeholder', 'onegodian-members'),
            esc_html__('No contributor names are published by this module yet.', 'onegodian-members')
        ));
    }

    /** @param array<string, string>|string $atts */
    public function render_contributor_disclaimer($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Compliance notice', 'onegodian-members'),
        ), $atts, 'onegodian_contributor_disclaimer');

        return $this->section('ogm-contributor-disclaimer', sprintf(
            '<h2>%s</h2><p>%s</p>',
            esc_html($atts['title']),
            esc_html(self::CONTRIBUTOR_DISCLAIMER)
        ));
    }

    /** @return array<int, array{name:string, amount:string, description:string}> */
    private function contributor_tiers(): array
    {
        return array(
            array('name' => __('Supporter', 'onegodian-members'), 'amount' => __('$11', 'onegodian-members'), 'description' => __('Entry-level voluntary support for public education, media, technology, membership, and community infrastructure.', 'onegodian-members')),
            array('name' => __('Builder', 'onegodian-members'), 'amount' => __('$33', 'onegodian-members'), 'description' => __('Voluntary support for continued product, content, and community-building work.', 'onegodian-members')),
            array('name' => __('Sustainer', 'onegodian-members'), 'amount' => __('$77', 'onegodian-members'), 'description' => __('Voluntary recurring-style support positioning without activating payment collection here.', 'onegodian-members')),
            array('name' => __('Founder Circle', 'onegodian-members'), 'amount' => __('$111', 'onegodian-members'), 'description' => __('Voluntary supporter recognition level for early infrastructure backers.', 'onegodian-members')),
            array('name' => __('Infrastructure Partner', 'onegodian-members'), 'amount' => __('$333+', 'onegodian-members'), 'description' => __('Voluntary support tier for larger public-facing infrastructure contributions.', 'onegodian-members')),
            array('name' => __('Custom Contribution', 'onegodian-members'), 'amount' => __('Custom', 'onegodian-members'), 'description' => __('A flexible voluntary contribution amount to be handled by future approved workflows.', 'onegodian-members')),
        );
    }

    private function campaign_assets_section(): string
    {
        return '<div class="ogm-campaign-assets"><h3>' . esc_html__('Campaign Assets', 'onegodian-members') . '</h3><p>' . esc_html__('Campaign graphics, copy blocks, creator briefs, affiliate links, and share assets will appear here after review workflows are connected.', 'onegodian-members') . '</p></div>';
    }

    /** @param array<int, string> $items */
    private function list_items(array $items): string
    {
        $markup = '<ul class="ogm-resource-list">';
        foreach ($items as $item) {
            $markup .= '<li class="ogm-resource-card"><p>' . esc_html($item) . '</p></li>';
        }
        return $markup . '</ul>';
    }

    private function referral_link_markup(): string
    {
        if (!is_user_logged_in()) {
            return '';
        }

        $user_id = get_current_user_id();
        $user = wp_get_current_user();
        $referral_code = $user->user_login ? $user->user_login : (string) $user_id;
        $referral_url = add_query_arg('ogm_ref', $referral_code, home_url('/'));

        return sprintf(
            '<code class="ogm-referral-url">%s</code><p><a class="ogm-button ogm-button-secondary" href="%s">%s</a></p>',
            esc_html($referral_url),
            esc_url($referral_url),
            esc_html__('Open referral link', 'onegodian-members')
        );
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

    private function current_url(): string
    {
        global $wp;

        if (isset($wp) && isset($wp->request)) {
            return home_url('/' . ltrim((string) $wp->request, '/'));
        }

        return home_url('/');
    }
}
