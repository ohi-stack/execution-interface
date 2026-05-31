<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Core_UI
{
    public function hooks(): void
    {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
    }

    public function enqueue_admin_assets(): void
    {
        wp_register_style('algq-core-admin', ALGQ_CORE_URL . 'assets/css/admin.css', [], ALGQ_CORE_VERSION);
        wp_enqueue_style('algq-core-admin');
    }

    public function dashboard_card(string $title, string $value, string $description = ''): string
    {
        return sprintf(
            '<article class="algq-core-card"><h3>%s</h3><strong>%s</strong><p>%s</p></article>',
            esc_html($title),
            esc_html($value),
            esc_html($description)
        );
    }

    public function notice(string $message, string $type = 'info'): string
    {
        return sprintf('<div class="algq-core-notice algq-core-notice--%s">%s</div>', esc_attr($type), wp_kses_post($message));
    }
}
