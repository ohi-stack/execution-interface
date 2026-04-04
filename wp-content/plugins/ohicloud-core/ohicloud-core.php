<?php
/**
 * Plugin Name: OHICloud Core
 * Description: Core menu registration, VC snippets, and Quantum OHI Bridge transport for OHICloud v1.1.
 * Version: 1.2.0
 * Author: OHICloud
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/includes/class-qohi-bridge-utils.php';

const OHICLOUD_VC_HERO_TEMPLATE = <<<'VC'
[vc_row full_width="stretch_row_content" parallax="content-moving" parallax_image="1466"]
[vc_column css=".vc_custom_ohicloud_home_hero{background:linear-gradient(180deg, rgba(7,28,42,0.90) 0%, rgba(7,28,42,0.72) 55%, rgba(7,28,42,0.92) 100%) !important;}"]
  [vc_empty_space height="40px"]
  [vc_column_text]
    BADGE (page-specific)
    H1 (page-specific)
    SUBHEAD (page-specific)
  [/vc_column_text]
  [vc_empty_space height="36px"]
  [vc_row_inner]
    [vc_column_inner width="1/2"] PRIMARY CTA [/vc_column_inner]
    [vc_column_inner width="1/2"] SECONDARY CTA [/vc_column_inner]
  [/vc_row_inner]
  [vc_empty_space height="70px"]
[/vc_column]
[/vc_row]
VC;

const QOHI_BRIDGE_OPTION = 'qohi_bridge_settings';
const QOHI_CIRCUIT_KEY = 'qohi_bridge_circuit_open_until';
const QOHI_FAILURE_COUNT_KEY = 'qohi_bridge_consecutive_failures';
const QOHI_LAST_SUCCESS_KEY = 'qohi_bridge_last_success_utc';
const QOHI_LAST_FAILURE_KEY = 'qohi_bridge_last_failure_utc';
const QOHI_RETRY_HOOK = 'qohi_bridge_retry_worker';

function ohicloud_core_register_settings(): void
{
    register_setting('reading', 'ohicloud_vc_snippets');
}
add_action('admin_init', 'ohicloud_core_register_settings');

function ohicloud_core_get_snippet(string $name): string
{
    $defaults = ['canonical_hero' => OHICLOUD_VC_HERO_TEMPLATE];
    $stored = get_option('ohicloud_vc_snippets', []);

    if (!is_array($stored)) {
        $stored = [];
    }

    return (string) ($stored[$name] ?? $defaults[$name] ?? '');
}

function ohicloud_vc_snippet_shortcode($atts): string
{
    $atts = shortcode_atts(['name' => 'canonical_hero'], $atts, 'ohicloud_vc_snippet');
    return '<pre>' . esc_html(ohicloud_core_get_snippet((string) $atts['name'])) . '</pre>';
}
add_shortcode('ohicloud_vc_snippet', 'ohicloud_vc_snippet_shortcode');

function ohicloud_register_menu_seeders(): void
{
    add_management_page(__('OHICloud Menus', 'ohicloud-core'), __('OHICloud Menus', 'ohicloud-core'), 'manage_options', 'ohicloud-menu-seed', 'ohicloud_render_menu_seed_page');
}
add_action('admin_menu', 'ohicloud_register_menu_seeders');

function ohicloud_render_menu_seed_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }

    if (isset($_POST['ohicloud_seed_menus']) && check_admin_referer('ohicloud_seed_menus')) {
        ohicloud_seed_navigation();
        echo '<div class="updated"><p>Menus created and assigned.</p></div>';
    }

    echo '<div class="wrap"><h1>OHICloud Menu Seeder</h1><form method="post">';
    wp_nonce_field('ohicloud_seed_menus');
    submit_button('Create/Refresh Mega + Footer Menus', 'primary', 'ohicloud_seed_menus');
    echo '</form></div>';
}

function ohicloud_upsert_menu(string $name): int
{
    $menu = wp_get_nav_menu_object($name);
    return $menu ? (int) $menu->term_id : (int) wp_create_nav_menu($name);
}

function ohicloud_add_menu_item(int $menu_id, string $title, string $path, int $parent = 0): int
{
    return (int) wp_update_nav_menu_item($menu_id, 0, [
        'menu-item-title' => $title,
        'menu-item-url' => home_url($path),
        'menu-item-status' => 'publish',
        'menu-item-parent-id' => $parent,
    ]);
}

function ohicloud_seed_navigation(): void
{
    $locations = get_theme_mod('nav_menu_locations', []);
    $primary_id = ohicloud_upsert_menu('OHICloud Primary Mega');

    $map = [
        'Platform' => ['/what-is-ohicloud', '/how-it-works', '/why-ohicloud', '/architecture', '/governance', '/security'],
        'Products' => ['/products', '/products/hosting', '/products/compute', '/products/wordpress', '/products/storage', '/products/networking'],
        'Pricing' => ['/pricing', '/pricing/starter', '/pricing/business', '/pricing/interstellar'],
        'Solutions' => ['/solutions', '/use-cases/creators', '/use-cases/agencies', '/use-cases/enterprise', '/use-cases/sovereign'],
        'Developers' => ['/docs', '/docs/quick-start', '/docs/platform', '/docs/api', '/docs/cli', '/docs/developers'],
        'Company' => ['/company', '/about/quantumohi', '/roadmap', '/press', '/terms', '/privacy'],
    ];

    foreach ($map as $section => $links) {
        $parent = ohicloud_add_menu_item($primary_id, $section, $links[0]);
        foreach ($links as $i => $path) {
            if ($i === 0) {
                continue;
            }
            $title = ucwords(str_replace('-', ' ', basename($path)));
            ohicloud_add_menu_item($primary_id, $title, $path, $parent);
        }
    }

    $footer_map = [
        'footer_platform' => ['What Is OHICloud' => '/what-is-ohicloud', 'How It Works' => '/how-it-works', 'Architecture' => '/architecture'],
        'footer_products' => ['Hosting' => '/products/hosting', 'Compute' => '/products/compute', 'WordPress' => '/products/wordpress', 'Storage' => '/products/storage'],
        'footer_developers' => ['Docs Hub' => '/docs', 'API' => '/docs/api', 'CLI' => '/docs/cli', 'Quick Start' => '/docs/quick-start'],
        'footer_company_legal' => ['Company' => '/company', 'Press' => '/press', 'Terms' => '/terms', 'Privacy' => '/privacy'],
    ];

    foreach ($footer_map as $location => $items) {
        $menu_id = ohicloud_upsert_menu('OHICloud ' . ucfirst(str_replace('_', ' ', $location)));
        foreach ($items as $label => $path) {
            ohicloud_add_menu_item($menu_id, $label, $path);
        }
        $locations[$location] = $menu_id;
    }

    $locations['primary'] = $primary_id;
    set_theme_mod('nav_menu_locations', $locations);
}

function qohi_bridge_default_settings(): array
{
    return [
        'gateway_base_url' => 'http://localhost:3000',
        'api_key' => '',
        'api_secret' => '',
        'environment' => 'development',
        'timeout_seconds' => 10,
        'retry_enabled' => 1,
    ];
}

function qohi_bridge_get_settings(): array
{
    $settings = get_option(QOHI_BRIDGE_OPTION, []);
    if (!is_array($settings)) {
        $settings = [];
    }

    $settings = wp_parse_args($settings, qohi_bridge_default_settings());

    $settings['gateway_base_url'] = esc_url_raw((string) $settings['gateway_base_url']);
    $settings['api_key'] = sanitize_text_field((string) $settings['api_key']);
    $settings['api_secret'] = sanitize_text_field((string) $settings['api_secret']);
    $settings['environment'] = sanitize_text_field((string) $settings['environment']);
    $settings['timeout_seconds'] = max(3, min(60, (int) $settings['timeout_seconds']));
    $settings['retry_enabled'] = empty($settings['retry_enabled']) ? 0 : 1;

    return $settings;
}

function qohi_bridge_events_table(): string
{
    global $wpdb;
    return $wpdb->prefix . 'qohi_bridge_events';
}

function qohi_bridge_retry_table(): string
{
    global $wpdb;
    return $wpdb->prefix . 'qohi_retry_queue';
}

function qohi_bridge_install_tables(): void
{
    global $wpdb;
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    $charset_collate = $wpdb->get_charset_collate();
    $events = qohi_bridge_events_table();
    $retry = qohi_bridge_retry_table();

    $sql_events = "CREATE TABLE {$events} (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        wp_order_id BIGINT UNSIGNED NULL,
        event_type VARCHAR(64) NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        idempotency_key VARCHAR(128) NULL,
        external_execution_id VARCHAR(128) NULL,
        qrv_id VARCHAR(128) NULL,
        request_hash CHAR(64) NOT NULL,
        response_hash CHAR(64) NULL,
        http_status SMALLINT NULL,
        status VARCHAR(32) NOT NULL,
        error_code VARCHAR(64) NULL,
        error_message TEXT NULL,
        attempts INT NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        PRIMARY KEY (id),
        KEY idx_order_id (wp_order_id),
        KEY idx_idempotency (idempotency_key),
        KEY idx_status (status),
        KEY idx_execution (external_execution_id),
        KEY idx_qrv_id (qrv_id)
    ) {$charset_collate};";

    $sql_retry = "CREATE TABLE {$retry} (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        bridge_event_id BIGINT UNSIGNED NULL,
        endpoint VARCHAR(255) NOT NULL,
        payload LONGTEXT NOT NULL,
        headers LONGTEXT NULL,
        attempts INT NOT NULL DEFAULT 0,
        max_attempts INT NOT NULL DEFAULT 5,
        status VARCHAR(32) NOT NULL,
        next_attempt_at DATETIME NOT NULL,
        last_error TEXT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        PRIMARY KEY (id),
        KEY idx_status (status),
        KEY idx_next_attempt (next_attempt_at),
        KEY idx_bridge_event (bridge_event_id)
    ) {$charset_collate};";

    dbDelta($sql_events);
    dbDelta($sql_retry);
}

function qohi_bridge_schedule_retry_worker(): void
{
    if (!wp_next_scheduled(QOHI_RETRY_HOOK)) {
        wp_schedule_event(time() + 60, 'qohi_bridge_every_minute', QOHI_RETRY_HOOK);
    }
}

function qohi_bridge_activate(): void
{
    qohi_bridge_install_tables();
    add_option(QOHI_BRIDGE_OPTION, qohi_bridge_default_settings());
    qohi_bridge_schedule_retry_worker();
}
register_activation_hook(__FILE__, 'qohi_bridge_activate');

function qohi_bridge_deactivate(): void
{
    $timestamp = wp_next_scheduled(QOHI_RETRY_HOOK);
    if ($timestamp) {
        wp_unschedule_event($timestamp, QOHI_RETRY_HOOK);
    }
}
register_deactivation_hook(__FILE__, 'qohi_bridge_deactivate');

add_filter('cron_schedules', static function (array $schedules): array {
    if (!isset($schedules['qohi_bridge_every_minute'])) {
        $schedules['qohi_bridge_every_minute'] = [
            'interval' => 60,
            'display' => __('QOHI Bridge Every Minute', 'ohicloud-core'),
        ];
    }

    return $schedules;
});

function qohi_bridge_admin_menu(): void
{
    add_options_page(
        __('Quantum OHI Bridge', 'ohicloud-core'),
        __('Quantum OHI Bridge', 'ohicloud-core'),
        'manage_options',
        'qohi-bridge-settings',
        'qohi_bridge_render_settings_page'
    );
}
add_action('admin_menu', 'qohi_bridge_admin_menu');

function qohi_bridge_mask_secret(string $secret): string
{
    if ($secret === '') {
        return '';
    }

    $length = strlen($secret);
    if ($length <= 4) {
        return str_repeat('*', $length);
    }

    return str_repeat('*', $length - 4) . substr($secret, -4);
}

function qohi_bridge_save_settings(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }

    if (!isset($_POST['qohi_bridge_save_settings'])) {
        return;
    }

    check_admin_referer('qohi_bridge_save_settings_action', 'qohi_bridge_nonce');

    $existing = qohi_bridge_get_settings();
    $api_secret = isset($_POST['api_secret']) ? sanitize_text_field(wp_unslash((string) $_POST['api_secret'])) : '';

    $updated = [
        'gateway_base_url' => esc_url_raw(wp_unslash((string) ($_POST['gateway_base_url'] ?? ''))),
        'api_key' => sanitize_text_field(wp_unslash((string) ($_POST['api_key'] ?? ''))),
        'api_secret' => $api_secret !== '' ? $api_secret : $existing['api_secret'],
        'environment' => sanitize_text_field(wp_unslash((string) ($_POST['environment'] ?? 'development'))),
        'timeout_seconds' => max(3, min(60, (int) ($_POST['timeout_seconds'] ?? 10))),
        'retry_enabled' => !empty($_POST['retry_enabled']) ? 1 : 0,
    ];

    update_option(QOHI_BRIDGE_OPTION, $updated, false);
    add_settings_error('qohi_bridge', 'settings_saved', __('Settings saved.', 'ohicloud-core'), 'updated');
}
add_action('admin_init', 'qohi_bridge_save_settings');

function qohi_bridge_health_snapshot(): array
{
    $settings = qohi_bridge_get_settings();
    $url = trailingslashit($settings['gateway_base_url']) . 'health';
    $response = wp_remote_get($url, ['timeout' => $settings['timeout_seconds']]);
    $reachable = !is_wp_error($response) && (int) wp_remote_retrieve_response_code($response) < 500;

    return [
        'reachable' => $reachable,
        'last_success' => (string) get_option(QOHI_LAST_SUCCESS_KEY, ''),
        'last_failure' => (string) get_option(QOHI_LAST_FAILURE_KEY, ''),
        'circuit_open_until' => (int) get_transient(QOHI_CIRCUIT_KEY),
        'retry_depth' => qohi_bridge_retry_depth(),
        'plugin_version' => '1.2.0',
    ];
}

function qohi_bridge_render_settings_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }

    $settings = qohi_bridge_get_settings();
    $health = qohi_bridge_health_snapshot();

    settings_errors('qohi_bridge');

    echo '<div class="wrap"><h1>Quantum OHI Bridge</h1>';
    echo '<form method="post">';
    wp_nonce_field('qohi_bridge_save_settings_action', 'qohi_bridge_nonce');

    echo '<table class="form-table" role="presentation">';
    echo '<tr><th><label for="gateway_base_url">Gateway Base URL</label></th><td><input type="url" name="gateway_base_url" id="gateway_base_url" class="regular-text" value="' . esc_attr($settings['gateway_base_url']) . '" required /></td></tr>';
    echo '<tr><th><label for="api_key">API Key</label></th><td><input type="text" name="api_key" id="api_key" class="regular-text" value="' . esc_attr($settings['api_key']) . '" /></td></tr>';
    echo '<tr><th><label for="api_secret">API Secret</label></th><td><input type="password" name="api_secret" id="api_secret" class="regular-text" value="" autocomplete="new-password" /><p class="description">Current: ' . esc_html(qohi_bridge_mask_secret($settings['api_secret'])) . '</p></td></tr>';
    echo '<tr><th><label for="environment">Environment</label></th><td><input type="text" name="environment" id="environment" class="regular-text" value="' . esc_attr($settings['environment']) . '" /></td></tr>';
    echo '<tr><th><label for="timeout_seconds">Timeout (seconds)</label></th><td><input type="number" min="3" max="60" name="timeout_seconds" id="timeout_seconds" value="' . esc_attr((string) $settings['timeout_seconds']) . '" /></td></tr>';
    echo '<tr><th><label for="retry_enabled">Retry Enabled</label></th><td><input type="checkbox" name="retry_enabled" id="retry_enabled" value="1" ' . checked($settings['retry_enabled'], 1, false) . ' /></td></tr>';
    echo '</table>';

    submit_button(__('Save Settings', 'ohicloud-core'), 'primary', 'qohi_bridge_save_settings');
    echo '</form>';

    echo '<h2>Gateway Health</h2><table class="widefat striped"><tbody>';
    echo '<tr><td>Gateway status</td><td>' . esc_html($health['reachable'] ? 'reachable' : 'unreachable') . '</td></tr>';
    echo '<tr><td>Last success UTC</td><td>' . esc_html($health['last_success'] ?: 'n/a') . '</td></tr>';
    echo '<tr><td>Last failure UTC</td><td>' . esc_html($health['last_failure'] ?: 'n/a') . '</td></tr>';
    echo '<tr><td>Circuit breaker</td><td>' . esc_html(($health['circuit_open_until'] && $health['circuit_open_until'] > time()) ? 'OPEN' : 'CLOSED') . '</td></tr>';
    echo '<tr><td>Retry queue depth</td><td>' . esc_html((string) $health['retry_depth']) . '</td></tr>';
    echo '<tr><td>Plugin version</td><td>' . esc_html($health['plugin_version']) . '</td></tr>';
    echo '</tbody></table>';

    echo '</div>';
}

function qohi_bridge_create_event(array $args): int
{
    global $wpdb;
    $now = gmdate('Y-m-d H:i:s');
    $table = qohi_bridge_events_table();

    $wpdb->insert($table, [
        'wp_order_id' => $args['wp_order_id'] ?? null,
        'event_type' => sanitize_text_field((string) $args['event_type']),
        'endpoint' => esc_url_raw((string) $args['endpoint']),
        'idempotency_key' => sanitize_text_field((string) ($args['idempotency_key'] ?? '')),
        'request_hash' => sanitize_text_field((string) $args['request_hash']),
        'status' => sanitize_text_field((string) ($args['status'] ?? 'pending')),
        'attempts' => (int) ($args['attempts'] ?? 0),
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    return (int) $wpdb->insert_id;
}

function qohi_bridge_update_event(int $event_id, array $fields): void
{
    global $wpdb;
    $table = qohi_bridge_events_table();
    $fields['updated_at'] = gmdate('Y-m-d H:i:s');
    $wpdb->update($table, $fields, ['id' => $event_id]);
}

function qohi_bridge_retry_depth(): int
{
    global $wpdb;
    $table = qohi_bridge_retry_table();
    return (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} WHERE status IN (%s, %s)", 'pending', 'processing'));
}

function qohi_bridge_enqueue_retry(int $event_id, string $endpoint, string $payload, array $headers, int $attempts, string $error): void
{
    $settings = qohi_bridge_get_settings();
    if (empty($settings['retry_enabled'])) {
        return;
    }

    global $wpdb;
    $table = qohi_bridge_retry_table();
    $now = gmdate('Y-m-d H:i:s');
    $next = gmdate('Y-m-d H:i:s', strtotime('+' . QOHI_Bridge_Utils::backoff_minutes($attempts) . ' minutes'));

    $wpdb->insert($table, [
        'bridge_event_id' => $event_id,
        'endpoint' => $endpoint,
        'payload' => $payload,
        'headers' => wp_json_encode($headers),
        'attempts' => $attempts,
        'max_attempts' => 5,
        'status' => 'pending',
        'next_attempt_at' => $next,
        'last_error' => sanitize_text_field($error),
        'created_at' => $now,
        'updated_at' => $now,
    ]);
}

function qohi_bridge_is_circuit_open(): bool
{
    $open_until = (int) get_transient(QOHI_CIRCUIT_KEY);
    return $open_until > time();
}

function qohi_bridge_register_failure(): void
{
    $count = (int) get_transient(QOHI_FAILURE_COUNT_KEY);
    $count++;
    set_transient(QOHI_FAILURE_COUNT_KEY, $count, 300);

    update_option(QOHI_LAST_FAILURE_KEY, gmdate('c'), false);

    if ($count >= 3) {
        set_transient(QOHI_CIRCUIT_KEY, time() + 60, 60);
    }
}

function qohi_bridge_register_success(): void
{
    delete_transient(QOHI_FAILURE_COUNT_KEY);
    delete_transient(QOHI_CIRCUIT_KEY);
    update_option(QOHI_LAST_SUCCESS_KEY, gmdate('c'), false);
}

function qohi_bridge_gateway_request(string $endpoint, array $payload, string $event_type, ?int $order_id = null, ?string $idempotency_key = null): array
{
    $settings = qohi_bridge_get_settings();
    $raw = wp_json_encode($payload);
    $request_hash = hash('sha256', $raw);

    $event_id = qohi_bridge_create_event([
        'wp_order_id' => $order_id,
        'event_type' => $event_type,
        'endpoint' => $endpoint,
        'idempotency_key' => (string) $idempotency_key,
        'request_hash' => $request_hash,
        'status' => 'pending',
    ]);

    if (qohi_bridge_is_circuit_open()) {
        qohi_bridge_update_event($event_id, [
            'status' => 'circuit_open',
            'error_code' => 'CIRCUIT_OPEN',
            'error_message' => 'Circuit breaker open',
            'attempts' => 1,
        ]);
        qohi_bridge_enqueue_retry($event_id, $endpoint, $raw, [], 1, 'circuit_open');
        return ['ok' => false, 'retryable' => true, 'error_code' => 'CIRCUIT_OPEN'];
    }

    $timestamp = time();
    $signature = QOHI_Bridge_Utils::hmac_signature($timestamp, $raw, (string) $settings['api_secret']);

    $headers = [
        'Content-Type' => 'application/json',
        'X-QOHI-Signature' => $signature,
        'X-QOHI-Timestamp' => (string) $timestamp,
        'X-QOHI-Actor-Role' => 'wordpress_bridge',
    ];

    if ($settings['api_key'] !== '') {
        $headers['Authorization'] = 'Bearer ' . $settings['api_key'];
    }

    $response = wp_remote_post($endpoint, [
        'method' => 'POST',
        'timeout' => $settings['timeout_seconds'],
        'headers' => $headers,
        'body' => $raw,
    ]);

    if (is_wp_error($response)) {
        qohi_bridge_register_failure();
        qohi_bridge_update_event($event_id, [
            'status' => 'failed',
            'error_code' => 'NETWORK_ERROR',
            'error_message' => $response->get_error_message(),
            'attempts' => 1,
        ]);
        qohi_bridge_enqueue_retry($event_id, $endpoint, $raw, $headers, 1, $response->get_error_message());
        return ['ok' => false, 'retryable' => true, 'error_code' => 'NETWORK_ERROR'];
    }

    $code = (int) wp_remote_retrieve_response_code($response);
    $body = (string) wp_remote_retrieve_body($response);
    $decoded = json_decode($body, true);
    $response_hash = $body !== '' ? hash('sha256', $body) : null;

    $update = [
        'http_status' => $code,
        'response_hash' => $response_hash,
        'attempts' => 1,
        'external_execution_id' => sanitize_text_field((string) ($decoded['execution_id'] ?? '')),
        'qrv_id' => sanitize_text_field((string) ($decoded['qrv_id'] ?? '')),
    ];

    if ($code >= 200 && $code < 300) {
        qohi_bridge_register_success();
        $update['status'] = 'success';
        qohi_bridge_update_event($event_id, $update);
        return ['ok' => true, 'data' => is_array($decoded) ? $decoded : []];
    }

    $retryable = $code >= 500;
    if ($retryable) {
        qohi_bridge_register_failure();
        qohi_bridge_enqueue_retry($event_id, $endpoint, $raw, $headers, 1, 'http_' . $code);
    }

    $update['status'] = 'failed';
    $update['error_code'] = 'HTTP_' . $code;
    $update['error_message'] = 'Gateway returned HTTP ' . $code;
    qohi_bridge_update_event($event_id, $update);

    return ['ok' => false, 'retryable' => $retryable, 'error_code' => 'HTTP_' . $code, 'data' => $decoded];
}

function qohi_bridge_process_retry_queue(): void
{
    global $wpdb;
    $table = qohi_bridge_retry_table();
    $events = qohi_bridge_events_table();
    $now = gmdate('Y-m-d H:i:s');

    $job = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table} WHERE status = %s AND next_attempt_at <= %s ORDER BY id ASC LIMIT 1", 'pending', $now), ARRAY_A);

    if (!$job) {
        return;
    }

    $updated = $wpdb->update($table, ['status' => 'processing', 'updated_at' => $now], ['id' => (int) $job['id'], 'status' => 'pending']);
    if ($updated !== 1) {
        return;
    }

    $headers = json_decode((string) $job['headers'], true);
    if (!is_array($headers)) {
        $headers = [];
    }

    $response = wp_remote_post((string) $job['endpoint'], [
        'method' => 'POST',
        'timeout' => qohi_bridge_get_settings()['timeout_seconds'],
        'headers' => $headers,
        'body' => (string) $job['payload'],
    ]);

    $attempts = ((int) $job['attempts']) + 1;

    if (is_wp_error($response)) {
        if ($attempts >= (int) $job['max_attempts']) {
            $wpdb->update($table, ['status' => 'failed', 'attempts' => $attempts, 'last_error' => $response->get_error_message(), 'updated_at' => gmdate('Y-m-d H:i:s')], ['id' => (int) $job['id']]);
        } else {
            $next = gmdate('Y-m-d H:i:s', strtotime('+' . QOHI_Bridge_Utils::backoff_minutes($attempts) . ' minutes'));
            $wpdb->update($table, ['status' => 'pending', 'attempts' => $attempts, 'next_attempt_at' => $next, 'last_error' => $response->get_error_message(), 'updated_at' => gmdate('Y-m-d H:i:s')], ['id' => (int) $job['id']]);
        }

        $wpdb->update($events, ['status' => 'failed', 'attempts' => $attempts, 'error_code' => 'RETRY_NETWORK_ERROR', 'error_message' => $response->get_error_message(), 'updated_at' => gmdate('Y-m-d H:i:s')], ['id' => (int) $job['bridge_event_id']]);
        return;
    }

    $code = (int) wp_remote_retrieve_response_code($response);
    $body = (string) wp_remote_retrieve_body($response);
    $decoded = json_decode($body, true);

    if ($code >= 200 && $code < 300) {
        $wpdb->update($table, ['status' => 'completed', 'attempts' => $attempts, 'updated_at' => gmdate('Y-m-d H:i:s')], ['id' => (int) $job['id']]);
        $wpdb->update($events, [
            'status' => 'success',
            'attempts' => $attempts,
            'http_status' => $code,
            'response_hash' => hash('sha256', $body),
            'external_execution_id' => sanitize_text_field((string) ($decoded['execution_id'] ?? '')),
            'qrv_id' => sanitize_text_field((string) ($decoded['qrv_id'] ?? '')),
            'updated_at' => gmdate('Y-m-d H:i:s'),
        ], ['id' => (int) $job['bridge_event_id']]);
        return;
    }

    if ($code >= 500 && $attempts < (int) $job['max_attempts']) {
        $next = gmdate('Y-m-d H:i:s', strtotime('+' . QOHI_Bridge_Utils::backoff_minutes($attempts) . ' minutes'));
        $wpdb->update($table, ['status' => 'pending', 'attempts' => $attempts, 'next_attempt_at' => $next, 'last_error' => 'HTTP_' . $code, 'updated_at' => gmdate('Y-m-d H:i:s')], ['id' => (int) $job['id']]);
    } else {
        $wpdb->update($table, ['status' => 'failed', 'attempts' => $attempts, 'last_error' => 'HTTP_' . $code, 'updated_at' => gmdate('Y-m-d H:i:s')], ['id' => (int) $job['id']]);
    }

    $wpdb->update($events, ['status' => 'failed', 'attempts' => $attempts, 'http_status' => $code, 'response_hash' => hash('sha256', $body), 'error_code' => 'HTTP_' . $code, 'error_message' => 'Retry attempt failed', 'updated_at' => gmdate('Y-m-d H:i:s')], ['id' => (int) $job['bridge_event_id']]);
}
add_action(QOHI_RETRY_HOOK, 'qohi_bridge_process_retry_queue');

function qohi_bridge_execute_order_issue(int $order_id): void
{
    if (!class_exists('WooCommerce') || !function_exists('wc_get_order')) {
        return;
    }

    $order = wc_get_order($order_id);
    if (!$order) {
        return;
    }

    $site_url = site_url();
    $order_total = (string) $order->get_total();
    $idempotency = QOHI_Bridge_Utils::idempotency_issue($order_id, $order_total, $site_url);

    $existing_success = get_post_meta($order_id, '_qohi_issue_success_key', true);
    if ($existing_success === $idempotency) {
        return;
    }

    update_post_meta($order_id, '_qohi_issue_idempotency_key', $idempotency);

    $items = [];
    foreach ($order->get_items() as $item) {
        $items[] = [
            'productId' => (int) $item->get_product_id(),
            'name' => (string) $item->get_name(),
            'quantity' => (int) $item->get_quantity(),
            'lineTotal' => (string) $item->get_total(),
        ];
    }

    $metadata = [
        'orderId' => $order_id,
        'orderNumber' => (string) $order->get_order_number(),
        'siteUrl' => $site_url,
        'customer' => [
            'email' => (string) $order->get_billing_email(),
            'firstName' => (string) $order->get_billing_first_name(),
            'lastName' => (string) $order->get_billing_last_name(),
        ],
        'product' => ['items' => $items],
        'totals' => [
            'total' => (string) $order->get_total(),
            'currency' => (string) $order->get_currency(),
        ],
    ];

    $payload = [
        'workflow' => 'certificate.issue',
        'issued_at_utc' => gmdate('c'),
        'metadata_hash' => QOHI_Bridge_Utils::metadata_hash($metadata),
        'idempotencyKey' => $idempotency,
        'actor' => ['role' => 'wordpress_bridge'],
        'input' => $metadata,
    ];

    $endpoint = trailingslashit(qohi_bridge_get_settings()['gateway_base_url']) . 'v1/ohi/execute';
    $result = qohi_bridge_gateway_request($endpoint, $payload, 'certificate.issue', $order_id, $idempotency);

    if (!empty($result['ok'])) {
        update_post_meta($order_id, '_qohi_issue_success_key', $idempotency);
        if (!empty($result['data']['qrv_id'])) {
            update_post_meta($order_id, '_qohi_qrv_id', sanitize_text_field((string) $result['data']['qrv_id']));
        }
        if (!empty($result['data']['verify_url'])) {
            update_post_meta($order_id, '_qohi_verify_url', esc_url_raw((string) $result['data']['verify_url']));
        }
    }
}

function qohi_bridge_execute_order_revoke(int $order_id, string $refund_total = '0'): void
{
    if (!class_exists('WooCommerce') || !function_exists('wc_get_order')) {
        return;
    }

    $order = wc_get_order($order_id);
    if (!$order) {
        return;
    }

    $site_url = site_url();
    $idempotency = QOHI_Bridge_Utils::idempotency_revoke($order_id, $refund_total, $site_url);

    $existing_success = get_post_meta($order_id, '_qohi_revoke_success_key', true);
    if ($existing_success === $idempotency) {
        return;
    }

    update_post_meta($order_id, '_qohi_revoke_idempotency_key', $idempotency);

    $metadata = [
        'orderId' => $order_id,
        'reason' => 'woocommerce_refund_or_cancellation',
        'refundTotal' => $refund_total,
    ];

    $payload = [
        'workflow' => 'certificate.revoke',
        'issued_at_utc' => gmdate('c'),
        'metadata_hash' => QOHI_Bridge_Utils::metadata_hash($metadata),
        'idempotencyKey' => $idempotency,
        'actor' => ['role' => 'wordpress_bridge'],
        'input' => [
            'orderId' => $order_id,
            'reason' => 'woocommerce_refund_or_cancellation',
        ],
    ];

    $endpoint = trailingslashit(qohi_bridge_get_settings()['gateway_base_url']) . 'v1/ohi/execute';
    $result = qohi_bridge_gateway_request($endpoint, $payload, 'certificate.revoke', $order_id, $idempotency);

    if (!empty($result['ok'])) {
        update_post_meta($order_id, '_qohi_revoke_success_key', $idempotency);
    }
}

add_action('woocommerce_payment_complete', static function ($order_id): void {
    qohi_bridge_execute_order_issue((int) $order_id);
});

add_action('woocommerce_order_status_cancelled', static function ($order_id): void {
    qohi_bridge_execute_order_revoke((int) $order_id, '0');
});

add_action('woocommerce_order_fully_refunded', static function ($order_id): void {
    $order = function_exists('wc_get_order') ? wc_get_order((int) $order_id) : null;
    $refund_total = $order ? (string) $order->get_total_refunded() : '0';
    qohi_bridge_execute_order_revoke((int) $order_id, $refund_total);
});

function qohi_bridge_get_verify_url(int $order_id): string
{
    $stored = (string) get_post_meta($order_id, '_qohi_verify_url', true);
    if ($stored !== '') {
        return esc_url($stored);
    }

    $qrv_id = (string) get_post_meta($order_id, '_qohi_qrv_id', true);
    if ($qrv_id === '') {
        return '';
    }

    return esc_url(trailingslashit(qohi_bridge_get_settings()['gateway_base_url']) . 'v1/verify?qrv_id=' . rawurlencode($qrv_id));
}

add_action('woocommerce_thankyou', static function ($order_id): void {
    $url = qohi_bridge_get_verify_url((int) $order_id);
    if ($url === '') {
        return;
    }

    echo '<p><strong>' . esc_html__('Verification:', 'ohicloud-core') . '</strong> <a href="' . esc_url($url) . '" target="_blank" rel="noopener noreferrer">' . esc_html($url) . '</a></p>';
});

add_action('woocommerce_admin_order_data_after_order_details', static function ($order): void {
    if (!is_object($order) || !method_exists($order, 'get_id')) {
        return;
    }

    $url = qohi_bridge_get_verify_url((int) $order->get_id());
    if ($url === '') {
        return;
    }

    echo '<p><strong>' . esc_html__('Quantum OHI Verify URL', 'ohicloud-core') . ':</strong> <a href="' . esc_url($url) . '" target="_blank" rel="noopener noreferrer">' . esc_html($url) . '</a></p>';
});

function quantumohi_verification_status_shortcode($atts): string
{
    $atts = shortcode_atts(['qrv_id' => ''], $atts, 'quantumohi_verification_status');
    $qrv_id = sanitize_text_field((string) $atts['qrv_id']);

    if ($qrv_id === '') {
        return '<p>' . esc_html__('QRV ID missing.', 'ohicloud-core') . '</p>';
    }

    $settings = qohi_bridge_get_settings();
    $url = trailingslashit($settings['gateway_base_url']) . 'v1/verify?qrv_id=' . rawurlencode($qrv_id);
    $response = wp_remote_get($url, ['timeout' => $settings['timeout_seconds']]);

    if (is_wp_error($response)) {
        return '<p>' . esc_html__('Verification service unavailable.', 'ohicloud-core') . '</p>';
    }

    $code = (int) wp_remote_retrieve_response_code($response);
    $body = json_decode((string) wp_remote_retrieve_body($response), true);
    if ($code >= 400 || !is_array($body)) {
        return '<p>' . esc_html__('Verification failed.', 'ohicloud-core') . '</p>';
    }

    $status = sanitize_text_field((string) ($body['status'] ?? 'UNKNOWN'));
    return '<p>' . esc_html__('Verification status:', 'ohicloud-core') . ' ' . esc_html($status) . '</p>';
}
add_shortcode('quantumohi_verification_status', 'quantumohi_verification_status_shortcode');
