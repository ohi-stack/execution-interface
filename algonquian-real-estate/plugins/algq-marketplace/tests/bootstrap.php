<?php
/**
 * PHPUnit bootstrap for the Algonquian Marketplace plugin.
 *
 * The WordPress test suite is optional. When WP_TESTS_DIR points to an installed
 * suite, its bootstrap is loaded first. Otherwise, small no-op WordPress shims
 * are registered so tests can validate plugin loading and pure helper behavior
 * without touching a production database or making network calls.
 */

define('ALGQ_MARKETPLACE_TESTS_DIR', __DIR__);
define('ALGQ_MARKETPLACE_TESTS_PLUGIN_FILE', dirname(__DIR__) . '/algq-marketplace.php');

$wp_tests_dir = getenv('WP_TESTS_DIR');
$wp_bootstrap = $wp_tests_dir ? rtrim($wp_tests_dir, '/\\') . '/includes/bootstrap.php' : '';

if ($wp_bootstrap && file_exists($wp_bootstrap)) {
    require_once $wp_bootstrap;
} else {
    tests_add_wordpress_shims();
}

if (!function_exists('algq_core')) {
    function algq_core()
    {
        return true;
    }
}

require_once ALGQ_MARKETPLACE_TESTS_PLUGIN_FILE;
algq_marketplace_tests_do_action('plugins_loaded');
algq_marketplace_tests_do_action('init');

function tests_add_wordpress_shims(): void
{
    defined('ABSPATH') || define('ABSPATH', sys_get_temp_dir() . '/wordpress/');

    $GLOBALS['wp_filter'] = $GLOBALS['wp_filter'] ?? [];
    $GLOBALS['shortcode_tags'] = $GLOBALS['shortcode_tags'] ?? [];
    $GLOBALS['algq_marketplace_rest_routes'] = $GLOBALS['algq_marketplace_rest_routes'] ?? [];
    $GLOBALS['algq_marketplace_activation_hooks'] = $GLOBALS['algq_marketplace_activation_hooks'] ?? [];

    if (!function_exists('plugin_dir_path')) {
        function plugin_dir_path($file): string
        {
            return trailingslashit(dirname($file));
        }
    }

    if (!function_exists('plugin_dir_url')) {
        function plugin_dir_url($file): string
        {
            return 'http://example.org/wp-content/plugins/' . basename(dirname($file)) . '/';
        }
    }

    if (!function_exists('trailingslashit')) {
        function trailingslashit($value): string
        {
            return rtrim((string) $value, '/\\') . '/';
        }
    }

    if (!function_exists('add_action')) {
        function add_action($hook_name, $callback, $priority = 10, $accepted_args = 1): bool
        {
            $GLOBALS['wp_filter'][$hook_name][$priority][] = $callback;
            return true;
        }
    }

    if (!function_exists('add_shortcode')) {
        function add_shortcode($tag, $callback): void
        {
            $GLOBALS['shortcode_tags'][$tag] = $callback;
        }
    }

    if (!function_exists('shortcode_exists')) {
        function shortcode_exists($tag): bool
        {
            return isset($GLOBALS['shortcode_tags'][$tag]);
        }
    }

    if (!function_exists('register_rest_route')) {
        function register_rest_route($namespace, $route, $args = [], $override = false): bool
        {
            $GLOBALS['algq_marketplace_rest_routes'][$namespace . $route] = $args;
            return true;
        }
    }

    if (!function_exists('register_activation_hook')) {
        function register_activation_hook($file, $callback): void
        {
            $GLOBALS['algq_marketplace_activation_hooks'][$file] = $callback;
        }
    }

    if (!function_exists('register_deactivation_hook')) {
        function register_deactivation_hook($file, $callback): void
        {
            $GLOBALS['algq_marketplace_deactivation_hooks'][$file] = $callback;
        }
    }

    if (!function_exists('plugin_basename')) {
        function plugin_basename($file): string
        {
            return basename(dirname($file)) . '/' . basename($file);
        }
    }

    if (!function_exists('is_admin')) {
        function is_admin(): bool
        {
            return true;
        }
    }

    if (!function_exists('current_user_can')) {
        function current_user_can($capability): bool
        {
            return true;
        }
    }

    if (!function_exists('load_plugin_textdomain')) {
        function load_plugin_textdomain($domain, $deprecated = false, $plugin_rel_path = false): bool
        {
            return true;
        }
    }

    if (!function_exists('wp_register_style')) {
        function wp_register_style($handle, $src, $deps = [], $ver = false, $media = 'all'): bool
        {
            $GLOBALS['algq_marketplace_registered_styles'][$handle] = compact('src', 'deps', 'ver', 'media');
            return true;
        }
    }

    if (!function_exists('wp_register_script')) {
        function wp_register_script($handle, $src, $deps = [], $ver = false, $in_footer = false): bool
        {
            $GLOBALS['algq_marketplace_registered_scripts'][$handle] = compact('src', 'deps', 'ver', 'in_footer');
            return true;
        }
    }

    if (!function_exists('wp_style_is')) {
        function wp_style_is($handle, $list = 'enqueued'): bool
        {
            return isset($GLOBALS['algq_marketplace_registered_styles'][$handle]);
        }
    }

    if (!function_exists('wp_enqueue_style')) {
        function wp_enqueue_style($handle, $src = '', $deps = [], $ver = false, $media = 'all'): void
        {
            $GLOBALS['algq_marketplace_enqueued_styles'][$handle] = true;
        }
    }

    if (!function_exists('wp_enqueue_script')) {
        function wp_enqueue_script($handle, $src = '', $deps = [], $ver = false, $in_footer = false): void
        {
            $GLOBALS['algq_marketplace_enqueued_scripts'][$handle] = true;
        }
    }

    if (!function_exists('admin_url')) {
        function admin_url($path = ''): string
        {
            return 'http://example.org/wp-admin/' . ltrim((string) $path, '/');
        }
    }

    if (!function_exists('wp_nonce_field')) {
        function wp_nonce_field($action = -1, $name = '_wpnonce', $referer = true, $display = true): string
        {
            $field = '<input type="hidden" name="' . htmlspecialchars((string) $name, ENT_QUOTES, 'UTF-8') . '" value="test-nonce" />';
            if ($display) {
                echo $field;
            }
            return $field;
        }
    }

    if (!function_exists('wp_verify_nonce')) {
        function wp_verify_nonce($nonce, $action = -1)
        {
            return 'test-nonce' === $nonce ? 1 : false;
        }
    }

    if (!function_exists('esc_url')) {
        function esc_url($value): string
        {
            return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
        }
    }

    if (!function_exists('esc_attr')) {
        function esc_attr($value): string
        {
            return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
        }
    }

    if (!function_exists('absint')) {
        function absint($value): int
        {
            return abs((int) $value);
        }
    }

    if (!function_exists('add_menu_page')) {
        function add_menu_page($page_title, $menu_title, $capability, $menu_slug, $callback = '', $icon_url = '', $position = null): string
        {
            $GLOBALS['algq_marketplace_admin_menus'][$menu_slug] = compact('page_title', 'menu_title', 'capability', 'callback');
            return $menu_slug;
        }
    }

    if (!function_exists('register_setting')) {
        function register_setting($option_group, $option_name, $args = []): void
        {
            $GLOBALS['algq_marketplace_settings'][$option_name] = compact('option_group', 'args');
        }
    }

    if (!function_exists('wp_cache_get')) {
        function wp_cache_get($key, $group = '')
        {
            return false;
        }
    }

    if (!function_exists('wp_cache_set')) {
        function wp_cache_set($key, $value, $group = '', $expire = 0): bool
        {
            $GLOBALS['algq_marketplace_cache'][$group][$key] = $value;
            return true;
        }
    }

    if (!function_exists('wp_cache_delete')) {
        function wp_cache_delete($key, $group = ''): bool
        {
            unset($GLOBALS['algq_marketplace_cache'][$group][$key]);
            return true;
        }
    }

    if (!function_exists('get_transient')) {
        function get_transient($transient)
        {
            return false;
        }
    }

    if (!function_exists('set_transient')) {
        function set_transient($transient, $value, $expiration = 0): bool
        {
            $GLOBALS['algq_marketplace_transients'][$transient] = $value;
            return true;
        }
    }

    if (!function_exists('delete_transient')) {
        function delete_transient($transient): bool
        {
            unset($GLOBALS['algq_marketplace_transients'][$transient]);
            return true;
        }
    }

    if (!function_exists('__return_true')) {
        function __return_true(): bool
        {
            return true;
        }
    }

    if (!function_exists('__')) {
        function __($text, $domain = 'default'): string
        {
            return (string) $text;
        }
    }

    if (!function_exists('esc_html__')) {
        function esc_html__($text, $domain = 'default'): string
        {
            return htmlspecialchars((string) $text, ENT_QUOTES, 'UTF-8');
        }
    }

    if (!function_exists('esc_attr__')) {
        function esc_attr__($text, $domain = 'default'): string
        {
            return htmlspecialchars((string) $text, ENT_QUOTES, 'UTF-8');
        }
    }

    if (!function_exists('esc_html')) {
        function esc_html($text): string
        {
            return htmlspecialchars((string) $text, ENT_QUOTES, 'UTF-8');
        }
    }

    if (!function_exists('sanitize_text_field')) {
        function sanitize_text_field($value): string
        {
            return trim(strip_tags((string) $value));
        }
    }

    if (!function_exists('sanitize_textarea_field')) {
        function sanitize_textarea_field($value): string
        {
            return trim(strip_tags((string) $value));
        }
    }

    if (!function_exists('sanitize_key')) {
        function sanitize_key($value): string
        {
            return preg_replace('/[^a-z0-9_\-]/', '', strtolower((string) $value));
        }
    }

    if (!function_exists('esc_url_raw')) {
        function esc_url_raw($value): string
        {
            $url = filter_var((string) $value, FILTER_SANITIZE_URL);
            return preg_match('#^https?://#i', $url) ? $url : '';
        }
    }

    if (!class_exists('WP_REST_Response')) {
        class WP_REST_Response
        {
            private $data;

            public function __construct($data = null)
            {
                $this->data = $data;
            }

            public function get_data()
            {
                return $this->data;
            }
        }
    }
}

function algq_marketplace_tests_do_action(string $hook_name): void
{
    if (function_exists('do_action')) {
        do_action($hook_name);
        return;
    }

    if (empty($GLOBALS['wp_filter'][$hook_name])) {
        return;
    }

    ksort($GLOBALS['wp_filter'][$hook_name]);

    foreach ($GLOBALS['wp_filter'][$hook_name] as $callbacks) {
        foreach ($callbacks as $callback) {
            call_user_func($callback);
        }
    }
}

if (!class_exists('PHPUnit\\Framework\\TestCase')) {
    eval('namespace PHPUnit\\Framework { abstract class TestCase {} }');
}

if (!class_exists('Algq_Marketplace_TestCase')) {
    if (class_exists('WP_UnitTestCase')) {
        abstract class Algq_Marketplace_TestCase extends WP_UnitTestCase
        {
        }
    } else {
        abstract class Algq_Marketplace_TestCase extends PHPUnit\Framework\TestCase
        {
        }
    }
}
