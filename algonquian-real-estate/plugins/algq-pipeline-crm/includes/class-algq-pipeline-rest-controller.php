<?php
/**
 * REST API controller for Pipeline CRM.
 *
 * @package Algonquian_Pipeline_CRM
 */

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Pipeline_REST_Controller extends WP_REST_Controller
{
    protected $namespace = 'algq/v1';
    protected $rest_base = 'pipeline';
    private ALGQ_Pipeline_Database $database;
    private ALGQ_Pipeline_Activity $activity;

    public function __construct(ALGQ_Pipeline_Database $database, ALGQ_Pipeline_Activity $activity)
    {
        $this->database = $database;
        $this->activity = $activity;
    }

    public function register_routes(): void
    {
        register_rest_route($this->namespace, '/' . $this->rest_base . '/deals', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_deals'],
                'permission_callback' => [$this, 'can_view'],
            ],
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'create_deal'],
                'permission_callback' => [$this, 'can_edit'],
            ],
        ]);

        register_rest_route($this->namespace, '/' . $this->rest_base . '/deals/(?P<id>\d+)', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_deal'],
                'permission_callback' => [$this, 'can_view'],
                'args' => ['id' => ['sanitize_callback' => 'absint']],
            ],
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'update_deal'],
                'permission_callback' => [$this, 'can_edit'],
                'args' => ['id' => ['sanitize_callback' => 'absint']],
            ],
        ]);

        register_rest_route($this->namespace, '/' . $this->rest_base . '/deals/(?P<id>\d+)/stage', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [$this, 'update_stage'],
            'permission_callback' => [$this, 'can_edit'],
            'args' => ['id' => ['sanitize_callback' => 'absint']],
        ]);

        register_rest_route($this->namespace, '/' . $this->rest_base . '/activity', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [$this, 'get_activity'],
            'permission_callback' => [$this, 'can_view'],
        ]);

        register_rest_route($this->namespace, '/' . $this->rest_base . '/metrics', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [$this, 'get_metrics'],
            'permission_callback' => [$this, 'can_view'],
        ]);
    }

    public function can_view(): bool
    {
        return current_user_can('algq_view_pipeline');
    }

    public function can_edit(): bool
    {
        return current_user_can('algq_edit_deals') || current_user_can('algq_manage_pipeline');
    }

    public function get_deals(WP_REST_Request $request): WP_REST_Response
    {
        $args = [
            'stage_key' => sanitize_key((string) $request->get_param('stage_key')),
            'status' => sanitize_key((string) $request->get_param('status')),
            'limit' => absint($request->get_param('limit') ?: 200),
        ];

        return rest_ensure_response($this->database->get_deals(array_filter($args)));
    }

    public function create_deal(WP_REST_Request $request)
    {
        $deal_id = $this->database->create_deal($this->sanitize_deal_payload($request));
        if ($deal_id < 1) {
            return new WP_Error('algq_pipeline_create_failed', __('Unable to create deal.', 'algq-pipeline-crm'), ['status' => 500]);
        }

        $deal = $this->database->get_deal($deal_id);
        $this->activity->log($deal_id, 'deal_created', __('Deal created.', 'algq-pipeline-crm'));
        do_action('algq_pipeline_deal_created', $deal_id, $deal);

        return rest_ensure_response($deal)->set_status(201);
    }

    public function get_deal(WP_REST_Request $request)
    {
        $deal = $this->database->get_deal(absint($request['id']));
        if (!$deal) {
            return new WP_Error('algq_pipeline_not_found', __('Deal not found.', 'algq-pipeline-crm'), ['status' => 404]);
        }

        return rest_ensure_response($deal);
    }

    public function update_deal(WP_REST_Request $request)
    {
        $deal_id = absint($request['id']);
        $old_deal = $this->database->get_deal($deal_id);
        if (!$old_deal) {
            return new WP_Error('algq_pipeline_not_found', __('Deal not found.', 'algq-pipeline-crm'), ['status' => 404]);
        }

        $payload = $this->sanitize_deal_payload($request);
        if (array_key_exists('assigned_user_id', $payload) && !current_user_can('algq_assign_deals') && !current_user_can('algq_manage_pipeline')) {
            return new WP_Error('algq_pipeline_assign_forbidden', __('You do not have permission to assign deals.', 'algq-pipeline-crm'), ['status' => 403]);
        }

        $updated = $this->database->update_deal($deal_id, $payload);
        if (!$updated) {
            return new WP_Error('algq_pipeline_update_failed', __('Unable to update deal.', 'algq-pipeline-crm'), ['status' => 500]);
        }

        if (array_key_exists('assigned_user_id', $payload) && (int) $old_deal['assigned_user_id'] !== (int) $payload['assigned_user_id']) {
            $this->activity->assigned_user_changed($deal_id, (int) $old_deal['assigned_user_id'], (int) $payload['assigned_user_id']);
        }

        return rest_ensure_response($this->database->get_deal($deal_id));
    }

    public function update_stage(WP_REST_Request $request)
    {
        $deal_id = absint($request['id']);
        $new_stage = sanitize_key((string) $request->get_param('stage_key'));
        $deal = $this->database->get_deal($deal_id);

        if (!$deal) {
            return new WP_Error('algq_pipeline_not_found', __('Deal not found.', 'algq-pipeline-crm'), ['status' => 404]);
        }

        if (!in_array($new_stage, $this->database->get_stage_keys(), true)) {
            return new WP_Error('algq_pipeline_invalid_stage', __('Invalid stage.', 'algq-pipeline-crm'), ['status' => 400]);
        }

        if ('closed' === $new_stage && !current_user_can('algq_close_deals') && !current_user_can('algq_manage_pipeline')) {
            return new WP_Error('algq_pipeline_close_forbidden', __('You do not have permission to close deals.', 'algq-pipeline-crm'), ['status' => 403]);
        }

        $old_stage = (string) $deal['stage_key'];
        if ($old_stage === $new_stage) {
            return rest_ensure_response($deal);
        }

        $updated = $this->database->update_deal_stage($deal_id, $new_stage);
        if (!$updated) {
            return new WP_Error('algq_pipeline_stage_failed', __('Unable to update deal stage.', 'algq-pipeline-crm'), ['status' => 500]);
        }

        $this->activity->log($deal_id, 'stage_changed', __('Stage changed.', 'algq-pipeline-crm'), $old_stage, $new_stage);
        do_action('algq_pipeline_stage_changed', $deal_id, $old_stage, $new_stage);

        if ('closed' === $new_stage) {
            $this->activity->log($deal_id, 'deal_closed', __('Deal closed.', 'algq-pipeline-crm'), $old_stage, $new_stage);
            do_action('algq_pipeline_deal_closed', $deal_id);
        }

        return rest_ensure_response($this->database->get_deal($deal_id));
    }

    public function get_activity(WP_REST_Request $request): WP_REST_Response
    {
        return rest_ensure_response($this->database->get_activity([
            'deal_id' => absint($request->get_param('deal_id')),
            'limit' => absint($request->get_param('limit') ?: 100),
        ]));
    }

    public function get_metrics(): WP_REST_Response
    {
        return rest_ensure_response($this->database->get_metrics());
    }

    private function sanitize_deal_payload(WP_REST_Request $request): array
    {
        $payload = $request->get_json_params();
        if (!is_array($payload)) {
            $payload = $request->get_params();
        }

        $sanitized = [];
        $text_fields = ['external_id', 'seller_name', 'seller_phone'];
        foreach ($text_fields as $field) {
            if (array_key_exists($field, $payload)) {
                $sanitized[$field] = sanitize_text_field((string) $payload[$field]);
            }
        }

        if (array_key_exists('property_address', $payload)) {
            $sanitized['property_address'] = sanitize_textarea_field((string) $payload['property_address']);
        }

        if (array_key_exists('seller_email', $payload)) {
            $sanitized['seller_email'] = sanitize_email((string) $payload['seller_email']);
        }

        foreach (['stage_key', 'priority', 'status', 'source'] as $field) {
            if (array_key_exists($field, $payload)) {
                $sanitized[$field] = sanitize_key((string) $payload[$field]);
            }
        }

        foreach (['assigned_user_id'] as $field) {
            if (array_key_exists($field, $payload)) {
                $sanitized[$field] = absint($payload[$field]);
            }
        }

        foreach (['asking_price', 'estimated_arv'] as $field) {
            if (array_key_exists($field, $payload)) {
                $sanitized[$field] = '' === $payload[$field] ? null : (float) preg_replace('/[^0-9.\-]/', '', (string) $payload[$field]);
            }
        }

        return $sanitized;
    }
}
