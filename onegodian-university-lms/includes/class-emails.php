<?php

if (! defined('ABSPATH')) {
    exit;
}

class OG_LMS_Emails
{
    public static function bootstrap(): void
    {
        add_filter('wp_mail_content_type', [self::class, 'mail_content_type']);
    }

    public static function mail_content_type(): string
    {
        return 'text/html';
    }

    public static function send_onboarding_once(int $user_id, string $tier): bool
    {
        $user = get_user_by('id', $user_id);
        if (! $user || ! is_email($user->user_email)) {
            return false;
        }

        $sent_key = 'og_lms_onboarding_sent';
        if ((string) get_user_meta($user_id, $sent_key, true) === '1') {
            return false;
        }

        $subject = 'Welcome to Onegodian University';
        $dashboard_url = esc_url(OG_LMS_Helpers::public_base_url() . '/dashboard');
        $courses_url = esc_url(OG_LMS_Helpers::public_base_url() . '/courses');

        $message = sprintf(
            '<p>Welcome %s, your <strong>%s</strong> membership is active.</p><p>Start here:</p><ul><li><a href="%s">Member Dashboard</a></li><li><a href="%s">Course Catalog</a></li></ul>',
            esc_html($user->display_name ?: $user->user_login),
            esc_html(ucfirst($tier)),
            $dashboard_url,
            $courses_url
        );

        $sent = wp_mail($user->user_email, $subject, $message);
        if ($sent) {
            update_user_meta($user_id, $sent_key, '1');
        }

        return (bool) $sent;
    }
}
