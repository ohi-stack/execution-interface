<?php

defined('ABSPATH') || exit;

class Onegodian_Capital_Settings {
    public static function register_settings() {
        $text_settings = ['company_name', 'compliance_disclaimer', 'certificate_signature_name', 'certificate_signature_title'];
        $url_settings = ['verification_base_url', 'certificate_workflow_image_url', 'disclosure_workflow_image_url', 'operating_boundary_image_url', 'dashboard_preview_image_url', 'offerings_preview_image_url', 'founder_note_certificate_image_url', 'infrastructure_bond_certificate_image_url', 'platform_growth_note_certificate_image_url', 'capital_hero_image_url'];

        foreach ($text_settings as $setting) {
            register_setting('onegodian_capital', $setting, ['type' => 'string', 'sanitize_callback' => 'sanitize_text_field']);
        }

        foreach ($url_settings as $setting) {
            register_setting('onegodian_capital', $setting, ['type' => 'string', 'sanitize_callback' => 'esc_url_raw']);
        }
    }

    public static function render_settings_page() {
        if (!current_user_can('manage_onegodian_capital')) {
            wp_die(esc_html__('You do not have permission to access this page.', 'onegodian-capital'));
        }

        echo '<div class="wrap ogc-admin-wrap"><h1>Capital Portal Settings</h1>';
        echo '<div class="ogc-admin-warning"><strong>Compliance boundary:</strong> Settings in this portal configure recordkeeping behavior only. Live capital workflows must remain inactive until readiness review is complete.</div>';
        echo '<form method="post" action="options.php">';
        settings_fields('onegodian_capital');
        do_settings_sections('onegodian_capital');
        submit_button('Save Settings');
        echo '</form></div>';
    }
}
