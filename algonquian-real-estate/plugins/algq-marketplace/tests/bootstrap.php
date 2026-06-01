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


    if (!function_exists('plugin_basename')) {
        function plugin_basename($file): string
        {
            return basename(dirname($file)) . '/' . basename($file);
        }
    }

    if (!function_exists('is_admin')) {
        function is_admin(): bool
        {
            return false;
        }
    }

    if (!function_exists('load_plugin_textdomain')) {
        function load_plugin_textdomain($domain, $deprecated = false, $plugin_rel_path = false): bool
        {
            return true;
        }
    }

    if (!function_exists('register_deactivation_hook')) {
        function register_deactivation_hook($file, $callback): void
        {
            $GLOBALS['algq_marketplace_deactivation_hooks'][$file] = $callback;
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
