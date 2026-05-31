<?php
/**
 * Plugin Name: Algonquian Command Center
 * Description: Executive operating hub for ARE acquisitions, underwriting, offers, pipeline, buyers, funding, marketplace, revenue, documents, automation, technology, compliance, and reporting.
 * Version: 0.3.0
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
    private const ACTIVE_DEAL_STATUSES = ['new', 'lead', 'lead_captured', 'qualified', 'underwriting', 'offer_sent', 'negotiating', 'under_contract', 'buyer_assigned', 'funding', 'closing', 'active'];

    /**
     * Canonical operating stages for the ARE deal pipeline.
     *
     * @var string[]
     */
    private const PIPELINE_STAGES = ['Lead', 'Qualified', 'Underwriting', 'Offer Sent', 'Negotiating', 'Under Contract', 'Buyer Assigned', 'Funding', 'Closing', 'Closed', 'Archived'];

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
        $sections = $this->get_command_sections($metrics);

        ob_start();
        $this->render_styles();
        ?>
        <section class="algq-command-center" aria-label="<?php esc_attr_e('Algonquian Command Center', 'algq-command-center'); ?>">
            <div class="algq-command-hero">
                <div>
                    <p class="algq-command-eyebrow"><?php esc_html_e('ARE Operating Headquarters', 'algq-command-center'); ?></p>
                    <h2><?php esc_html_e('Command Center', 'algq-command-center'); ?></h2>
                    <p><?php esc_html_e('Control, monitor, automate, and monetize the complete Algonquian Real Estate ecosystem from one executive operating hub.', 'algq-command-center'); ?></p>
                </div>
                <span class="algq-command-status"><?php echo esc_html($metrics['system_status']); ?></span>
            </div>

            <?php $this->render_operations_nav($this->get_navigation_items()); ?>

            <div class="algq-kpi-grid">
                <?php foreach ($metrics['kpis'] as $kpi) : ?>
                    <article class="algq-kpi-card">
                        <span><?php echo esc_html($kpi['label']); ?></span>
                        <strong><?php echo esc_html($kpi['value']); ?></strong>
                        <small><?php echo esc_html($kpi['detail']); ?></small>
                    </article>
                <?php endforeach; ?>
            </div>

            <?php $this->render_financial_snapshot($metrics['financial_snapshot']); ?>

            <div class="algq-command-panels">
                <?php foreach ($sections as $section) : ?>
                    <?php $this->render_command_section($section); ?>
                <?php endforeach; ?>
            </div>

            <?php $this->render_metrics_dashboard($metrics); ?>

            <?php if ($expanded) : ?>
                <?php $this->render_pipeline_stages($metrics['stage_metrics']); ?>
                <?php $this->render_automation_chain($metrics['automation_chain']); ?>
                <?php $this->render_intelligence_layer($metrics['intelligence']); ?>
                <?php $this->render_ai_layer($metrics['ai_layer']); ?>
            <?php endif; ?>
        </section>
        <?php
        return (string) ob_get_clean();
    }

    /**
     * @param array<int,string> $items
     */
    private function render_operations_nav(array $items): void
    {
        ?>
        <nav class="algq-command-nav" aria-label="<?php esc_attr_e('Command Center Navigation', 'algq-command-center'); ?>">
            <?php foreach ($items as $item) : ?>
                <a href="#<?php echo esc_attr(sanitize_title($item)); ?>"><?php echo esc_html($item); ?></a>
            <?php endforeach; ?>
        </nav>
        <?php
    }

    /**
     * @param array<int,array{label:string,value:string}> $rows
     */
    private function render_financial_snapshot(array $rows): void
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
        <article id="executive" class="algq-financial-snapshot">
            <div>
                <p class="algq-command-eyebrow"><?php esc_html_e('Executive Dashboard', 'algq-command-center'); ?></p>
                <h3><?php esc_html_e('Financial Snapshot', 'algq-command-center'); ?></h3>
            </div>
            <div class="algq-snapshot-grid">
                <?php foreach ($rows as $row) : ?>
                    <div>
                        <span><?php echo esc_html($row['label']); ?></span>
                        <strong><?php echo esc_html($row['value']); ?></strong>
                    </div>
                <?php endforeach; ?>
            </div>
        </article>
        <?php
    }

    /**
     * @param array<string,mixed> $section
     */
    private function render_command_section(array $section): void
    {
        ?>
        <article id="<?php echo esc_attr(sanitize_title($section['title'])); ?>" class="algq-command-panel algq-command-module">
            <div class="algq-panel-header">
                <div>
                    <p class="algq-command-eyebrow"><?php echo esc_html($section['eyebrow']); ?></p>
                    <h3><?php echo esc_html($section['title']); ?></h3>
                </div>
                <span><?php echo esc_html($section['status']); ?></span>
            </div>

            <?php if (!empty($section['metrics'])) : ?>
                <?php $this->render_metric_list($section['metrics']); ?>
            <?php endif; ?>

            <?php if (!empty($section['categories'])) : ?>
                <div class="algq-chip-list">
                    <?php foreach ($section['categories'] as $category) : ?>
                        <span><?php echo esc_html($category); ?></span>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($section['actions'])) : ?>
                <?php $this->render_action_list($section['actions']); ?>
            <?php endif; ?>
        </article>
        <?php
    }

    /**
     * @param array<int,array{label:string,value:string}> $rows
     */
    private function render_metric_list(array $rows): void
    {
        ?>
        <dl class="algq-command-list">
            <?php foreach ($rows as $row) : ?>
                <div>
                    <dt><?php echo esc_html($row['label']); ?></dt>
                    <dd><?php echo esc_html($row['value']); ?></dd>
                </div>
            <?php endforeach; ?>
        </dl>
        <?php
    }

    /**
     * @param array<int,array{label:string,href:string}> $actions
     */
    private function render_action_list(array $actions): void
    {
        ?>
        <div class="algq-action-grid">
            <?php foreach ($actions as $action) : ?>
                <a href="<?php echo esc_url($action['href']); ?>"><?php echo esc_html($action['label']); ?></a>
            <?php endforeach; ?>
        </div>
        <?php
    }

    /**
     * @param array<int,array{stage:string,count:string,days:string,bottleneck:string}> $stages
     */
    private function render_pipeline_stages(array $stages): void
    {
        ?>
        <article id="pipeline" class="algq-reporting-engine algq-pipeline-map">
            <div class="algq-panel-header">
                <div>
                    <p class="algq-command-eyebrow"><?php esc_html_e('Pipeline Operations Center', 'algq-command-center'); ?></p>
                    <h3><?php esc_html_e('Stage Control Map', 'algq-command-center'); ?></h3>
                </div>
                <span><?php esc_html_e('Lead → Archived', 'algq-command-center'); ?></span>
            </div>
            <div class="algq-stage-grid">
                <?php foreach ($stages as $stage) : ?>
                    <div>
                        <strong><?php echo esc_html($stage['stage']); ?></strong>
                        <span><?php echo esc_html($stage['count']); ?></span>
                        <small><?php echo esc_html($stage['days']); ?> · <?php echo esc_html($stage['bottleneck']); ?></small>
                    </div>
                <?php endforeach; ?>
            </div>
        </article>
        <?php
    }

    /**
     * @param array<int,array{trigger:string,action:string}> $chain
     */
    private function render_automation_chain(array $chain): void
    {
        ?>
        <article id="automation" class="algq-reporting-engine algq-automation-chain">
            <div class="algq-panel-header">
                <div>
                    <p class="algq-command-eyebrow"><?php esc_html_e('Automation Center', 'algq-command-center'); ?></p>
                    <h3><?php esc_html_e('Lead-to-Close Workflow Chain', 'algq-command-center'); ?></h3>
                </div>
                <span><?php esc_html_e('Rule-ready', 'algq-command-center'); ?></span>
            </div>
            <ol>
                <?php foreach ($chain as $step) : ?>
                    <li><strong><?php echo esc_html($step['trigger']); ?></strong><span>→</span><?php echo esc_html($step['action']); ?></li>
                <?php endforeach; ?>
            </ol>
        </article>
        <?php
    }

    /**
     * @param array<int,array{name:string,cadence:string,source:string}> $reports
     */
    private function render_intelligence_layer(array $reports): void
    {
        ?>
        <article id="reports" class="algq-reporting-engine">
            <div class="algq-panel-header">
                <div>
                    <p class="algq-command-eyebrow"><?php esc_html_e('Executive Intelligence Layer', 'algq-command-center'); ?></p>
                    <h3><?php esc_html_e('Operating Summaries', 'algq-command-center'); ?></h3>
                </div>
                <span><?php esc_html_e('Reporting engine', 'algq-command-center'); ?></span>
            </div>
            <div class="algq-report-grid">
                <?php foreach ($reports as $report) : ?>
                    <article>
                        <strong><?php echo esc_html($report['name']); ?></strong>
                        <span><?php echo esc_html($report['cadence']); ?></span>
                        <small><?php echo esc_html($report['source']); ?></small>
                    </article>
                <?php endforeach; ?>
            </div>
        </article>
        <?php
    }

    /**
     * @param array<int,array{assistant:string,capabilities:array<int,string>}> $assistants
     */
    private function render_ai_layer(array $assistants): void
    {
        ?>
        <article class="algq-reporting-engine algq-ai-layer">
            <div class="algq-panel-header">
                <div>
                    <p class="algq-command-eyebrow"><?php esc_html_e('AI Command Layer', 'algq-command-center'); ?></p>
                    <h3><?php esc_html_e('Future Assistant Readiness', 'algq-command-center'); ?></h3>
                </div>
                <span><?php esc_html_e('Future', 'algq-command-center'); ?></span>
            </div>
            <div class="algq-report-grid">
                <?php foreach ($assistants as $assistant) : ?>
                    <article>
                        <strong><?php echo esc_html($assistant['assistant']); ?></strong>
                        <ul>
                            <?php foreach ($assistant['capabilities'] as $capability) : ?>
                                <li><?php echo esc_html($capability); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </article>
                <?php endforeach; ?>
            </div>
        </article>
        <?php
    }

    private function render_styles(): void
    {
        ?>
        <style>
            .algq-command-center{margin:18px 0;color:#172033}.algq-command-hero{display:flex;gap:16px;justify-content:space-between;align-items:flex-start;padding:22px;border:1px solid #d9e2ef;border-radius:20px;background:linear-gradient(135deg,#f8fbff,#edf4ff)}.algq-command-eyebrow{margin:0 0 6px;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#45607f}.algq-command-hero h2{margin:0 0 8px;font-size:30px;line-height:1.1}.algq-command-hero p{margin:0;max-width:860px;color:#4b5870}.algq-command-status,.algq-panel-header span{display:inline-flex;white-space:nowrap;border-radius:999px;background:#0f766e;color:#fff;padding:7px 12px;font-weight:800;font-size:12px}.algq-command-nav{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}.algq-command-nav a,.algq-action-grid a{display:inline-flex;text-decoration:none;border-radius:999px;border:1px solid #cbd7e8;background:#fff;color:#1e3a5f;padding:8px 11px;font-weight:800;font-size:12px}.algq-command-nav a:hover,.algq-action-grid a:hover{border-color:#0f766e;color:#0f766e}.algq-kpi-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:14px 0}.algq-kpi-card,.algq-command-panel,.algq-reporting-engine,.algq-financial-snapshot{border:1px solid #d9e2ef;border-radius:16px;background:#fff;padding:16px;box-shadow:0 10px 24px rgba(20,39,67,.06)}.algq-kpi-card span,.algq-kpi-card small{display:block;color:#64748b}.algq-kpi-card strong{display:block;margin:6px 0;font-size:24px;color:#0f172a}.algq-financial-snapshot{margin-bottom:14px}.algq-financial-snapshot h3,.algq-panel-header h3,.algq-reporting-engine h3{margin:0}.algq-snapshot-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:12px}.algq-snapshot-grid div,.algq-stage-grid div{border:1px solid #e5edf6;border-radius:12px;background:#f8fafc;padding:12px}.algq-snapshot-grid span,.algq-snapshot-grid strong{display:block}.algq-snapshot-grid span{color:#64748b}.algq-snapshot-grid strong{margin-top:4px;color:#0f172a}.algq-command-panels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.algq-command-module{scroll-margin-top:24px}.algq-panel-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px}.algq-command-list{margin:0}.algq-command-list div{display:flex;justify-content:space-between;gap:14px;padding:9px 0;border-top:1px solid #edf2f7}.algq-command-list div:first-child{border-top:0}.algq-command-list dt{color:#64748b}.algq-command-list dd{margin:0;font-weight:800;text-align:right}.algq-chip-list{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.algq-chip-list span{border-radius:999px;background:#eef6ff;color:#27496d;padding:5px 9px;font-size:12px;font-weight:700}.algq-action-grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.algq-reporting-engine{margin-top:14px}.algq-report-grid,.algq-stage-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.algq-report-grid article{border:1px solid #e5edf6;border-radius:12px;padding:12px;background:#f8fafc}.algq-report-grid strong,.algq-report-grid span,.algq-report-grid small,.algq-stage-grid strong,.algq-stage-grid span,.algq-stage-grid small{display:block}.algq-report-grid span,.algq-stage-grid span{margin:5px 0;color:#475569}.algq-report-grid small,.algq-stage-grid small{color:#64748b}.algq-automation-chain ol{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.algq-automation-chain li{display:flex;gap:8px;align-items:center;border:1px solid #e5edf6;border-radius:12px;background:#f8fafc;padding:10px}.algq-ai-layer ul{margin:8px 0 0 18px;padding:0;color:#475569}@media (max-width:1100px){.algq-kpi-grid,.algq-snapshot-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.algq-command-panels,.algq-report-grid,.algq-stage-grid,.algq-automation-chain ol{grid-template-columns:1fr}}@media (max-width:700px){.algq-kpi-grid,.algq-snapshot-grid{grid-template-columns:1fr}.algq-command-hero,.algq-panel-header{display:block}.algq-command-status,.algq-panel-header span{margin-top:12px}.algq-command-list div{display:block}.algq-command-list dd{text-align:left;margin-top:3px}}
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
        $deal_metrics = $this->get_deal_metrics();
        $buyer_metrics = $this->get_buyer_metrics();
        $funding_metrics = $this->get_funding_metrics();
        $funding_requests = isset($funding_metrics[2]['value']) ? (string) $funding_metrics[2]['value'] : '—';
        $revenue_metrics = $this->get_revenue_metrics();
        $financial_snapshot = $this->get_financial_snapshot($pipeline, $buyer_metrics, $revenue_metrics);

        return [
            'system_status' => $this->table_exists(self::DEALS_TABLE) ? __('Live data connected', 'algq-command-center') : __('Awaiting data sources', 'algq-command-center'),
            'kpis' => [
                ['label' => __('Total Leads', 'algq-command-center'), 'value' => $deal_metrics['total_leads'], 'detail' => __('Captured seller opportunities', 'algq-command-center')],
                ['label' => __('Active Deals', 'algq-command-center'), 'value' => $deal_metrics['active_deals'], 'detail' => __('Deals still moving', 'algq-command-center')],
                ['label' => __('Underwriting Queue', 'algq-command-center'), 'value' => $deal_metrics['underwriting_queue'], 'detail' => __('Awaiting MAO analysis', 'algq-command-center')],
                ['label' => __('Offers Sent', 'algq-command-center'), 'value' => $deal_metrics['offers_sent'], 'detail' => __('Delivered seller offers', 'algq-command-center')],
                ['label' => __('Contracts Executed', 'algq-command-center'), 'value' => $deal_metrics['contracts_executed'], 'detail' => __('Signed or closed contracts', 'algq-command-center')],
                ['label' => __('Buyer Registrations', 'algq-command-center'), 'value' => $buyer_metrics['buyer_registrations'], 'detail' => __('Portal users and buyer profiles', 'algq-command-center')],
                ['label' => __('Active Investors', 'algq-command-center'), 'value' => $buyer_metrics['active_investors'], 'detail' => __('Investor-tagged buyers', 'algq-command-center')],
                ['label' => __('Funding Requests', 'algq-command-center'), 'value' => $funding_requests, 'detail' => __('Open capital requests', 'algq-command-center')],
                ['label' => __('Open Tasks', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_open_tasks', '0'), 'detail' => __('Operational tasks due', 'algq-command-center')],
                ['label' => __('Monthly Revenue', 'algq-command-center'), 'value' => $revenue_metrics['monthly_revenue'], 'detail' => __('WooCommerce and platform sales', 'algq-command-center')],
                ['label' => __('Annual Revenue', 'algq-command-center'), 'value' => $revenue_metrics['annual_revenue'], 'detail' => __('Trailing or projected revenue', 'algq-command-center')],
                ['label' => __('Cash Available', 'algq-command-center'), 'value' => $buyer_metrics['cash_available'], 'detail' => __('Declared buyer/investor capital', 'algq-command-center')],
            ],
            'pipeline' => $pipeline,
            'deal_metrics' => $deal_metrics,
            'buyer_metrics' => $buyer_metrics,
            'funding_metrics' => $funding_metrics,
            'revenue_metrics' => $revenue_metrics,
            'financial_snapshot' => $financial_snapshot,
            'stage_metrics' => $this->get_stage_metrics(),
            'automation_chain' => $this->get_automation_chain(),
            'intelligence' => $this->get_intelligence_reports(),
            'ai_layer' => $this->get_ai_layer(),
        ];
    }

    /**
     * @param array<string,mixed> $metrics
     * @return array<int,array<string,mixed>>
     */
    private function get_command_sections(array $metrics): array
    {
        $deal_metrics = $metrics['deal_metrics'];
        $buyer_metrics = $metrics['buyer_metrics'];
        $revenue_metrics = $metrics['revenue_metrics'];
        $funding_metrics = $metrics['funding_metrics'];

        $sections = [
            [
                'eyebrow' => __('Acquisition Command Panel', 'algq-command-center'),
                'title' => __('Acquisition', 'algq-command-center'),
                'status' => __('Lead control', 'algq-command-center'),
                'metrics' => [
                    ['label' => __('New Leads Today', 'algq-command-center'), 'value' => $deal_metrics['new_leads_today']],
                    ['label' => __('Leads This Week', 'algq-command-center'), 'value' => $deal_metrics['leads_this_week']],
                    ['label' => __('Leads This Month', 'algq-command-center'), 'value' => $deal_metrics['leads_this_month']],
                    ['label' => __('Lead Sources', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_lead_sources', __('Direct / Form / Referral', 'algq-command-center'))],
                    ['label' => __('Conversion Rates', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_conversion_rate', '0%')],
                    ['label' => __('New Submissions', 'algq-command-center'), 'value' => $deal_metrics['new_submissions']],
                    ['label' => __('Hot Leads', 'algq-command-center'), 'value' => $deal_metrics['hot_leads']],
                    ['label' => __('Follow-Ups Due', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_followups_due', '0')],
                    ['label' => __('Appointments Scheduled', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_appointments', '0')],
                ],
                'actions' => $this->make_actions([
                    ['Create Lead', 'admin.php?page=algq-deal-intake'],
                    ['Launch Intake Form', 'admin.php?page=algq-deal-intake'],
                    ['Assign Acquisition Manager', 'admin.php?page=algq-pipeline-crm'],
                    ['Generate Follow-Up Sequence', 'admin.php?page=algq-automation-engine'],
                ]),
            ],
            [
                'eyebrow' => __('Underwriting Command Panel', 'algq-command-center'),
                'title' => __('Underwriting', 'algq-command-center'),
                'status' => __('MAO engine', 'algq-command-center'),
                'metrics' => [
                    ['label' => __('Deals Awaiting Analysis', 'algq-command-center'), 'value' => $deal_metrics['underwriting_queue']],
                    ['label' => __('Average MAO', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_average_mao', '—')],
                    ['label' => __('Average Spread', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_average_spread', '—')],
                    ['label' => __('High-Risk Deals', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_high_risk_deals', '0')],
                ],
                'actions' => $this->make_actions([
                    ['Open MAO Engine', 'admin.php?page=algq-mao-engine'],
                    ['Generate Underwriting Report', 'admin.php?page=algq-mao-engine'],
                    ['Export Package', 'admin.php?page=algq-document-library'],
                    ['Send to Offer Generator', 'admin.php?page=algq-offer-generator'],
                ]),
            ],
            [
                'eyebrow' => __('Offer Generation Center', 'algq-command-center'),
                'title' => __('Offers', 'algq-command-center'),
                'status' => __('Seller offers', 'algq-command-center'),
                'metrics' => [
                    ['label' => __('Offers Generated', 'algq-command-center'), 'value' => $deal_metrics['offers_sent']],
                    ['label' => __('Offers Delivered', 'algq-command-center'), 'value' => $deal_metrics['offers_sent']],
                    ['label' => __('Offers Accepted', 'algq-command-center'), 'value' => $deal_metrics['contracts_executed']],
                    ['label' => __('Offers Rejected', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_offers_rejected', '0')],
                ],
                'actions' => $this->make_actions([
                    ['Create Offer', 'admin.php?page=algq-offer-generator'],
                    ['Generate Subject-To Offer', 'admin.php?page=algq-offer-generator'],
                    ['Generate Cash Offer', 'admin.php?page=algq-offer-generator'],
                    ['Generate Seller Finance Offer', 'admin.php?page=algq-offer-generator'],
                    ['Generate Lease Option Offer', 'admin.php?page=algq-offer-generator'],
                ]),
            ],
            [
                'eyebrow' => __('Pipeline Operations Center', 'algq-command-center'),
                'title' => __('Pipeline', 'algq-command-center'),
                'status' => __('Deal control', 'algq-command-center'),
                'metrics' => [
                    ['label' => __('Deals Per Stage', 'algq-command-center'), 'value' => $deal_metrics['active_deals']],
                    ['label' => __('Days in Stage', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_days_in_stage', '—')],
                    ['label' => __('Bottlenecks', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_bottlenecks', __('Underwriting / Funding', 'algq-command-center'))],
                    ['label' => __('Close Rate', 'algq-command-center'), 'value' => $deal_metrics['close_rate']],
                ],
                'actions' => $this->make_actions([
                    ['Move Deal', 'admin.php?page=algq-pipeline-crm'],
                    ['Assign User', 'admin.php?page=algq-pipeline-crm'],
                    ['Create Task', 'admin.php?page=algq-pipeline-crm'],
                    ['Escalate', 'admin.php?page=algq-pipeline-crm'],
                ]),
            ],
            [
                'eyebrow' => __('Buyer Portal Center', 'algq-command-center'),
                'title' => __('Buyers', 'algq-command-center'),
                'status' => __('Distribution', 'algq-command-center'),
                'metrics' => [
                    ['label' => __('Registered Buyers', 'algq-command-center'), 'value' => $buyer_metrics['buyer_registrations']],
                    ['label' => __('Verified Buyers', 'algq-command-center'), 'value' => $buyer_metrics['verified_buyers']],
                    ['label' => __('NDAs Signed', 'algq-command-center'), 'value' => $buyer_metrics['nda_buyers']],
                    ['label' => __('Active Interests', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_active_interests', '0')],
                    ['label' => __('Downloads', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_buyer_downloads', '0')],
                ],
                'actions' => $this->make_actions([
                    ['Approve Buyer', 'admin.php?page=algq-buyer-portal'],
                    ['Revoke Access', 'admin.php?page=algq-buyer-portal'],
                    ['Publish Deal', 'admin.php?page=algq-marketplace'],
                    ['Send Opportunity Blast', 'admin.php?page=algq-automation-engine'],
                ]),
            ],
            [
                'eyebrow' => __('Funding Command Center', 'algq-command-center'),
                'title' => __('Funding', 'algq-command-center'),
                'status' => __('Capital desk', 'algq-command-center'),
                'metrics' => $funding_metrics,
                'categories' => [__('Contact Information', 'algq-command-center'), __('Funding Preferences', 'algq-command-center'), __('Interest Rates', 'algq-command-center'), __('Funding Limits', 'algq-command-center'), __('Relationship Status', 'algq-command-center')],
                'actions' => $this->make_actions([
                    ['Submit Funding Request', 'admin.php?page=algq-funding-tracker'],
                    ['Create Investor Packet', 'admin.php?page=algq-document-library'],
                    ['Generate Funding Report', 'admin.php?page=algq-command-center'],
                ]),
            ],
            [
                'eyebrow' => __('Marketplace Center', 'algq-command-center'),
                'title' => __('Marketplace', 'algq-command-center'),
                'status' => __('Monetization', 'algq-command-center'),
                'metrics' => [
                    ['label' => __('Active Listings', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_active_listings', '0')],
                    ['label' => __('Marketplace Revenue', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_marketplace_revenue', '$0')],
                    ['label' => __('Listing Fees', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_listing_fees', '$0')],
                    ['label' => __('Buyer Activity', 'algq-command-center'), 'value' => $buyer_metrics['verified_buyers']],
                ],
                'categories' => [__('Wholesale Deals', 'algq-command-center'), __('Rentals', 'algq-command-center'), __('Fix & Flip', 'algq-command-center'), __('Notes', 'algq-command-center'), __('Digital Products', 'algq-command-center'), __('Services', 'algq-command-center')],
                'actions' => $this->make_actions([
                    ['Publish Listing', 'admin.php?page=algq-marketplace'],
                    ['Feature Deal', 'admin.php?page=algq-marketplace'],
                    ['Review Buyer Activity', 'admin.php?page=algq-marketplace'],
                ]),
            ],
            [
                'eyebrow' => __('Revenue Systems Center', 'algq-command-center'),
                'title' => __('Revenue', 'algq-command-center'),
                'status' => __('WooCommerce', 'algq-command-center'),
                'metrics' => [
                    ['label' => __('Orders Today', 'algq-command-center'), 'value' => $revenue_metrics['orders_today']],
                    ['label' => __('Monthly Sales', 'algq-command-center'), 'value' => $revenue_metrics['monthly_revenue']],
                    ['label' => __('Recurring Revenue', 'algq-command-center'), 'value' => $revenue_metrics['recurring_revenue']],
                    ['label' => __('Refunds', 'algq-command-center'), 'value' => $revenue_metrics['refunds']],
                    ['label' => __('Subscription Revenue', 'algq-command-center'), 'value' => $revenue_metrics['subscription_revenue']],
                ],
                'categories' => [__('Plugin Licenses', 'algq-command-center'), __('Contract Packs', 'algq-command-center'), __('SOP Packs', 'algq-command-center'), __('AI Prompt Packs', 'algq-command-center'), __('Templates', 'algq-command-center'), __('Calculators', 'algq-command-center')],
                'actions' => $this->make_actions([
                    ['Create Product', 'admin.php?page=algq-revenue-systems'],
                    ['Issue License', 'admin.php?page=algq-revenue-systems'],
                    ['View Customers', 'admin.php?page=wc-admin&path=/customers'],
                ]),
            ],
            [
                'eyebrow' => __('Document Center', 'algq-command-center'),
                'title' => __('Documents', 'algq-command-center'),
                'status' => __('Records', 'algq-command-center'),
                'metrics' => [
                    ['label' => __('Documents Generated', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_documents_generated', '0')],
                    ['label' => __('Documents Signed', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_documents_signed', '0')],
                    ['label' => __('Documents Pending', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_documents_pending', '0')],
                    ['label' => __('Archived Documents', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_documents_archived', '0')],
                ],
                'categories' => [__('Acquisition', 'algq-command-center'), __('Disposition', 'algq-command-center'), __('Funding', 'algq-command-center'), __('Compliance', 'algq-command-center'), __('Operations', 'algq-command-center')],
                'actions' => $this->make_actions([
                    ['Generate PDF', 'admin.php?page=algq-document-library'],
                    ['Request Signature', 'admin.php?page=algq-pdf-signature'],
                    ['Archive Document', 'admin.php?page=algq-document-library'],
                ]),
            ],
            [
                'eyebrow' => __('Automation Center', 'algq-command-center'),
                'title' => __('Automation', 'algq-command-center'),
                'status' => __('Workflow engine', 'algq-command-center'),
                'metrics' => [
                    ['label' => __('Active Workflows', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_active_workflows', '0')],
                    ['label' => __('Successful Automations', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_successful_automations', '0')],
                    ['label' => __('Failed Automations', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_failed_automations', '0')],
                    ['label' => __('Time Saved', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_time_saved', '0 hrs')],
                ],
                'actions' => $this->make_actions([
                    ['Create Rule', 'admin.php?page=algq-automation-engine'],
                    ['Edit Rule', 'admin.php?page=algq-automation-engine'],
                    ['Pause Rule', 'admin.php?page=algq-automation-engine'],
                    ['View Logs', 'admin.php?page=algq-automation-engine'],
                ]),
            ],
            [
                'eyebrow' => __('Technology Division Center', 'algq-command-center'),
                'title' => __('Technology', 'algq-command-center'),
                'status' => __('R&D operations', 'algq-command-center'),
                'metrics' => [
                    ['label' => __('Open Codex Tasks', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_open_codex_tasks', '0')],
                    ['label' => __('Completed Tasks', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_completed_tasks', '0')],
                    ['label' => __('Commits', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_commits', '0')],
                    ['label' => __('Pull Requests', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_pull_requests', '0')],
                    ['label' => __('Releases', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_releases', '0')],
                    ['label' => __('Development Hours', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_development_hours', '0')],
                    ['label' => __('Contractor Costs', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_contractor_costs', '$0')],
                    ['label' => __('AI Costs', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_ai_costs', '$0')],
                    ['label' => __('SaaS Costs', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_saas_costs', '$0')],
                    ['label' => __('Cloud Costs', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_cloud_costs', '$0')],
                ],
                'categories' => [__('Development Logs', 'algq-command-center'), __('Testing Logs', 'algq-command-center'), __('Release Notes', 'algq-command-center'), __('Roadmaps', 'algq-command-center')],
                'actions' => $this->make_actions([
                    ['Open Roadmap', 'admin.php?page=algq-command-center'],
                    ['Log Development Work', 'admin.php?page=algq-command-center'],
                    ['Review Release Notes', 'admin.php?page=algq-command-center'],
                ]),
            ],
            [
                'eyebrow' => __('Compliance & Risk Center', 'algq-command-center'),
                'title' => __('Compliance', 'algq-command-center'),
                'status' => __('Risk control', 'algq-command-center'),
                'metrics' => [
                    ['label' => __('Outstanding Compliance Tasks', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_compliance_tasks', '0')],
                    ['label' => __('Missing Documents', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_missing_documents', '0')],
                    ['label' => __('Contract Expirations', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_contract_expirations', '0')],
                    ['label' => __('Insurance Renewals', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_insurance_renewals', '0')],
                ],
                'actions' => $this->make_actions([
                    ['Run Audit', 'admin.php?page=algq-command-center'],
                    ['Generate Compliance Report', 'admin.php?page=algq-command-center'],
                    ['Export Records', 'admin.php?page=algq-document-library'],
                ]),
            ],
        ];

        /**
         * Allows companion modules to add, remove, or reorder command-center modules.
         *
         * @param array<int,array<string,mixed>> $sections
         * @param array<string,mixed> $metrics
         */
        $filtered = apply_filters('algq_command_center_sections', $sections, $metrics);
        return is_array($filtered) ? $filtered : $sections;
    }

    /**
     * @return array<int,string>
     */
    private function get_navigation_items(): array
    {
        return [
            __('Executive', 'algq-command-center'),
            __('Acquisition', 'algq-command-center'),
            __('Underwriting', 'algq-command-center'),
            __('Offers', 'algq-command-center'),
            __('Pipeline', 'algq-command-center'),
            __('Buyers', 'algq-command-center'),
            __('Funding', 'algq-command-center'),
            __('Marketplace', 'algq-command-center'),
            __('Revenue', 'algq-command-center'),
            __('Documents', 'algq-command-center'),
            __('Automation', 'algq-command-center'),
            __('Technology', 'algq-command-center'),
            __('Compliance', 'algq-command-center'),
            __('Reports', 'algq-command-center'),
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
     * @return array<string,string>
     */
    private function get_deal_metrics(): array
    {
        if (!$this->table_exists(self::DEALS_TABLE)) {
            return [
                'active_deals' => '0',
                'total_leads' => '0',
                'underwriting_queue' => '0',
                'offers_sent' => '0',
                'contracts_executed' => '0',
                'new_leads_today' => '0',
                'leads_this_week' => '0',
                'leads_this_month' => '0',
                'new_submissions' => '0',
                'hot_leads' => '0',
                'close_rate' => '0%',
            ];
        }

        global $wpdb;
        $table = $wpdb->prefix . self::DEALS_TABLE;
        $active = $this->count_deals_by_statuses(self::ACTIVE_DEAL_STATUSES);
        $total = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table}");
        $underwriting = $this->count_deals_by_statuses(['underwriting']);
        $status_offers = $this->count_deals_by_statuses(['offer_sent', 'negotiating']);
        $activity_offers = $this->get_offer_activity_count();
        $offers = max($status_offers, $activity_offers);
        $contracts = $this->count_deals_by_statuses(['under_contract', 'contract_executed', 'buyer_assigned', 'funding', 'closing', 'closed']);
        $closed = $this->count_deals_by_statuses(['closed']);
        $close_rate = $total > 0 ? round(($closed / $total) * 100) . '%' : '0%';

        return [
            'active_deals' => (string) $active,
            'total_leads' => (string) $total,
            'underwriting_queue' => (string) $underwriting,
            'offers_sent' => (string) $offers,
            'contracts_executed' => (string) $contracts,
            'new_leads_today' => (string) $this->count_recent_deals('today'),
            'leads_this_week' => (string) $this->count_recent_deals('week'),
            'leads_this_month' => (string) $this->count_recent_deals('month'),
            'new_submissions' => (string) $this->count_deals_by_statuses(['new', 'lead', 'lead_captured']),
            'hot_leads' => (string) $this->count_deals_by_statuses(['qualified', 'hot']),
            'close_rate' => $close_rate,
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
            ['label' => __('Available Capital', 'algq-command-center'), 'value' => __('Needs module connection', 'algq-command-center')],
            ['label' => __('Active Lenders', 'algq-command-center'), 'value' => '—'],
            ['label' => __('Funding Requests', 'algq-command-center'), 'value' => '—'],
            ['label' => __('Average Funding Time', 'algq-command-center'), 'value' => '—'],
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
     * @return array<string,string>
     */
    private function get_buyer_metrics(): array
    {
        global $wpdb;
        $buyer_registrations = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(DISTINCT user_id) FROM {$wpdb->usermeta} WHERE meta_key IN (%s, %s, %s, %s) AND meta_value <> ''", 'algq_markets', 'algq_buy_box', 'algq_property_types', 'algq_cash_available'));
        $nda_buyers = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(DISTINCT user_id) FROM {$wpdb->usermeta} WHERE meta_key = %s AND meta_value = %s", 'algq_nda_accepted', 'yes'));
        $verified_buyers = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(DISTINCT user_id) FROM {$wpdb->usermeta} WHERE meta_key = %s AND meta_value IN (%s, %s)", 'algq_buyer_verified', 'yes', '1'));
        $active_investors = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(DISTINCT user_id) FROM {$wpdb->usermeta} WHERE meta_key IN (%s, %s) AND meta_value LIKE %s", 'algq_buyer_type', 'algq_property_types', '%invest%'));
        $cash_available = (float) $wpdb->get_var($wpdb->prepare("SELECT COALESCE(SUM(CAST(meta_value AS DECIMAL(14,2))), 0) FROM {$wpdb->usermeta} WHERE meta_key = %s", 'algq_cash_available'));

        return [
            'buyer_registrations' => (string) $buyer_registrations,
            'nda_buyers' => (string) $nda_buyers,
            'verified_buyers' => (string) $verified_buyers,
            'active_investors' => (string) $active_investors,
            'cash_available' => $this->format_currency($cash_available),
        ];
    }

    /**
     * @return array<string,string>
     */
    private function get_revenue_metrics(): array
    {
        $fallback = [
            'orders_today' => '0',
            'monthly_revenue' => '$0',
            'annual_revenue' => '$0',
            'recurring_revenue' => '$0',
            'refunds' => '$0',
            'subscription_revenue' => '$0',
        ];

        /**
         * Allows WooCommerce/revenue modules to provide live sales metrics.
         *
         * @param array<string,string> $fallback
         */
        $filtered = apply_filters('algq_command_center_revenue_metrics', $fallback);
        return is_array($filtered) ? array_merge($fallback, $filtered) : $fallback;
    }

    /**
     * @param array<int,array{label:string,value:string}> $pipeline
     * @param array<string,string> $buyer_metrics
     * @param array<string,string> $revenue_metrics
     * @return array<int,array{label:string,value:string}>
     */
    private function get_financial_snapshot(array $pipeline, array $buyer_metrics, array $revenue_metrics): array
    {
        $snapshot = [
            ['label' => __('Pipeline Value', 'algq-command-center'), 'value' => $pipeline[0]['value']],
            ['label' => __('Expected Assignment Revenue', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_expected_assignment_revenue', '$0')],
            ['label' => __('Expected Rental Income', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_expected_rental_income', '$0')],
            ['label' => __('Expected Flip Profit', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_expected_flip_profit', '$0')],
            ['label' => __('Acquisition Budget', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_acquisition_budget', $buyer_metrics['cash_available'])],
            ['label' => __('Marketing Spend', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_marketing_spend', '$0')],
            ['label' => __('Technology Spend', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_technology_spend', '$0')],
            ['label' => __('R&D Spend', 'algq-command-center'), 'value' => $this->filter_metric('algq_command_center_rd_spend', '$0')],
        ];

        /**
         * Allows finance modules to replace or extend executive snapshot rows.
         *
         * @param array<int,array{label:string,value:string}> $snapshot
         * @param array<string,string> $revenue_metrics
         */
        $filtered = apply_filters('algq_command_center_financial_snapshot', $snapshot, $revenue_metrics);
        return is_array($filtered) ? $filtered : $snapshot;
    }

    /**
     * @return array<int,array{stage:string,count:string,days:string,bottleneck:string}>
     */
    private function get_stage_metrics(): array
    {
        $stages = [];
        foreach (self::PIPELINE_STAGES as $stage) {
            $status = sanitize_title($stage);
            $status = str_replace('-', '_', $status);
            $stages[] = [
                'stage' => $stage,
                'count' => (string) $this->count_deals_by_statuses([$status]),
                'days' => $this->filter_metric('algq_command_center_stage_days_' . $status, __('Days: —', 'algq-command-center')),
                'bottleneck' => $this->filter_metric('algq_command_center_stage_bottleneck_' . $status, __('No alert', 'algq-command-center')),
            ];
        }

        /**
         * Allows Pipeline CRM to provide live per-stage counts, days, and bottlenecks.
         *
         * @param array<int,array{stage:string,count:string,days:string,bottleneck:string}> $stages
         */
        $filtered = apply_filters('algq_command_center_stage_metrics', $stages);
        return is_array($filtered) ? $filtered : $stages;
    }

    /**
     * @return array<int,array{trigger:string,action:string}>
     */
    private function get_automation_chain(): array
    {
        return [
            ['trigger' => __('Lead Submitted', 'algq-command-center'), 'action' => __('Create Deal', 'algq-command-center')],
            ['trigger' => __('Deal Created', 'algq-command-center'), 'action' => __('Run MAO', 'algq-command-center')],
            ['trigger' => __('MAO Completed', 'algq-command-center'), 'action' => __('Generate Offer', 'algq-command-center')],
            ['trigger' => __('Offer Accepted', 'algq-command-center'), 'action' => __('Generate Contract', 'algq-command-center')],
            ['trigger' => __('Contract Signed', 'algq-command-center'), 'action' => __('Notify Buyers', 'algq-command-center')],
            ['trigger' => __('Deal Closed', 'algq-command-center'), 'action' => __('Update Dashboard', 'algq-command-center')],
        ];
    }

    /**
     * @return array<int,array{name:string,cadence:string,source:string}>
     */
    private function get_intelligence_reports(): array
    {
        return [
            ['name' => __('Daily Summary', 'algq-command-center'), 'cadence' => __('New leads, deals added, revenue generated, tasks due, and funding updates.', 'algq-command-center'), 'source' => __('Acquisition, revenue, tasks, funding', 'algq-command-center')],
            ['name' => __('Weekly Summary', 'algq-command-center'), 'cadence' => __('Conversion rates, pipeline changes, revenue trends, and technology progress.', 'algq-command-center'), 'source' => __('Pipeline, offers, revenue, technology', 'algq-command-center')],
            ['name' => __('Monthly Summary', 'algq-command-center'), 'cadence' => __('Acquisition performance, revenue performance, technology ROI, and investor activity.', 'algq-command-center'), 'source' => __('Executive KPI and investor reporting', 'algq-command-center')],
        ];
    }

    /**
     * @return array<int,array{assistant:string,capabilities:array<int,string>}>
     */
    private function get_ai_layer(): array
    {
        return [
            ['assistant' => __('AI Acquisition Assistant', 'algq-command-center'), 'capabilities' => [__('Scores leads', 'algq-command-center'), __('Recommends offers', 'algq-command-center'), __('Generates follow-ups', 'algq-command-center')]],
            ['assistant' => __('AI Operations Assistant', 'algq-command-center'), 'capabilities' => [__('Monitors pipeline', 'algq-command-center'), __('Detects bottlenecks', 'algq-command-center'), __('Suggests actions', 'algq-command-center')]],
            ['assistant' => __('AI Executive Assistant', 'algq-command-center'), 'capabilities' => [__('Creates reports', 'algq-command-center'), __('Forecasts revenue', 'algq-command-center'), __('Summarizes business performance', 'algq-command-center')]],
        ];
    }

    /**
     * @param array<int,array{0:string,1:string}> $actions
     * @return array<int,array{label:string,href:string}>
     */
    private function make_actions(array $actions): array
    {
        return array_map(
            function (array $action): array {
                return [
                    'label' => __($action[0], 'algq-command-center'),
                    'href' => $this->admin_action_url($action[1]),
                ];
            },
            $actions
        );
    }

    private function admin_action_url(string $path): string
    {
        if (function_exists('admin_url')) {
            return admin_url($path);
        }

        return '#' . sanitize_title($path);
    }

    private function filter_metric(string $filter, string $fallback): string
    {
        $value = apply_filters($filter, $fallback);
        return is_scalar($value) ? (string) $value : $fallback;
    }

    /**
     * @param string[] $statuses
     */
    private function count_deals_by_statuses(array $statuses): int
    {
        if (!$this->table_exists(self::DEALS_TABLE) || empty($statuses)) {
            return 0;
        }

        global $wpdb;
        $table = $wpdb->prefix . self::DEALS_TABLE;
        $placeholders = implode(',', array_fill(0, count($statuses), '%s'));
        return (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} WHERE status IN ({$placeholders})", $statuses));
    }

    private function count_recent_deals(string $period): int
    {
        if (!$this->table_exists(self::DEALS_TABLE)) {
            return 0;
        }

        global $wpdb;
        $table = $wpdb->prefix . self::DEALS_TABLE;
        $date_column = $this->get_deals_date_column();

        if ('' === $date_column) {
            return 0;
        }

        if ('today' === $period) {
            return (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table} WHERE DATE({$date_column}) = CURDATE()");
        }

        if ('week' === $period) {
            return (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table} WHERE {$date_column} >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
        }

        return (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table} WHERE {$date_column} >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
    }

    private function get_deals_date_column(): string
    {
        global $wpdb;
        $table = $wpdb->prefix . self::DEALS_TABLE;
        $columns = $wpdb->get_col("SHOW COLUMNS FROM {$table}", 0);

        foreach (['created_at', 'submitted_at', 'date_created', 'created'] as $candidate) {
            if (is_array($columns) && in_array($candidate, $columns, true)) {
                return $candidate;
            }
        }

        return '';
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
