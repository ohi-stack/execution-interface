<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Core_Plugin
{
    private static ?self $instance = null;
    private ALGQ_Core_Settings $settings;
    private ALGQ_Core_Activity_Logger $activity_logger;
    private ALGQ_Core_Notifications $notifications;
    private ALGQ_Core_Integrations $integrations;
    private ALGQ_Core_Licensing $licensing;
    private ALGQ_Core_UI $ui;
    private ALGQ_Core_REST_Controller $rest_controller;

    private function __construct()
    {
        $this->settings = new ALGQ_Core_Settings();
        $this->activity_logger = new ALGQ_Core_Activity_Logger();
        $this->notifications = new ALGQ_Core_Notifications();
        $this->integrations = new ALGQ_Core_Integrations();
        $this->licensing = new ALGQ_Core_Licensing();
        $this->ui = new ALGQ_Core_UI();
        $this->rest_controller = new ALGQ_Core_REST_Controller();
    }

    public static function instance(): self
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function run(): void
    {
        $this->ui->hooks();
        add_action('rest_api_init', [$this->rest_controller, 'register_routes']);
        add_action('admin_menu', [$this, 'register_admin_page']);
    }

    public function register_admin_page(): void
    {
        add_menu_page(
            __('Algonquian Platform', 'algq-core'),
            __('Algonquian', 'algq-core'),
            'algq_access_platform',
            'algq-platform',
            [$this, 'render_admin_page'],
            'dashicons-admin-multisite',
            24
        );
    }

    public function render_admin_page(): void
    {
        echo '<div class="wrap algq-core-admin">';
        echo '<h1>' . esc_html__('Algonquian Platform Core', 'algq-core') . '</h1>';
        echo '<p>' . esc_html__('Shared services are active for roles, database tables, REST endpoints, settings, logging, notifications, licenses, UI components, and integrations.', 'algq-core') . '</p>';
        echo '<div class="algq-core-card-grid">';
        echo $this->ui->dashboard_card(__('REST namespace', 'algq-core'), '/wp-json/' . ALGQ_Core_REST_Controller::NAMESPACE, __('Shared API contract for every ARE module.', 'algq-core')); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo $this->ui->dashboard_card(__('Integration registry', 'algq-core'), (string) count($this->integrations->providers()), __('WooCommerce, Stripe, PayPal, FluentCRM, SMTP, Maps, and OpenAI provider slots.', 'algq-core')); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo $this->ui->dashboard_card(__('Platform roles', 'algq-core'), (string) count(ALGQ_Core_Activator::ROLES), __('Operational roles for acquisitions, dispositions, funding, investors, buyers, sellers, and contractors.', 'algq-core')); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo '</div></div>';
    }

    public function settings(): ALGQ_Core_Settings
    {
        return $this->settings;
    }

    public function activity(): ALGQ_Core_Activity_Logger
    {
        return $this->activity_logger;
    }

    public function notifications(): ALGQ_Core_Notifications
    {
        return $this->notifications;
    }

    public function integrations(): ALGQ_Core_Integrations
    {
        return $this->integrations;
    }

    public function licensing(): ALGQ_Core_Licensing
    {
        return $this->licensing;
    }

    public function ui(): ALGQ_Core_UI
    {
        return $this->ui;
    }
}
