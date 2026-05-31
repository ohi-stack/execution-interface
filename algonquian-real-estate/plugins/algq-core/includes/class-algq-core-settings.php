<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Core_Settings
{
    private const TABLE = 'algq_settings';

    public function get(string $group, string $key, $default = null)
    {
        global $wpdb;
        $table = $wpdb->prefix . self::TABLE;
        $value = $wpdb->get_var($wpdb->prepare("SELECT setting_value FROM {$table} WHERE setting_group = %s AND setting_key = %s", $group, $key));
        return null === $value ? $default : maybe_unserialize($value);
    }

    public function set(string $group, string $key, $value, string $autoload = 'no'): bool
    {
        global $wpdb;
        $table = $wpdb->prefix . self::TABLE;
        $updated_at = current_time('mysql');
        return false !== $wpdb->replace($table, [
            'setting_group' => $group,
            'setting_key' => $key,
            'setting_value' => maybe_serialize($value),
            'autoload' => 'yes' === $autoload ? 'yes' : 'no',
            'updated_at' => $updated_at,
        ], ['%s', '%s', '%s', '%s', '%s']);
    }
}
