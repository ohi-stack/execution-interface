<?php

if (!defined('ABSPATH')) {
    exit;
}

class QOHI_Bridge_Admin_Settings
{
    public const OPTION_KEY = 'qohi_bridge_settings';

    public static function init(): void
    {
        add_action('admin_menu', [self::class, 'register_menu']);
        add_action('admin_init', [self::class, 'register_settings']);
    }

    public static function register_menu(): void
    {
        add_options_page(
            'Quantum OHI Settings',
            'Quantum OHI',
            'manage_options',
            'qohi-bridge-settings',
            [self::class, 'render_page']
        );
    }

    public static function register_settings(): void
    {
        register_setting('qohi_bridge_settings_group', self::OPTION_KEY);

        add_settings_section('qohi_bridge_main', 'Execution Gateway Configuration', '__return_empty_string', 'qohi-bridge-settings');

        self::register_field('gateway_url', 'Execution Gateway URL');
        self::register_field('api_key', 'API Key', 'password');
        self::register_field('environment', 'Environment', 'select');
    }

    private static function register_field(string $key, string $label, string $type = 'text'): void
    {
        add_settings_field(
            $key,
            $label,
            function () use ($key, $type): void {
                $options = get_option(self::OPTION_KEY, []);
                $value = isset($options[$key]) ? esc_attr((string) $options[$key]) : '';

                if ($type === 'select') {
                    $env = $value ?: 'dev';
                    echo '<select name="' . esc_attr(self::OPTION_KEY) . '[' . esc_attr($key) . ']">';
                    foreach (['dev', 'staging', 'prod'] as $option) {
                        printf('<option value="%1$s" %2$s>%1$s</option>', esc_attr($option), selected($env, $option, false));
                    }
                    echo '</select>';

                    return;
                }

                printf(
                    '<input type="%s" name="%s[%s]" value="%s" class="regular-text" autocomplete="off" />',
                    esc_attr($type),
                    esc_attr(self::OPTION_KEY),
                    esc_attr($key),
                    $value
                );
            },
            'qohi-bridge-settings',
            'qohi_bridge_main'
        );
    }

    public static function get_settings(): array
    {
        $settings = get_option(self::OPTION_KEY, []);

        return [
            'gateway_url' => isset($settings['gateway_url']) ? rtrim((string) $settings['gateway_url'], '/') : '',
            'api_key' => isset($settings['api_key']) ? (string) $settings['api_key'] : '',
            'environment' => isset($settings['environment']) ? (string) $settings['environment'] : 'dev',
        ];
    }

    public static function render_page(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }
        ?>
        <div class="wrap">
            <h1>Quantum OHI Settings</h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('qohi_bridge_settings_group');
                do_settings_sections('qohi-bridge-settings');
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }
}
