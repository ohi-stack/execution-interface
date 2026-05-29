<?php

if (! defined('ABSPATH')) {
    exit;
}

class ALGQ_MAO_Public
{
    private ALGQ_MAO_Calculator $calculator;

    public function __construct(ALGQ_MAO_Calculator $calculator)
    {
        $this->calculator = $calculator;
    }

    public function enqueue_assets(): void
    {
        wp_enqueue_style('algq-mao-engine', ALGQ_MAO_ENGINE_URL . 'assets/css/algq-mao.css', array(), ALGQ_MAO_ENGINE_VERSION);
        wp_enqueue_script('algq-mao-engine', ALGQ_MAO_ENGINE_URL . 'assets/js/algq-mao.js', array(), ALGQ_MAO_ENGINE_VERSION, true);
        wp_localize_script('algq-mao-engine', 'algqMaoEngine', array(
            'restUrl' => esc_url_raw(rest_url('algq-mao/v1/calculate')),
        ));
    }

    public function render_shortcode(array $atts = array()): string
    {
        $atts = shortcode_atts(array(
            'title' => __('Maximum Allowable Offer Calculator', 'algq-mao-engine'),
        ), $atts, 'algq_mao_calculator');

        ob_start();
        include ALGQ_MAO_ENGINE_PATH . 'templates/public-calculator.php';

        return (string) ob_get_clean();
    }
}
