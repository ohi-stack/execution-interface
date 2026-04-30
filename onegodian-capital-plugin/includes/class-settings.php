<?php
class Onegodian_Capital_Settings {
    public static function register() {
        $text_settings = ['company_name','compliance_disclaimer','certificate_signature_name','certificate_signature_title'];
        $url_settings = ['verification_base_url','certificate_workflow_image_url','disclosure_workflow_image_url','operating_boundary_image_url','dashboard_preview_image_url','offerings_preview_image_url','founder_note_certificate_image_url','infrastructure_bond_certificate_image_url','platform_growth_note_certificate_image_url','capital_hero_image_url'];

        foreach ($text_settings as $setting) {
            register_setting('onegodian_capital', $setting, ['type' => 'string', 'sanitize_callback' => 'sanitize_text_field']);
        }

        foreach ($url_settings as $setting) {
            register_setting('onegodian_capital', $setting, ['type' => 'string', 'sanitize_callback' => 'esc_url_raw']);
        }
    }
}
