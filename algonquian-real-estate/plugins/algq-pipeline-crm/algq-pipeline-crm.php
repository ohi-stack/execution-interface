<?php
/**
 * Plugin Name: Algonquian Pipeline CRM
 * Description: Production deal pipeline Kanban, stage movement, activity logging, notes, assignment tracking, and audit history.
 * Version: 0.2.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-pipeline-crm
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ALGQ_PIPELINE_CRM_VERSION', '0.2.0');
define('ALGQ_PIPELINE_CRM_FILE', __FILE__);
define('ALGQ_PIPELINE_CRM_DIR', plugin_dir_path(__FILE__));
define('ALGQ_PIPELINE_CRM_URL', plugin_dir_url(__FILE__));

final class ALGQ_Pipeline_CRM
{
    private const DEALS_TABLE = 'algq_deals';
    private const PIPELINE_TABLE = 'algq_pipeline_deals';
    private const ACTIVITY_TABLE = 'algq_pipeline_activity';
    private const NOTES_TABLE = 'algq_pipeline_notes';

    private const STAGES = [
        'lead_captured' => 'Lead Captured',
        'underwriting' => 'Underwriting',
        'offer_sent' => 'Offer Sent',
        'under_contract' => 'Under Contract',
        'buyer_assigned' => 'Buyer Assigned',
        'closed' => 'Closed',
        'dead' => 'Dead / Archived',
    ];

    public function __construct()
    {
        add_action('init', [$this, 'register_shortcodes']);
        add_action('admin_menu', [$this, 'register_admin_page']);
        add_action('wp_enqueue_scripts', [$this, 'register_assets']);
        add_action('admin_enqueue_scripts', [$this, 'register_assets']);
        add_action('wp_ajax_algq_pipeline_move_deal', [$this, 'ajax_move_deal']);
        add_action('wp_ajax_algq_pipeline_add_note', [$this, 'ajax_add_note']);
        add_action('wp_ajax_algq_pipeline_assign_deal', [$this, 'ajax_assign_deal']);
        add_action('rest_api_init', [$this, 'register_rest_routes']);
    }

    public static function activate(): void
    {
        global $wpdb;

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();

        dbDelta("CREATE TABLE " . self::table(self::PIPELINE_TABLE) . " (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            deal_id bigint(20) unsigned NOT NULL,
            stage varchar(64) NOT NULL DEFAULT 'lead_captured',
            assigned_user_id bigint(20) unsigned DEFAULT 0,
            priority varchar(32) DEFAULT 'normal',
            last_activity_at datetime NOT NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY deal_id (deal_id),
            KEY stage (stage),
            KEY assigned_user_id (assigned_user_id),
            KEY priority (priority)
        ) {$charset};");

        dbDelta("CREATE TABLE " . self::table(self::ACTIVITY_TABLE) . " (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            deal_id bigint(20) unsigned NOT NULL,
            user_id bigint(20) unsigned DEFAULT 0,
            activity_type varchar(64) NOT NULL,
            old_value text NULL,
            new_value text NULL,
            activity_note text NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY deal_id (deal_id),
            KEY activity_type (activity_type),
            KEY created_at (created_at)
        ) {$charset};");

        dbDelta("CREATE TABLE " . self::table(self::NOTES_TABLE) . " (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            deal_id bigint(20) unsigned NOT NULL,
            user_id bigint(20) unsigned DEFAULT 0,
            note longtext NOT NULL,
            visibility varchar(32) DEFAULT 'internal',
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY deal_id (deal_id),
            KEY user_id (user_id),
            KEY created_at (created_at)
        ) {$charset};");
    }

    public function register_shortcodes(): void
    {
        add_shortcode('algq_pipeline_crm', [$this, 'render_board']);
    }

    public function register_admin_page(): void
    {
        add_menu_page(
            __('Pipeline CRM', 'algq-pipeline-crm'),
            __('Pipeline CRM', 'algq-pipeline-crm'),
            'edit_posts',
            'algq-pipeline-crm',
            [$this, 'render_admin_page'],
            'dashicons-networking',
            27
        );
    }

    public function register_assets(): void
    {
        wp_register_style('algq-pipeline-crm', ALGQ_PIPELINE_CRM_URL . 'assets/css/pipeline-crm.css', [], ALGQ_PIPELINE_CRM_VERSION);
        wp_register_script('algq-pipeline-crm', ALGQ_PIPELINE_CRM_URL . 'assets/js/pipeline-crm.js', [], ALGQ_PIPELINE_CRM_VERSION, true);
    }

    public function register_rest_routes(): void
    {
        register_rest_route('algq/v1', '/pipeline', [
            'methods' => 'GET',
            'callback' => fn () => rest_ensure_response($this->get_pipeline_payload()),
            'permission_callback' => fn () => current_user_can('edit_posts'),
        ]);

        register_rest_route('algq/v1', '/pipeline/(?P<deal_id>\d+)/stage', [
            'methods' => 'POST',
            'callback' => function (WP_REST_Request $request) {
                $result = $this->move_deal((int) $request['deal_id'], sanitize_key((string) $request->get_param('stage')));
                return is_wp_error($result) ? $result : rest_ensure_response($result);
            },
            'permission_callback' => fn () => current_user_can('edit_posts'),
        ]);
    }

    public function render_admin_page(): void
    {
        echo '<div class="wrap"><h1>' . esc_html__('Algonquian Pipeline CRM', 'algq-pipeline-crm') . '</h1>';
        echo $this->render_board();
        echo '</div>';
    }

    public function render_board(): string
    {
        if (!current_user_can('edit_posts')) {
            return '<div class="algq-pipeline-notice">' . esc_html__('You do not have permission to view the pipeline.', 'algq-pipeline-crm') . '</div>';
        }

        wp_enqueue_style('algq-pipeline-crm');
        wp_enqueue_script('algq-pipeline-crm');
        wp_localize_script('algq-pipeline-crm', 'algqPipelineCRM', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('algq_pipeline_crm'),
            'messages' => [
                'saved' => __('Saved.', 'algq-pipeline-crm'),
                'error' => __('Pipeline update failed.', 'algq-pipeline-crm'),
            ],
        ]);

        $payload = $this->get_pipeline_payload();
        ob_start();
        ?>
        <div class="algq-pipeline-crm" data-algq-pipeline>
            <header class="algq-pipeline-header">
                <div>
                    <h2><?php esc_html_e('Deal Pipeline', 'algq-pipeline-crm'); ?></h2>
                    <p><?php esc_html_e('Drag deal cards between stages, assign owners, and capture activity history.', 'algq-pipeline-crm'); ?></p>
                </div>
                <div class="algq-pipeline-kpis">
                    <span><?php echo esc_html(sprintf(__('%d active deals', 'algq-pipeline-crm'), (int) $payload['count'])); ?></span>
                    <span><?php echo esc_html(sprintf(__('Updated %s UTC', 'algq-pipeline-crm'), gmdate('Y-m-d H:i'))); ?></span>
                </div>
            </header>
            <div class="algq-kanban" role="list" aria-label="<?php esc_attr_e('Deal stages', 'algq-pipeline-crm'); ?>">
                <?php foreach (self::STAGES as $stage_key => $stage_label) : ?>
                    <section class="algq-kanban-stage" data-stage="<?php echo esc_attr($stage_key); ?>" role="listitem">
                        <header><h3><?php echo esc_html($stage_label); ?></h3><span><?php echo esc_html((string) count($payload['stages'][$stage_key] ?? [])); ?></span></header>
                        <div class="algq-card-dropzone" data-dropzone="<?php echo esc_attr($stage_key); ?>">
                            <?php foreach ($payload['stages'][$stage_key] ?? [] as $deal) : ?>
                                <?php echo wp_kses_post($this->render_card($deal)); ?>
                            <?php endforeach; ?>
                        </div>
                    </section>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
        return (string) ob_get_clean();
    }

    public function ajax_move_deal(): void
    {
        $this->verify_ajax();
        $result = $this->move_deal((int) ($_POST['deal_id'] ?? 0), sanitize_key((string) ($_POST['stage'] ?? '')));
        $this->send_ajax_result($result);
    }

    public function ajax_add_note(): void
    {
        $this->verify_ajax();
        $deal_id = (int) ($_POST['deal_id'] ?? 0);
        $note = sanitize_textarea_field(wp_unslash($_POST['note'] ?? ''));

        if ($deal_id <= 0 || '' === $note) {
            wp_send_json_error(['message' => __('Deal and note are required.', 'algq-pipeline-crm')], 400);
        }

        global $wpdb;
        $now = self::utc_now();
        $wpdb->insert(self::table(self::NOTES_TABLE), [
            'deal_id' => $deal_id,
            'user_id' => get_current_user_id(),
            'note' => $note,
            'visibility' => 'internal',
            'created_at' => $now,
        ], ['%d', '%d', '%s', '%s', '%s']);
        $this->log_activity($deal_id, 'note_added', '', '', wp_trim_words($note, 18), $now);
        wp_send_json_success(['message' => __('Note added.', 'algq-pipeline-crm')]);
    }

    public function ajax_assign_deal(): void
    {
        $this->verify_ajax();
        $deal_id = (int) ($_POST['deal_id'] ?? 0);
        $assignee = (int) ($_POST['assigned_user_id'] ?? 0);
        if ($deal_id <= 0) {
            wp_send_json_error(['message' => __('Deal is required.', 'algq-pipeline-crm')], 400);
        }
        $result = $this->assign_deal($deal_id, $assignee);
        $this->send_ajax_result($result);
    }

    private function render_card(array $deal): string
    {
        $assignee = $deal['assigned_user_id'] ? get_userdata((int) $deal['assigned_user_id']) : null;
        $notes = $this->get_notes((int) $deal['id'], 2);
        $activity = $this->get_activity((int) $deal['id'], 3);

        ob_start();
        ?>
        <article class="algq-deal-card" draggable="true" data-deal-id="<?php echo esc_attr((string) $deal['id']); ?>">
            <strong><?php echo esc_html($deal['deal_id'] ?: ('Deal #' . $deal['id'])); ?></strong>
            <p><?php echo esc_html($deal['address']); ?></p>
            <dl>
                <dt><?php esc_html_e('Seller', 'algq-pipeline-crm'); ?></dt><dd><?php echo esc_html($deal['seller_name']); ?></dd>
                <dt><?php esc_html_e('Score', 'algq-pipeline-crm'); ?></dt><dd><?php echo esc_html((string) (int) $deal['motivation_score']); ?></dd>
                <dt><?php esc_html_e('Assigned', 'algq-pipeline-crm'); ?></dt><dd><?php echo esc_html($assignee ? $assignee->display_name : __('Unassigned', 'algq-pipeline-crm')); ?></dd>
            </dl>
            <form class="algq-assignment-form">
                <label><?php esc_html_e('Assign owner', 'algq-pipeline-crm'); ?><?php wp_dropdown_users(['name' => 'assigned_user_id', 'selected' => (int) $deal['assigned_user_id'], 'show_option_none' => __('Unassigned', 'algq-pipeline-crm'), 'echo' => true]); ?></label>
                <button type="submit"><?php esc_html_e('Assign', 'algq-pipeline-crm'); ?></button>
            </form>
            <form class="algq-note-form">
                <label><?php esc_html_e('Add note', 'algq-pipeline-crm'); ?><textarea name="note" rows="2"></textarea></label>
                <button type="submit"><?php esc_html_e('Save note', 'algq-pipeline-crm'); ?></button>
            </form>
            <details>
                <summary><?php esc_html_e('Notes & audit history', 'algq-pipeline-crm'); ?></summary>
                <ul>
                    <?php foreach ($notes as $note) : ?><li><?php echo esc_html($note['created_at'] . ' — ' . $note['note']); ?></li><?php endforeach; ?>
                    <?php foreach ($activity as $item) : ?><li><?php echo esc_html($item['created_at'] . ' — ' . $item['activity_note']); ?></li><?php endforeach; ?>
                </ul>
            </details>
        </article>
        <?php
        return (string) ob_get_clean();
    }

    private function get_pipeline_payload(): array
    {
        $deals = $this->get_deals();
        $stages = array_fill_keys(array_keys(self::STAGES), []);
        foreach ($deals as $deal) {
            $stage = isset(self::STAGES[$deal['stage']]) ? $deal['stage'] : 'lead_captured';
            $stages[$stage][] = $deal;
        }
        return [
            'count' => count($deals),
            'stage_labels' => self::STAGES,
            'stages' => $stages,
        ];
    }

    private function get_deals(): array
    {
        global $wpdb;
        if (!$this->table_exists(self::table(self::DEALS_TABLE))) {
            return [];
        }

        $sql = 'SELECT d.*, COALESCE(p.stage, d.status, %s) AS stage, COALESCE(p.assigned_user_id, 0) AS assigned_user_id, COALESCE(p.priority, %s) AS priority, COALESCE(p.last_activity_at, d.updated_at, d.created_at) AS last_activity_at FROM ' . self::table(self::DEALS_TABLE) . ' d LEFT JOIN ' . self::table(self::PIPELINE_TABLE) . ' p ON p.deal_id = d.id ORDER BY last_activity_at DESC LIMIT 200';
        $rows = $wpdb->get_results($wpdb->prepare($sql, 'lead_captured', 'normal'), ARRAY_A);
        return array_map([$this, 'normalize_deal'], $rows ?: []);
    }

    private function move_deal(int $deal_id, string $stage)
    {
        if ($deal_id <= 0 || !isset(self::STAGES[$stage])) {
            return new WP_Error('algq_invalid_stage', __('Valid deal and stage are required.', 'algq-pipeline-crm'), ['status' => 400]);
        }

        $deal = $this->get_deal($deal_id);
        if (!$deal) {
            return new WP_Error('algq_missing_deal', __('Deal not found.', 'algq-pipeline-crm'), ['status' => 404]);
        }

        $old_stage = $deal['stage'];
        $now = self::utc_now();
        $this->upsert_pipeline($deal_id, ['stage' => $stage, 'last_activity_at' => $now, 'updated_at' => $now]);
        $this->sync_deal_status($deal_id, $stage, $now);
        $this->log_activity($deal_id, 'stage_changed', $old_stage, $stage, sprintf('Moved from %s to %s', self::STAGES[$old_stage] ?? $old_stage, self::STAGES[$stage]), $now);
        return ['deal_id' => $deal_id, 'stage' => $stage, 'stage_label' => self::STAGES[$stage]];
    }

    private function assign_deal(int $deal_id, int $assignee)
    {
        if (!$this->get_deal($deal_id)) {
            return new WP_Error('algq_missing_deal', __('Deal not found.', 'algq-pipeline-crm'), ['status' => 404]);
        }
        if ($assignee > 0 && !get_userdata($assignee)) {
            return new WP_Error('algq_missing_user', __('Assigned user not found.', 'algq-pipeline-crm'), ['status' => 404]);
        }

        $now = self::utc_now();
        $old = (int) ($this->get_deal($deal_id)['assigned_user_id'] ?? 0);
        $this->upsert_pipeline($deal_id, ['assigned_user_id' => $assignee, 'last_activity_at' => $now, 'updated_at' => $now]);
        $this->log_activity($deal_id, 'assignment_changed', (string) $old, (string) $assignee, 'Assignment changed', $now);
        return ['deal_id' => $deal_id, 'assigned_user_id' => $assignee];
    }

    private function get_deal(int $deal_id): ?array
    {
        foreach ($this->get_deals() as $deal) {
            if ((int) $deal['id'] === $deal_id) {
                return $deal;
            }
        }
        return null;
    }

    private function upsert_pipeline(int $deal_id, array $fields): void
    {
        global $wpdb;
        $now = self::utc_now();
        $current = $wpdb->get_var($wpdb->prepare('SELECT id FROM ' . self::table(self::PIPELINE_TABLE) . ' WHERE deal_id = %d', $deal_id));
        $defaults = ['deal_id' => $deal_id, 'stage' => 'lead_captured', 'assigned_user_id' => 0, 'priority' => 'normal', 'last_activity_at' => $now, 'created_at' => $now, 'updated_at' => $now];
        $data = array_merge($defaults, $fields);

        if ($current) {
            unset($data['deal_id'], $data['created_at']);
            $wpdb->update(self::table(self::PIPELINE_TABLE), $data, ['deal_id' => $deal_id]);
            return;
        }

        $wpdb->insert(self::table(self::PIPELINE_TABLE), $data);
    }

    private function sync_deal_status(int $deal_id, string $stage, string $now): void
    {
        global $wpdb;
        if ($this->table_exists(self::table(self::DEALS_TABLE))) {
            $wpdb->update(self::table(self::DEALS_TABLE), ['status' => $stage, 'updated_at' => $now], ['id' => $deal_id], ['%s', '%s'], ['%d']);
        }
    }

    private function log_activity(int $deal_id, string $type, string $old, string $new, string $note, ?string $created_at = null): void
    {
        global $wpdb;
        $wpdb->insert(self::table(self::ACTIVITY_TABLE), [
            'deal_id' => $deal_id,
            'user_id' => get_current_user_id(),
            'activity_type' => $type,
            'old_value' => $old,
            'new_value' => $new,
            'activity_note' => $note,
            'created_at' => $created_at ?: self::utc_now(),
        ], ['%d', '%d', '%s', '%s', '%s', '%s', '%s']);
    }

    private function get_notes(int $deal_id, int $limit): array
    {
        global $wpdb;
        return $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . self::table(self::NOTES_TABLE) . ' WHERE deal_id = %d ORDER BY created_at DESC LIMIT %d', $deal_id, $limit), ARRAY_A) ?: [];
    }

    private function get_activity(int $deal_id, int $limit): array
    {
        global $wpdb;
        return $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . self::table(self::ACTIVITY_TABLE) . ' WHERE deal_id = %d ORDER BY created_at DESC LIMIT %d', $deal_id, $limit), ARRAY_A) ?: [];
    }

    private function normalize_deal(array $deal): array
    {
        $stage = sanitize_key((string) ($deal['stage'] ?? 'lead_captured'));
        $deal['stage'] = isset(self::STAGES[$stage]) ? $stage : 'lead_captured';
        $deal['id'] = (int) $deal['id'];
        $deal['assigned_user_id'] = (int) ($deal['assigned_user_id'] ?? 0);
        $deal['motivation_score'] = (int) ($deal['motivation_score'] ?? 0);
        return $deal;
    }

    private function verify_ajax(): void
    {
        if (!current_user_can('edit_posts')) {
            wp_send_json_error(['message' => __('Insufficient permissions.', 'algq-pipeline-crm')], 403);
        }
        check_ajax_referer('algq_pipeline_crm', 'nonce');
    }

    private function send_ajax_result($result): void
    {
        if (is_wp_error($result)) {
            $error_data = $result->get_error_data();
            $status = is_array($error_data) && isset($error_data['status']) ? (int) $error_data['status'] : 400;
            wp_send_json_error(['message' => $result->get_error_message()], $status);
        }
        wp_send_json_success($result);
    }

    private function table_exists(string $table): bool
    {
        global $wpdb;
        return (bool) $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table));
    }

    private static function table(string $table): string
    {
        global $wpdb;
        return $wpdb->prefix . $table;
    }

    private static function utc_now(): string
    {
        return gmdate('Y-m-d H:i:s');
    }
}

register_activation_hook(__FILE__, ['ALGQ_Pipeline_CRM', 'activate']);
new ALGQ_Pipeline_CRM();
