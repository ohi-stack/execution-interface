<?php
/**
 * Kanban board renderer.
 *
 * @package Algonquian_Pipeline_CRM
 */

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Pipeline_Board
{
    private ALGQ_Pipeline_Database $database;

    public function __construct(ALGQ_Pipeline_Database $database)
    {
        $this->database = $database;
    }

    public function render(bool $echo = true): string
    {
        $this->enqueue_assets();
        $stages = $this->database->get_stages();
        $deals = $this->database->get_deals(['limit' => 500]);
        $grouped_deals = [];

        foreach ($deals as $deal) {
            $grouped_deals[(string) $deal['stage_key']][] = $deal;
        }

        ob_start();
        include ALGQ_PIPELINE_CRM_DIR . 'admin/views/board.php';
        $html = (string) ob_get_clean();

        if ($echo) {
            echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- View escapes dynamic values.
        }

        return $html;
    }

    public function get_days_in_stage(array $deal): int
    {
        $changed_at = !empty($deal['stage_changed_at']) ? strtotime((string) $deal['stage_changed_at']) : false;
        if (!$changed_at) {
            return 0;
        }

        return max(0, (int) floor((current_time('timestamp') - $changed_at) / DAY_IN_SECONDS));
    }

    public function get_assigned_user_name(array $deal): string
    {
        $user_id = isset($deal['assigned_user_id']) ? absint($deal['assigned_user_id']) : 0;
        if ($user_id < 1) {
            return __('Unassigned', 'algq-pipeline-crm');
        }

        $user = get_userdata($user_id);
        return $user ? $user->display_name : __('Unknown user', 'algq-pipeline-crm');
    }

    public function format_money($value): string
    {
        if (null === $value || '' === $value) {
            return '—';
        }

        return '$' . number_format_i18n((float) $value, 0);
    }

    private function enqueue_assets(): void
    {
        wp_enqueue_style('algq-pipeline-crm', ALGQ_PIPELINE_CRM_URL . 'assets/css/pipeline-crm.css', [], ALGQ_PIPELINE_CRM_VERSION);
        wp_enqueue_script('algq-pipeline-crm', ALGQ_PIPELINE_CRM_URL . 'assets/js/pipeline-crm.js', [], ALGQ_PIPELINE_CRM_VERSION, true);
        wp_localize_script('algq-pipeline-crm', 'algqPipelineCRM', [
            'restUrl' => esc_url_raw(rest_url('algq/v1/pipeline')),
            'nonce' => wp_create_nonce('wp_rest'),
            'canEdit' => current_user_can('algq_edit_deals') || current_user_can('algq_manage_pipeline'),
            'messages' => [
                'moveFailed' => __('Unable to move deal. Please refresh and try again.', 'algq-pipeline-crm'),
            ],
        ]);
    }
}
