<?php
/**
 * Sanitization helpers for marketplace data.
 *
 * @package AlgqMarketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

class Algq_Marketplace_Sanitizer
{
    public static function text($value): string
    {
        $value = preg_replace('#<script[^>]*>.*?</script>#is', '', (string) $value);

        if (function_exists('sanitize_text_field')) {
            return sanitize_text_field($value);
        }

        return trim(strip_tags($value));
    }

    public static function key($value): string
    {
        if (function_exists('sanitize_key')) {
            return sanitize_key((string) $value);
        }

        return preg_replace('/[^a-z0-9_\-]/', '', strtolower((string) $value));
    }

    public static function url($value): string
    {
        if (function_exists('esc_url_raw')) {
            return esc_url_raw((string) $value);
        }

        $url = filter_var((string) $value, FILTER_SANITIZE_URL);
        return preg_match('#^https?://#i', $url) ? $url : '';
    }

    public static function textarea($value): string
    {
        $value = preg_replace('#<script[^>]*>.*?</script>#is', '', (string) $value);

        if (function_exists('sanitize_textarea_field')) {
            return sanitize_textarea_field($value);
        }

        return trim(strip_tags($value));
    }
}
