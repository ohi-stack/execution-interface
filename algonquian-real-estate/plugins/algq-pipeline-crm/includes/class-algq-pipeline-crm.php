<?php
/**
 * Main Pipeline CRM plugin class.
 *
 * @package Algonquian_Pipeline_CRM
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Pipeline_CRM
{
    private static ?ALGQ_Pipeline_CRM $instance = null;
    private ALGQ_Pipeline_Database $database;
    private ALGQ_Pipeline_Activity $activity;
    private ALGQ_Pipeline_Board $board;
    private ALGQ_Pipeline_REST_Controller $rest_controller;
    private ALGQ_Pipeline_Admin $admin;
    private ALGQ_Pipeline_Integrations $integrations;

    private function __construct()
    {
        $this->database = new ALGQ_Pipeline_Database();
        $this->activity = new ALGQ_Pipeline_Activity($this->database);
        $this->board = new ALGQ_Pipeline_Board($this->database);
        $this->rest_controller = new ALGQ_Pipeline_REST_Controller($this->database, $this->activity);
        $this->admin = new ALGQ_Pipeline_Admin($this->database, $this->board);
        $this->integrations = new ALGQ_Pipeline_Integrations($this->database, $this->activity);
    }

    public static function instance(): ALGQ_Pipeline_CRM
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function run(): void
    {
        add_action('init', [$this, 'register_shortcodes']);
        add_action('rest_api_init', [$this->rest_controller, 'register_routes']);
        $this->admin->register_hooks();
        $this->integrations->register_hooks();
    }

    public function register_shortcodes(): void
    {
        add_shortcode('algq_pipeline_board', [$this, 'render_board_shortcode']);
        add_shortcode('algq_pipeline_crm', [$this, 'render_board_shortcode']);
    }

    public function render_board_shortcode(): string
    {
        if (!current_user_can('algq_view_pipeline')) {
            return '<p class="algq-pipeline-message">' . esc_html__('You do not have permission to view the pipeline board.', 'algq-pipeline-crm') . '</p>';
        }

        ob_start();
        $this->board->render(false);
        return (string) ob_get_clean();
    }
}
