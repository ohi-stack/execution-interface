<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Intake_Public
{
    private ALGQ_Deal_Intake_Repository $repository;
    private ALGQ_Deal_Intake_Validator $validator;
    private ALGQ_Deal_Intake_Scorer $scorer;

    public function __construct(ALGQ_Deal_Intake_Repository $repository, ALGQ_Deal_Intake_Validator $validator, ALGQ_Deal_Intake_Scorer $scorer)
    {
        $this->repository = $repository;
        $this->validator = $validator;
        $this->scorer = $scorer;
    }

    public function register(): void
    {
        add_shortcode('algq_deal_intake', [$this, 'render_shortcode']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    public function enqueue_assets(): void
    {
        wp_register_style('algq-deal-intake', plugin_dir_url(ALGQ_DEAL_INTAKE_FILE) . 'assets/css/deal-intake.css', [], ALGQ_DEAL_INTAKE_VERSION);
    }

    public function render_shortcode(array $atts = []): string
    {
        wp_enqueue_style('algq-deal-intake');

        $atts = shortcode_atts(['source' => 'website'], $atts, 'algq_deal_intake');
        $message = '';
        if ('POST' === ($_SERVER['REQUEST_METHOD'] ?? '') && isset($_POST['algq_deal_intake_nonce'])) {
            $message = $this->handle_submission($atts['source']);
        }

        ob_start();
        include ALGQ_DEAL_INTAKE_DIR . 'templates/intake-form.php';
        return (string) ob_get_clean();
    }

    private function handle_submission(string $fallback_source): string
    {
        if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['algq_deal_intake_nonce'] ?? '')), 'algq_deal_intake_submit')) {
            return '<div class="algq-error">' . esc_html__('Security check failed.', 'algq-deal-intake') . '</div>';
        }
        if (!empty($_POST['algq_website'])) {
            return '<div class="algq-error">' . esc_html__('Submission blocked.', 'algq-deal-intake') . '</div>';
        }

        $payload = $_POST;
        $payload['lead_source'] = $payload['lead_source'] ?? $fallback_source;
        $payload['source_referrer'] = $payload['source_referrer'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
        $payload['source_landing_page'] = $payload['source_landing_page'] ?? home_url(wp_unslash($_SERVER['REQUEST_URI'] ?? ''));
        $validation = $this->validator->validate($payload);
        if (!$validation['valid']) {
            $items = '';
            foreach ($validation['errors'] as $error) {
                $items .= '<li>' . esc_html($error) . '</li>';
            }
            return '<div class="algq-error"><strong>' . esc_html__('Please correct the following:', 'algq-deal-intake') . '</strong><ul>' . $items . '</ul></div>';
        }

        $scored = $this->scorer->score($validation['data']);
        $id = $this->repository->create(array_merge($validation['data'], [
            'motivation_score' => $scored['score'],
            'motivation_signals' => $scored['signals'],
            'property_tags' => $scored['tags'],
        ]));

        if (!$id) {
            return '<div class="algq-error">' . esc_html__('Deal could not be saved. Please try again.', 'algq-deal-intake') . '</div>';
        }

        $deal = $this->repository->find($id);
        if ($deal) {
            wp_mail(get_option('admin_email'), 'New seller lead: ' . $deal['deal_id'], "A new deal was submitted for {$deal['address']}. Motivation score: {$deal['motivation_score']}.");
        }

        return '<div class="algq-success">' . sprintf(esc_html__('Deal submitted. Reference ID: %s', 'algq-deal-intake'), esc_html($deal['deal_id'] ?? (string) $id)) . '</div>';
    }
}
