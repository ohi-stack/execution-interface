<?php
if (! defined('ABSPATH')) {
    exit;
}
class OG_LMS_Certificate_Generator
{
    public static function issue(int $user_id, int $course_id): array
    {
        $certificate_id = wp_generate_uuid4();
        $verify_url = OG_LMS_Helpers::public_base_url() . '/certificate-verify?certificate_id=' . rawurlencode($certificate_id);

        return [
            'certificate_id' => $certificate_id,
            'verify_url' => $verify_url,
            'pdf_url' => '',
        ];
    }
}
