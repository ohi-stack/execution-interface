<?php

require_once __DIR__ . '/../includes/class-qohi-bridge-utils.php';

if (!function_exists('wp_json_encode')) {
    function wp_json_encode($value) {
        return json_encode($value, JSON_UNESCAPED_SLASHES);
    }
}

$failures = [];

$assert = static function (bool $condition, string $message) use (&$failures): void {
    if (!$condition) {
        $failures[] = $message;
    }
};

$timestamp = 1700000000;
$payload = '{"workflow":"certificate.issue"}';
$secret = 'bridge_secret';
$expected_sig = hash_hmac('sha256', $timestamp . '.' . $payload, $secret);
$assert(QOHI_Bridge_Utils::hmac_signature($timestamp, $payload, $secret) === $expected_sig, 'HMAC signature mismatch');

$issue_key = QOHI_Bridge_Utils::idempotency_issue(10, '55.00', 'https://example.com');
$assert($issue_key === hash('sha256', 'issue:10:55.00:https://example.com'), 'Issue idempotency key mismatch');

$revoke_key = QOHI_Bridge_Utils::idempotency_revoke(10, '12.00', 'https://example.com');
$assert($revoke_key === hash('sha256', 'revoke:10:12.00:https://example.com'), 'Revoke idempotency key mismatch');

$metadata_a = ['b' => 2, 'a' => ['z' => 1, 'y' => 2]];
$metadata_b = ['a' => ['y' => 2, 'z' => 1], 'b' => 2];
$assert(QOHI_Bridge_Utils::metadata_hash($metadata_a) === QOHI_Bridge_Utils::metadata_hash($metadata_b), 'Metadata hash should be deterministic');

$assert(QOHI_Bridge_Utils::backoff_minutes(0) === 1, 'Backoff attempt 0 should be 1 minute');
$assert(QOHI_Bridge_Utils::backoff_minutes(3) === 8, 'Backoff attempt 3 should be 8 minutes');
$assert(QOHI_Bridge_Utils::backoff_minutes(8) === 60, 'Backoff should cap at 60 minutes');

if (!empty($failures)) {
    foreach ($failures as $failure) {
        fwrite(STDERR, "FAIL: {$failure}\n");
    }
    exit(1);
}

echo "All QOHI bridge utility tests passed.\n";
