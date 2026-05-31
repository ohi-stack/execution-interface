<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Core_Licensing
{
    private const TABLE = 'algq_licenses';

    public function validate(string $license_key, string $product_slug): array
    {
        global $wpdb;
        $table = $wpdb->prefix . self::TABLE;
        $license = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table} WHERE license_key = %s AND product_slug = %s", $license_key, $product_slug), ARRAY_A);

        if (!$license) {
            return ['valid' => false, 'status' => 'missing'];
        }

        $expired = !empty($license['expires_at']) && strtotime($license['expires_at']) < time();
        return [
            'valid' => 'active' === $license['status'] && !$expired,
            'status' => $expired ? 'expired' : $license['status'],
            'product_slug' => $license['product_slug'],
            'expires_at' => $license['expires_at'],
        ];
    }
}
