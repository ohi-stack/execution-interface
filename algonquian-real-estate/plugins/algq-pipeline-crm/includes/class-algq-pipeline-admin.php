<?php
/**
 * Admin UI for Pipeline CRM.
 *
 * @package Algonquian_Pipeline_CRM
 */

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Pipeline_Admin
{
    private ALGQ_Pipeline_Database $database;
    private ALGQ_Pipeline_Board $board;
    private string $hook_suffix = '';

    public function __construct(ALGQ_Pipeline_Database $database, ALGQ_Pipeline_Board $board)
    {
        $this->database = $database;
        $this->board = $board;
    }

    public function register_hooks(): void
    {
        add_action('admin_menu', [$this, 'register_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    public function register_admin_menu(): void
    {
        $this->hook_suffix = add_menu_page(
            __('Algonquian Pipeline CRM', 'algq-pipeline-crm'),
            __('Algonquian Pipeline CRM', 'algq-pipeline-crm'),
            'algq_view_pipeline',
            'algq-pipeline-crm',
            [$this, 'render_board_page'],
            'dashicons-networking',
            26
        );

        add_submenu_page('algq-pipeline-crm', __('Board', 'algq-pipeline-crm'), __('Board', 'algq-pipeline-crm'), 'algq_view_pipeline', 'algq-pipeline-crm', [$this, 'render_board_page']);
        add_submenu_page('algq-pipeline-crm', __('Deals', 'algq-pipeline-crm'), __('Deals', 'algq-pipeline-crm'), 'algq_view_pipeline', 'algq-pipeline-deals', [$this, 'render_deals_page']);
        add_submenu_page('algq-pipeline-crm', __('Activity', 'algq-pipeline-crm'), __('Activity', 'algq-pipeline-crm'), 'algq_view_pipeline', 'algq-pipeline-activity', [$this, 'render_activity_page']);
        add_submenu_page('algq-pipeline-crm', __('Settings', 'algq-pipeline-crm'), __('Settings', 'algq-pipeline-crm'), 'algq_manage_pipeline', 'algq-pipeline-settings', [$this, 'render_settings_page']);
    }

    public function enqueue_assets(string $hook): void
    {
        if (false === strpos($hook, 'algq-pipeline')) {
            return;
        }

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

    public function render_board_page(): void
    {
        if (!current_user_can('algq_view_pipeline')) {
            wp_die(esc_html__('You do not have permission to view this page.', 'algq-pipeline-crm'));
        }

        echo '<div class="wrap algq-pipeline-wrap"><h1>' . esc_html__('Algonquian Pipeline CRM', 'algq-pipeline-crm') . '</h1>';
        $this->board->render(true);
        echo '</div>';
    }

    public function render_deals_page(): void
    {
        if (!current_user_can('algq_view_pipeline')) {
            wp_die(esc_html__('You do not have permission to view this page.', 'algq-pipeline-crm'));
        }

        $deal_id = isset($_GET['deal_id']) ? absint($_GET['deal_id']) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if ($deal_id > 0) {
            $deal = $this->database->get_deal($deal_id);
            include ALGQ_PIPELINE_CRM_DIR . 'admin/views/deal-detail.php';
            return;
        }

        $deals = $this->database->get_deals(['limit' => 300]);
        echo '<div class="wrap algq-pipeline-wrap"><h1>' . esc_html__('Pipeline Deals', 'algq-pipeline-crm') . '</h1>';
        echo '<table class="widefat striped"><thead><tr><th>' . esc_html__('Deal ID', 'algq-pipeline-crm') . '</th><th>' . esc_html__('Property', 'algq-pipeline-crm') . '</th><th>' . esc_html__('Seller', 'algq-pipeline-crm') . '</th><th>' . esc_html__('Stage', 'algq-pipeline-crm') . '</th><th>' . esc_html__('Priority', 'algq-pipeline-crm') . '</th><th>' . esc_html__('Updated', 'algq-pipeline-crm') . '</th></tr></thead><tbody>';
        foreach ($deals as $deal) {
            $url = add_query_arg(['page' => 'algq-pipeline-deals', 'deal_id' => absint($deal['id'])], admin_url('admin.php'));
            echo '<tr><td><a href="' . esc_url($url) . '">#' . esc_html((string) $deal['id']) . '</a></td><td>' . esc_html((string) $deal['property_address']) . '</td><td>' . esc_html((string) $deal['seller_name']) . '</td><td>' . esc_html((string) $deal['stage_key']) . '</td><td>' . esc_html((string) $deal['priority']) . '</td><td>' . esc_html((string) $deal['updated_at']) . '</td></tr>';
        }
        if ([] === $deals) {
            echo '<tr><td colspan="6">' . esc_html__('No deals found yet.', 'algq-pipeline-crm') . '</td></tr>';
        }
        echo '</tbody></table></div>';
    }

    public function render_activity_page(): void
    {
        if (!current_user_can('algq_view_pipeline')) {
            wp_die(esc_html__('You do not have permission to view this page.', 'algq-pipeline-crm'));
        }

        $activity = $this->database->get_activity(['limit' => 200]);
        include ALGQ_PIPELINE_CRM_DIR . 'admin/views/activity.php';
    }

    public function render_settings_page(): void
    {
        if (!current_user_can('algq_manage_pipeline')) {
            wp_die(esc_html__('You do not have permission to view this page.', 'algq-pipeline-crm'));
        }

        $stages = $this->database->get_stages();
        include ALGQ_PIPELINE_CRM_DIR . 'admin/views/settings.php';
    }
}
