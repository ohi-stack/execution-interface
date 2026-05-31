<?php
/**
 * Plugin Name: Algonquian Command Center
 * Description: Executive command center for KPI dashboard, pipeline value, deal counts, funding status, buyer activity, and reporting.
 * Version: 0.2.0
 * Author: Algonquian Real Estate
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Command_Center
{
    private const DEALS_TABLE = 'algq_deals';
    private const ACTIVITY_TABLE = 'algq_activity_log';

    /**
     * Statuses treated as still active in the acquisition pipeline.
     *
     * @var string[]
     */
    private const ACTIVE_DEAL_STATUSES = ['new', 'lead_captured', 'underwriting', 'offer_sent', 'under_contract', 'buyer_assigned', 'active'];

    public function __construct()
    {
        add_action('wp_dashboard_setup', [$this, 'register_dashboard_widget']);
        add_action('admin_menu', [$this, 'register_admin_page']);
        add_shortcode('algq_command_center', [$this, 'render_shortcode']);
        add_action('rest_api_init', [$this, 'register_rest_routes']);
    }


    public function register_rest_routes(): void
    {
        register_rest_route('algq/v1', '/command-center/metrics', [
            'methods' => 'GET',
            'callback' => [$this, 'rest_metrics'],
            'permission_callback' => static function (): bool {
                return current_user_can('manage_options');
            },
        ]);
    }

    public function rest_metrics(): WP_REST_Response
    {
        return new WP_REST_Response([
            'generated_at' => gmdate('c'),
            'metrics' => $this->collect_metrics(),
        ]);
    }

    public function register_dashboard_widget(): void
    {
        wp_add_dashboard_widget(
            'algq_command_center',
            __('Algonquian Command Center', 'algq-command-center'),
            [$this, 'render_dashboard_widget']
        );
    }

    public function register_admin_page(): void
    {
        add_menu_page(
            __('Algonquian Command Center', 'algq-command-center'),
            __('Command Center', 'algq-command-center'),
            'manage_options',
            'algq-command-center',
            [$this, 'render_admin_page'],
            'dashicons-chart-area',
            25
        );
    }

    public function render_dashboard_widget(): void
    {
        echo $this->render_command_center(false); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    }

    public function render_admin_page(): void
    {
        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Algonquian Command Center', 'algq-command-center') . '</h1>';
        echo $this->render_command_center(true); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo '</div>';
    }

    public function render_shortcode(): string
    {
        if (!current_user_can('manage_options')) {
            return '<div class="algq-command-center-notice">' . esc_html__('Command Center access requires an administrator account.', 'algq-command-center') . '</div>';
        }

        return $this->render_command_center(false);
    }

    private function render_command_center(bool $expanded): string
    {
        $metrics = $this->collect_metrics();

        ob_start();
        $this->render_styles();
        ?>
        <section class="algq-command-center" aria-label="<?php esc_attr_e('Algonquian Command Center', 'algq-command-center'); ?>">
            <div class="algq-command-hero">
                <div>
                    <p class="algq-command-eyebrow"><?php esc_html_e('Executive Operations', 'algq-command-center'); ?></p>
                    <h2><?php esc_html_e('Command Center', 'algq-command-center'); ?></h2>
                    <p><?php esc_html_e('KPI dashboard for pipeline value, deal counts, funding status, buyer activity, and reporting engine readiness.', 'algq-command-center'); ?></p>
                </div>
                <span class="algq-command-status"><?php echo esc_html($metrics['system_status']); ?></span>
            </div>

            <div class="algq-kpi-grid">
                <?php foreach ($metrics['kpis'] as $kpi) : ?>
                    <article class="algq-kpi-card">
                        <span><?php echo esc_html($kpi['label']); ?></span>
                        <strong><?php echo esc_html($kpi['value']); ?></strong>
                        <small><?php echo esc_html($kpi['detail']); ?></small>
                    </article>
                <?php endforeach; ?>
            </div>

            <div class="algq-command-panels">
                <?php $this->render_panel(__('Pipeline Value', 'algq-command-center'), $metrics['pipeline']); ?>
                <?php $this->render_panel(__('Deal Counts', 'algq-command-center'), $metrics['deals']); ?>
                <?php $this->render_panel(__('Funding Status', 'algq-command-center'), $metrics['funding']); ?>
                <?php $this->render_panel(__('Buyer Activity', 'algq-command-center'), $metrics['buyers']); ?>
            </div>

            <?php $this->render_metrics_dashboard($metrics); ?>

            <?php if ($expanded) : ?>
                <div class="algq-reporting-engine">
                    <h3><?php esc_html_e('Reporting Engine', 'algq-command-center'); ?></h3>
                    <p><?php esc_html_e('Operational report definitions are ready for CSV export, scheduled delivery, and chart integrations as companion modules expose more structured data.', 'algq-command-center'); ?></p>
                    <div class="algq-report-grid">
                        <?php foreach ($metrics['reports'] as $report) : ?>
                            <article>
                                <strong><?php echo esc_html($report['name']); ?></strong>
                                <span><?php echo esc_html($report['cadence']); ?></span>
                                <small><?php echo esc_html($report['source']); ?></small>
                            </article>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>
        </section>
        <?php
        return (string) ob_get_clean();
    }

    /**
     * @param array<string,mixed> $metrics
     */
    private function render_metrics_dashboard(array $metrics): void
    {
        $cards = array_merge($metrics['pipeline'], $metrics['deals'], $metrics['funding'], $metrics['buyers']);
        ?>
        <div class="algq-metrics-dashboard">
            <h3><?php esc_html_e('Metrics Dashboard', 'algq-command-center'); ?></h3>
            <div class="algq-metric-bars">
                <?php foreach ($cards as $index => $card) : ?>
                    <?php $width = 20 + (($index + 1) * 9 % 70); ?>
                    <div class="algq-metric-bar-row">
                        <span><?php echo esc_html($card['label']); ?></span>
                        <strong><?php echo esc_html($card['value']); ?></strong>
                        <em style="width: <?php echo esc_attr((string) $width); ?>%"></em>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
    }

    private function render_panel(string $title, array $rows): void
    {
        ?>
        <article class="algq-command-panel">
            <h3><?php echo esc_html($title); ?></h3>
            <dl>
                <?php foreach ($rows as $row) : ?>
                    <div>
                        <dt><?php echo esc_html($row['label']); ?></dt>
                        <dd><?php echo esc_html($row['value']); ?></dd>
                    </div>
                <?php endforeach; ?>
            </dl>
        </article>
        <?php
    }

    private function render_styles(): void
    {
        ?>
        <style>
            .algq-command-center{margin:18px 0;color:#172033}.algq-command-hero{display:flex;gap:16px;justify-content:space-between;align-items:flex-start;padding:20px;border:1px solid #d9e2ef;border-radius:18px;background:linear-gradient(135deg,#f8fbff,#edf4ff)}.algq-command-eyebrow{margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#45607f}.algq-command-hero h2{margin:0 0 8px;font-size:28px;line-height:1.1}.algq-command-hero p{margin:0;max-width:760px;color:#4b5870}.algq-command-status{display:inline-flex;white-space:nowrap;border-radius:999px;background:#0f766e;color:#fff;padding:7px 12px;font-weight:700;font-size:12px}.algq-kpi-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:14px 0}.algq-kpi-card,.algq-command-panel,.algq-reporting-engine{border:1px solid #d9e2ef;border-radius:16px;background:#fff;padding:16px;box-shadow:0 10px 24px rgba(20,39,67,.06)}.algq-kpi-card span,.algq-kpi-card small{display:block;color:#64748b}.algq-kpi-card strong{display:block;margin:6px 0;font-size:24px;color:#0f172a}.algq-command-panels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.algq-command-panel h3,.algq-reporting-engine h3{margin:0 0 12px}.algq-command-panel dl{margin:0}.algq-command-panel dl div{display:flex;justify-content:space-between;gap:14px;padding:9px 0;border-top:1px solid #edf2f7}.algq-command-panel dl div:first-child{border-top:0}.algq-command-panel dt{color:#64748b}.algq-command-panel dd{margin:0;font-weight:700;text-align:right}.algq-reporting-engine{margin-top:14px}.algq-report-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.algq-report-grid article{border:1px solid #e5edf6;border-radius:12px;padding:12px;background:#f8fafc}.algq-report-grid strong,.algq-report-grid span,.algq-report-grid small{display:block}.algq-report-grid span{margin:5px 0;color:#475569}.algq-report-grid small{color:#64748b}.algq-metrics-dashboard{margin-top:18px;border:1px solid rgba(180,135,35,.28);border-radius:18px;padding:18px;background:rgba(255,255,255,.72)}.algq-metric-bars{display:grid;gap:10px}.algq-metric-bar-row{position:relative;overflow:hidden;border-radius:12px;background:#fff;padding:12px 14px}.algq-metric-bar-row span,.algq-metric-bar-row strong{position:relative;z-index:1}.algq-metric-bar-row strong{float:right}.algq-metric-bar-row em{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,rgba(180,135,35,.28),rgba(34,197,94,.18))}@media (max-width:900px){.algq-kpi-grid,.algq-command-panels,.algq-report-grid{grid-template-columns:1fr}.algq-command-hero{display:block}.algq-command-status{margin-top:12px}}
        </style>
        <?php
    }

    /**
     * @return array<string,mixed>
     */
    private function collect_metrics(): array
    {
        $pipeline = $this->get_pipeline_metrics();
        $deals = $this->get_deal_metrics();
        $funding = $this->get_funding_metrics();
        $buyers = $this->get_buyer_metrics();

        return [
            'system_status' => $this->table_exists(self::DEALS_TABLE) ? __('Live data connected', 'algq-command-center') : __('Awaiting data sources', 'algq-command-center'),
            'kpis' => [
                ['label' => __('Pipeline Value', 'algq-command-center'), 'value' => $pipeline[0]['value'], 'detail' => __('Open asking-price value', 'algq-command-center')],
                ['label' => __('Active Deals', 'algq-command-center'), 'value' => $deals[0]['value'], 'detail' => __('Deals not marked closed', 'algq-command-center')],
                ['label' => __('Funding Status', 'algq-command-center'), 'value' => $funding[0]['value'], 'detail' => __('Funding tracker snapshot', 'algq-command-center')],
                ['label' => __('Buyer Activity', 'algq-command-center'), 'value' => $buyers[0]['value'], 'detail' => __('Registered buyers with NDA', 'algq-command-center')],
            ],
            'pipeline' => $pipeline,
            'deals' => $deals,
            'funding' => $funding,
            'buyers' => $buyers,
            'reports' => [
                ['name' => __('Executive KPI Summary', 'algq-command-center'), 'cadence' => __('Daily', 'algq-command-center'), 'source' => __('Deals, activities, funding, buyers', 'algq-command-center')],
                ['name' => __('Acquisition Pipeline Report', 'algq-command-center'), 'cadence' => __('Weekly', 'algq-command-center'), 'source' => __('Deal Intake + Pipeline CRM', 'algq-command-center')],
                ['name' => __('Capital & Buyer Readiness', 'algq-command-center'), 'cadence' => __('Monthly', 'algq-command-center'), 'source' => __('Funding Tracker + Buyer Portal', 'algq-command-center')],
            ],
        ];
    }

    /**
     * @return array<int,array{label:string,value:string}>
     */
    private function get_pipeline_metrics(): array
    {
        if (!$this->table_exists(self::DEALS_TABLE)) {
            return [
                ['label' => __('Open pipeline value', 'algq-command-center'), 'value' => __('Connect Deal Intake', 'algq-command-center')],
                ['label' => __('Average deal value', 'algq-command-center'), 'value' => '—'],
                ['label' => __('Pipeline source', 'algq-command-center'), 'value' => __('wp_algq_deals', 'algq-command-center')],
            ];
        }

        global $wpdb;
        $table = $wpdb->prefix . self::DEALS_TABLE;
        $status_placeholders = implode(',', array_fill(0, count(self::ACTIVE_DEAL_STATUSES), '%s'));
        $pipeline_value = (float) $wpdb->get_var($wpdb->prepare("SELECT COALESCE(SUM(asking_price), 0) FROM {$table} WHERE status IN ({$status_placeholders})", self::ACTIVE_DEAL_STATUSES));
        $active_count = max(1, (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} WHERE status IN ({$status_placeholders})", self::ACTIVE_DEAL_STATUSES)));

        return [
            ['label' => __('Open pipeline value', 'algq-command-center'), 'value' => $this->format_currency($pipeline_value)],
            ['label' => __('Average deal value', 'algq-command-center'), 'value' => $this->format_currency($pipeline_value / $active_count)],
            ['label' => __('Pipeline source', 'algq-command-center'), 'value' => __('Deal Intake table', 'algq-command-center')],
        ];
    }

    /**
     * @return array<int,array{label:string,value:string}>
     */
    private function get_deal_metrics(): array
    {
        if (!$this->table_exists(self::DEALS_TABLE)) {
            return [
                ['label' => __('Active deals', 'algq-command-center'), 'value' => '0'],
                ['label' => __('Total captured', 'algq-command-center'), 'value' => '0'],
                ['label' => __('Offers sent', 'algq-command-center'), 'value' => '0'],
                ['label' => __('Closed deals', 'algq-command-center'), 'value' => '0'],
            ];
        }

        global $wpdb;
        $table = $wpdb->prefix . self::DEALS_TABLE;
        $status_placeholders = implode(',', array_fill(0, count(self::ACTIVE_DEAL_STATUSES), '%s'));
        $active = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} WHERE status IN ({$status_placeholders})", self::ACTIVE_DEAL_STATUSES));
        $total = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table}");
        $status_offers = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} WHERE status = %s", 'offer_sent'));
        $activity_offers = $this->get_offer_activity_count();
        $offers = max($status_offers, $activity_offers);
        $closed = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} WHERE status = %s", 'closed'));

        return [
            ['label' => __('Active deals', 'algq-command-center'), 'value' => (string) $active],
            ['label' => __('Total captured', 'algq-command-center'), 'value' => (string) $total],
            ['label' => __('Offers sent', 'algq-command-center'), 'value' => (string) $offers],
            ['label' => __('Closed deals', 'algq-command-center'), 'value' => (string) $closed],
        ];
    }


    private function get_offer_activity_count(): int
    {
        if (!$this->table_exists(self::ACTIVITY_TABLE)) {
            return 0;
        }

        global $wpdb;
        $table = $wpdb->prefix . self::ACTIVITY_TABLE;
        return (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} WHERE activity_type = %s OR activity_note LIKE %s", 'offer_sent', '%Offer Sent%'));
    }

    /**
     * @return array<int,array{label:string,value:string}>
     */
    private function get_funding_metrics(): array
    {
        $fallback = [
            ['label' => __('Funding tracker', 'algq-command-center'), 'value' => __('Needs module connection', 'algq-command-center')],
            ['label' => __('Committed capital', 'algq-command-center'), 'value' => '—'],
            ['label' => __('Open funding requests', 'algq-command-center'), 'value' => '—'],
        ];

        /**
         * Allows the Funding Tracker module to inject live command-center rows before
         * its table contract is finalized.
         *
         * @param array<int,array{label:string,value:string}> $fallback
         */
        $filtered = apply_filters('algq_command_center_funding_status', $fallback);
        return is_array($filtered) ? $filtered : $fallback;
    }

    /**
     * @return array<int,array{label:string,value:string}>
     */
    private function get_buyer_metrics(): array
    {
        global $wpdb;
        $nda_buyers = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(DISTINCT user_id) FROM {$wpdb->usermeta} WHERE meta_key = %s AND meta_value = %s", 'algq_nda_accepted', 'yes'));
        $profiled_buyers = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(DISTINCT user_id) FROM {$wpdb->usermeta} WHERE meta_key IN (%s, %s, %s) AND meta_value <> ''", 'algq_markets', 'algq_buy_box', 'algq_property_types'));
        $cash_available = (float) $wpdb->get_var($wpdb->prepare("SELECT COALESCE(SUM(CAST(meta_value AS DECIMAL(14,2))), 0) FROM {$wpdb->usermeta} WHERE meta_key = %s", 'algq_cash_available'));

        return [
            ['label' => __('NDA-ready buyers', 'algq-command-center'), 'value' => (string) $nda_buyers],
            ['label' => __('Profiled buyers', 'algq-command-center'), 'value' => (string) $profiled_buyers],
            ['label' => __('Declared cash available', 'algq-command-center'), 'value' => $this->format_currency($cash_available)],
        ];
    }

    private function table_exists(string $table): bool
    {
        global $wpdb;
        $full_table = $wpdb->prefix . $table;
        return $full_table === $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $full_table));
    }

    private function format_currency(float $amount): string
    {
        return '$' . number_format($amount, 0);
    }
}

new ALGQ_Command_Center();
