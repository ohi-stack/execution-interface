<?php

if (!defined('QOHI_BRIDGE_UTILS_LOADED')) {
    define('QOHI_BRIDGE_UTILS_LOADED', true);

    final class QOHI_Bridge_Utils
    {
        public static function normalize_for_hash($value)
        {
            if (is_array($value)) {
                $is_assoc = array_keys($value) !== range(0, count($value) - 1);
                if ($is_assoc) {
                    ksort($value);
                }

                foreach ($value as $key => $item) {
                    $value[$key] = self::normalize_for_hash($item);
                }
            }

            return $value;
        }

        public static function metadata_hash(array $metadata): string
        {
            $normalized = self::normalize_for_hash($metadata);
            return hash('sha256', wp_json_encode($normalized));
        }

        public static function idempotency_issue(int $order_id, string $order_total, string $site_url): string
        {
            return hash('sha256', sprintf('issue:%d:%s:%s', $order_id, $order_total, $site_url));
        }

        public static function idempotency_revoke(int $order_id, string $refund_total, string $site_url): string
        {
            return hash('sha256', sprintf('revoke:%d:%s:%s', $order_id, $refund_total, $site_url));
        }

        public static function signature_payload(int $timestamp, string $raw_json): string
        {
            return $timestamp . '.' . $raw_json;
        }

        public static function hmac_signature(int $timestamp, string $raw_json, string $api_secret): string
        {
            return hash_hmac('sha256', self::signature_payload($timestamp, $raw_json), $api_secret);
        }

        public static function backoff_minutes(int $attempts): int
        {
            $minutes = (int) pow(2, max(0, $attempts));
            return min(60, max(1, $minutes));
        }
    }
}
