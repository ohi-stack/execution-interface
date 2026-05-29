<?php

if (! defined('ABSPATH')) {
    exit;
}

class ALGQ_MAO_Admin
{
    private ALGQ_MAO_Calculator $calculator;
    private ALGQ_MAO_Repository $repository;

    public function __construct(ALGQ_MAO_Calculator $calculator, ALGQ_MAO_Repository $repository)
    {
        $this->calculator = $calculator;
        $this->repository = $repository;
    }

    public function register_menu(): void
    {
        add_menu_page(
            __('Algonquian MAO', 'algq-mao-engine'),
            __('Algonquian MAO', 'algq-mao-engine'),
            'manage_options',
            'algq-mao-engine',
            array($this, 'render_page'),
            'dashicons-chart-line',
            26
        );
    }

    public function enqueue_assets(string $hook): void
    {
        if ('toplevel_page_algq-mao-engine' !== $hook) {
            return;
        }

        wp_enqueue_style('algq-mao-engine', ALGQ_MAO_ENGINE_URL . 'assets/css/algq-mao.css', array(), ALGQ_MAO_ENGINE_VERSION);
    }

    public function render_page(): void
    {
        if (! current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to access this page.', 'algq-mao-engine'));
        }

        $calculation = null;

        if (isset($_POST['algq_mao_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['algq_mao_nonce'])), 'algq_mao_admin_calculate')) {
            $calculation = $this->calculator->calculate($_POST);
            $calculation['id'] = $this->repository->create($calculation);
        }

        $history = $this->repository->latest(15);
        include ALGQ_MAO_ENGINE_PATH . 'templates/admin-calculator.php';
    }
}
