<?php
if (! defined('ABSPATH')) {
    exit;
}
class OG_LMS_Certificate_Generator
{
    public static function issue(int $user_id, int $course_id): array
    {
        global $wpdb;
        $table = $wpdb->prefix . 'og_certificates';

        $existing = $wpdb->get_row($wpdb->prepare(
            "SELECT certificate_uid, pdf_url FROM {$table} WHERE user_id = %d AND course_id = %d LIMIT 1",
            $user_id,
            $course_id
        ), ARRAY_A);

        if (is_array($existing) && isset($existing['certificate_uid'])) {
            return [
                'certificate_id' => (string) $existing['certificate_uid'],
                'verify_url' => OG_LMS_Helpers::public_base_url() . '/certificate-verify?certificate_id=' . rawurlencode((string) $existing['certificate_uid']),
                'pdf_url' => (string) ($existing['pdf_url'] ?? ''),
            ];
        }

        $certificate_id = wp_generate_uuid4();
        $pdf_url = self::generate_pdf($certificate_id, $user_id, $course_id);
        $verification_hash = hash('sha256', $certificate_id . '|' . $user_id . '|' . $course_id);

        $wpdb->insert(
            $table,
            [
                'certificate_uid' => $certificate_id,
                'user_id' => $user_id,
                'course_id' => $course_id,
                'issued_at' => OG_LMS_Helpers::now(),
                'pdf_url' => $pdf_url,
                'verification_hash' => $verification_hash,
                'created_at' => OG_LMS_Helpers::now(),
                'updated_at' => OG_LMS_Helpers::now(),
            ],
            ['%s', '%d', '%d', '%s', '%s', '%s', '%s', '%s']
        );

        OG_LMS_Helpers::log_activity($user_id, 'certificate_issued', 'course', $course_id, ['certificate_id' => $certificate_id]);

        return [
            'certificate_id' => $certificate_id,
            'verify_url' => OG_LMS_Helpers::public_base_url() . '/certificate-verify?certificate_id=' . rawurlencode($certificate_id),
            'pdf_url' => $pdf_url,
        ];
    }

    public static function rest_issue(WP_REST_Request $request): WP_REST_Response
    {
        $user_id = get_current_user_id();
        $course_id = (int) $request->get_param('course_id');

        if (! $course_id || ! OG_LMS_Enrollment_Service::is_enrolled($user_id, $course_id)) {
            return new WP_REST_Response(['message' => 'Enrollment required'], 403);
        }

        $progress = OG_LMS_Progress_Service::get_course_progress($user_id, $course_id);
        if ($progress < 100) {
            return new WP_REST_Response(['message' => 'Course completion required', 'progress' => $progress], 422);
        }

        return new WP_REST_Response(self::issue($user_id, $course_id), 201);
    }

    private static function generate_pdf(string $certificate_id, int $user_id, int $course_id): string
    {
        [$base_path, $base_url] = OG_LMS_Helpers::uploads_base('og-lms-certificates');
        $filename = 'certificate-' . sanitize_file_name($certificate_id) . '.pdf';
        $file_path = trailingslashit($base_path) . $filename;

        $content_lines = [
            '%PDF-1.4',
            '1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj',
            '2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj',
            '3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>> endobj',
            '4 0 obj <</Length 160>> stream',
            'BT /F1 18 Tf 50 740 Td (Onegodian University Certificate) Tj ET',
            'BT /F1 12 Tf 50 710 Td (Certificate ID: ' . $certificate_id . ') Tj ET',
            'BT /F1 12 Tf 50 690 Td (User ID: ' . $user_id . '  Course ID: ' . $course_id . ') Tj ET',
            'BT /F1 12 Tf 50 670 Td (Issued UTC: ' . gmdate('Y-m-d H:i:s') . ') Tj ET',
            'endstream endobj',
            '5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj',
            'xref',
            '0 6',
            '0000000000 65535 f ',
            '0000000010 00000 n ',
            '0000000062 00000 n ',
            '0000000117 00000 n ',
            '0000000243 00000 n ',
            '0000000470 00000 n ',
            'trailer <</Size 6 /Root 1 0 R>>',
            'startxref',
            '540',
            '%%EOF',
        ];

        file_put_contents($file_path, implode("\n", $content_lines));

        return trailingslashit($base_url) . $filename;
    }
}
