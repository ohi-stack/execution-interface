<?php
if (! defined('ABSPATH')) {
    exit;
}
class OG_LMS_Helpers
{
    public static function now(): string
    {
        return gmdate('Y-m-d H:i:s');
    }

    public static function public_base_url(): string
    {
        return 'https://u.onegodian.org';
    }

    public static function get_option(string $key, string $default = ''): string
    {
        $value = get_option($key, $default);
        return is_string($value) ? $value : $default;
    }

    public static function verify_hmac(string $payload, string $signature, string $secret): bool
    {
        if ($secret === '' || $signature === '') {
            return false;
        }

        $expected = hash_hmac('sha256', $payload, $secret);
        return hash_equals($expected, $signature);
    }

    public static function uploads_base(string $subdir): array
    {
        $upload_dir = wp_upload_dir();
        $path = trailingslashit($upload_dir['basedir']) . trim($subdir, '/');
        $url = trailingslashit($upload_dir['baseurl']) . trim($subdir, '/');

        if (! is_dir($path)) {
            wp_mkdir_p($path);
        }

        return [$path, $url];
    }

    public static function rate_limit_key(string $prefix, string $identifier): string
    {
        return sanitize_key($prefix . '_' . md5($identifier));
    }

    public static function enforce_rate_limit(string $prefix, string $identifier, int $limit, int $window_seconds): bool
    {
        $key = self::rate_limit_key($prefix, $identifier);
        $state = get_transient($key);

        if (! is_array($state)) {
            $state = ['count' => 0, 'expires_at' => time() + $window_seconds];
        }

        if ((int) $state['expires_at'] <= time()) {
            $state = ['count' => 0, 'expires_at' => time() + $window_seconds];
        }

        $state['count'] = (int) $state['count'] + 1;
        set_transient($key, $state, $window_seconds);

        return $state['count'] <= $limit;
    }


    public static function log_activity(?int $user_id, string $event_type, string $object_type, ?int $object_id, array $context = []): void
    {
        global $wpdb;
        $table = $wpdb->prefix . 'og_activity_log';
        $wpdb->insert(
            $table,
            [
                'user_id' => $user_id,
                'event_type' => sanitize_key($event_type),
                'object_type' => sanitize_key($object_type),
                'object_id' => $object_id,
                'context' => wp_json_encode($context),
                'created_at' => self::now(),
            ],
            ['%d', '%s', '%s', '%d', '%s', '%s']
        );
    }

}
