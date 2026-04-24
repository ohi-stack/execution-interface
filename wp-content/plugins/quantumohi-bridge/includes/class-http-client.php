<?php

if (!defined('ABSPATH')) {
    exit;
}

class QOHI_Bridge_Http_Client
{
    public function post_execute(array $payload): array
    {
        $settings = QOHI_Bridge_Admin_Settings::get_settings();
        $request_id = wp_generate_uuid4();

        if (empty($settings['gateway_url']) || empty($settings['api_key'])) {
            $this->log('Bridge settings are incomplete.', ['requestId' => $request_id]);

            return [
                'ok' => false,
                'error' => 'Bridge settings are incomplete.',
                'requestId' => $request_id,
            ];
        }

        $url = $settings['gateway_url'] . '/v1/ohi/execute';
        $body = wp_json_encode($payload);

        $response = wp_remote_post($url, [
            'timeout' => 15,
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $settings['api_key'],
                'X-Request-Id' => $request_id,
                'X-Environment' => $settings['environment'],
            ],
            'body' => $body,
        ]);

        if (is_wp_error($response)) {
            $this->log('Execution gateway request failed.', [
                'requestId' => $request_id,
                'error' => $response->get_error_message(),
            ]);

            return [
                'ok' => false,
                'error' => $response->get_error_message(),
                'requestId' => $request_id,
            ];
        }

        $status_code = wp_remote_retrieve_response_code($response);
        $response_body = (string) wp_remote_retrieve_body($response);
        $decoded = json_decode($response_body, true);

        $this->log('Execution gateway exchange complete.', [
            'requestId' => $request_id,
            'statusCode' => $status_code,
            'requestPayload' => $payload,
            'responsePayload' => $decoded ?: $response_body,
        ]);

        return [
            'ok' => $status_code >= 200 && $status_code < 300,
            'statusCode' => $status_code,
            'data' => is_array($decoded) ? $decoded : [],
            'requestId' => $request_id,
        ];
    }

    private function log(string $message, array $context = []): void
    {
        if (function_exists('wc_get_logger')) {
            $logger = wc_get_logger();
            $logger->info($message . ' ' . wp_json_encode($context), ['source' => 'quantumohi-bridge']);

            return;
        }

        error_log('[quantumohi-bridge] ' . $message . ' ' . wp_json_encode($context));
    }
}
