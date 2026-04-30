<?php

defined('ABSPATH') || exit;

class Onegodian_Capital_Settings {
    public static function defaults(): array {
        return [
            'company_name' => 'ONEGODIAN, LLC',
            'compliance_disclaimer' => 'The ONEGODIAN Capital Portal is software infrastructure for managing digital records related to private capital instruments. It does not itself create, approve, or validate any securities offering. All notes, bonds, repayment terms, investor eligibility rules, disclosures, exemptions, and offering documents must be reviewed by qualified legal counsel before public use.',
            'certificate_signature_name' => '',
            'certificate_signature_title' => '',
            'verification_base_url' => home_url('/capital/verify/'),
            'certificate_workflow_image_url' => '',
            'disclosure_workflow_image_url' => '',
            'operating_boundary_image_url' => '',
            'dashboard_preview_image_url' => '',
            'offerings_preview_image_url' => '',
            'founder_note_certificate_image_url' => '',
            'infrastructure_bond_certificate_image_url' => '',
            'platform_growth_note_certificate_image_url' => '',
            'capital_hero_image_url' => '',
        ];
    }

    public static function register_settings() {
        $text_settings = ['company_name', 'certificate_signature_name', 'certificate_signature_title'];
        $textarea_settings = ['compliance_disclaimer'];
        $url_settings = ['verification_base_url', 'certificate_workflow_image_url', 'disclosure_workflow_image_url', 'operating_boundary_image_url', 'dashboard_preview_image_url', 'offerings_preview_image_url', 'founder_note_certificate_image_url', 'infrastructure_bond_certificate_image_url', 'platform_growth_note_certificate_image_url', 'capital_hero_image_url'];

        foreach ($text_settings as $setting) {
            register_setting('onegodian_capital', $setting, ['type' => 'string', 'sanitize_callback' => 'sanitize_text_field', 'default' => self::defaults()[$setting]]);
        }

        foreach ($textarea_settings as $setting) {
            register_setting('onegodian_capital', $setting, ['type' => 'string', 'sanitize_callback' => 'sanitize_textarea_field', 'default' => self::defaults()[$setting]]);
        }

        foreach ($url_settings as $setting) {
            register_setting('onegodian_capital', $setting, ['type' => 'string', 'sanitize_callback' => 'esc_url_raw', 'default' => self::defaults()[$setting]]);
        }
    }

    public static function get(string $key): string {
        $defaults = self::defaults();
        return (string) get_option($key, $defaults[$key] ?? '');
    }

    public static function render_settings_page() {
        if (!current_user_can('manage_onegodian_capital')) {
            wp_die(esc_html__('You do not have permission to access this page.', 'onegodian-capital'));
        }

        echo '<div class="wrap ogc-admin-wrap"><h1>Capital Portal Settings</h1>';
        echo '<div class="ogc-admin-warning"><strong>Compliance boundary:</strong> Settings in this portal configure recordkeeping behavior only. Live capital workflows must remain inactive until readiness review is complete.</div>';
        echo '<form class="ogc-settings-form" method="post" action="options.php">';
        settings_fields('onegodian_capital');

        echo '<div class="ogc-settings-grid">';
        self::section_start('Company & Compliance');
        self::input('company_name', 'Company Name');
        self::textarea('compliance_disclaimer', 'Compliance Disclaimer');
        self::input('certificate_signature_name', 'Certificate Signature Name');
        self::input('certificate_signature_title', 'Certificate Signature Title');
        self::input('verification_base_url', 'Verification Base URL', 'url');
        self::section_end();

        self::section_start('Optional Visual URLs');
        self::input('capital_hero_image_url', 'Capital Hero Image URL', 'url');
        self::input('dashboard_preview_image_url', 'Dashboard Preview Image URL', 'url');
        self::input('offerings_preview_image_url', 'Offerings Preview Image URL', 'url');
        self::input('operating_boundary_image_url', 'Operating Boundary Image URL', 'url');
        self::input('certificate_workflow_image_url', 'Certificate Workflow Image URL', 'url');
        self::input('disclosure_workflow_image_url', 'Disclosure Workflow Image URL', 'url');
        self::section_end();

        self::section_start('Optional Certificate Preview URLs');
        self::input('founder_note_certificate_image_url', 'Founder Note Certificate Image URL', 'url');
        self::input('infrastructure_bond_certificate_image_url', 'Infrastructure Bond Certificate Image URL', 'url');
        self::input('platform_growth_note_certificate_image_url', 'Platform Growth Note Certificate Image URL', 'url');
        self::section_end();
        echo '</div>';

        submit_button('Save Capital Portal Settings');
        echo '</form></div>';
    }

    private static function section_start(string $title): void {
        echo '<section class="ogc-settings-section"><h2>' . esc_html($title) . '</h2>';
    }

    private static function section_end(): void {
        echo '</section>';
    }

    private static function input(string $key, string $label, string $type = 'text'): void {
        echo '<label class="ogc-setting-field" for="' . esc_attr($key) . '"><span>' . esc_html($label) . '</span><input type="' . esc_attr($type) . '" id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" value="' . esc_attr(self::get($key)) . '" /></label>';
    }

    private static function textarea(string $key, string $label): void {
        echo '<label class="ogc-setting-field" for="' . esc_attr($key) . '"><span>' . esc_html($label) . '</span><textarea id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" rows="8">' . esc_textarea(self::get($key)) . '</textarea></label>';
    }
}
