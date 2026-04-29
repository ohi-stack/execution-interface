<?php
class Onegodian_Capital_Settings {
    public static function register() {
        $settings = ['company_name','compliance_disclaimer','certificate_signature_name','certificate_signature_title','verification_base_url'];
        foreach ($settings as $setting) {
            register_setting('onegodian_capital', $setting, ['type' => 'string', 'sanitize_callback' => 'sanitize_text_field']);
        }
    }
}
