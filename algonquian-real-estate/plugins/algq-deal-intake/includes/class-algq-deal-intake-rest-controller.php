<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Intake_REST_Controller
{
    private ALGQ_Deal_Intake_Repository $repository;
    private ALGQ_Deal_Intake_Validator $validator;
    private ALGQ_Deal_Intake_Scorer $scorer;
    private ALGQ_Deal_Intake_CSV $csv;

    public function __construct(ALGQ_Deal_Intake_Repository $repository, ALGQ_Deal_Intake_Validator $validator, ALGQ_Deal_Intake_Scorer $scorer, ALGQ_Deal_Intake_CSV $csv)
    {
        $this->repository = $repository;
        $this->validator = $validator;
        $this->scorer = $scorer;
        $this->csv = $csv;
    }

    public function register_routes(): void
    {
        register_rest_route('algq/v1', '/deals', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'index'],
                'permission_callback' => [$this, 'can_manage'],
            ],
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'create'],
                'permission_callback' => '__return_true',
            ],
        ]);

        register_rest_route('algq/v1', '/deals/(?P<id>\d+)', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'show'],
                'permission_callback' => [$this, 'can_manage'],
            ],
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'update'],
                'permission_callback' => [$this, 'can_manage'],
            ],
        ]);

        register_rest_route('algq/v1', '/deals/export', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [$this, 'export'],
            'permission_callback' => [$this, 'can_manage'],
        ]);

        register_rest_route('algq/v1', '/deals/import', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [$this, 'import'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
    }

    public function index(WP_REST_Request $request): WP_REST_Response
    {
        return rest_ensure_response($this->repository->all((int) ($request->get_param('limit') ?: 50), [
            'status' => $request->get_param('status'),
            'lead_source' => $request->get_param('lead_source'),
            'min_score' => $request->get_param('min_score'),
        ]));
    }

    public function show(WP_REST_Request $request)
    {
        $deal = $this->repository->find((int) $request['id']);
        if (!$deal) {
            return new WP_Error('algq_deal_not_found', __('Deal not found.', 'algq-deal-intake'), ['status' => 404]);
        }
        return rest_ensure_response($deal);
    }

    public function create(WP_REST_Request $request)
    {
        $validation = $this->validator->validate($request->get_json_params() ?: $request->get_params());
        if (!$validation['valid']) {
            return new WP_Error('algq_deal_invalid', __('Deal intake validation failed.', 'algq-deal-intake'), ['status' => 400, 'errors' => $validation['errors']]);
        }

        $scored = $this->scorer->score($validation['data']);
        $id = $this->repository->create(array_merge($validation['data'], [
            'motivation_score' => $scored['score'],
            'motivation_signals' => $scored['signals'],
            'property_tags' => $scored['tags'],
        ]));

        if (!$id) {
            return new WP_Error('algq_deal_insert_failed', __('Deal could not be saved.', 'algq-deal-intake'), ['status' => 500]);
        }

        return new WP_REST_Response($this->repository->find($id), 201);
    }

    public function update(WP_REST_Request $request)
    {
        if (!$this->repository->find((int) $request['id'])) {
            return new WP_Error('algq_deal_not_found', __('Deal not found.', 'algq-deal-intake'), ['status' => 404]);
        }

        $payload = array_merge($this->repository->find((int) $request['id']) ?: [], $request->get_json_params() ?: $request->get_params());
        $validation = $this->validator->validate($payload);
        if (!$validation['valid']) {
            return new WP_Error('algq_deal_invalid', __('Deal intake validation failed.', 'algq-deal-intake'), ['status' => 400, 'errors' => $validation['errors']]);
        }

        $scored = $this->scorer->score($validation['data']);
        $deal = $this->repository->update((int) $request['id'], array_merge($validation['data'], [
            'motivation_score' => $scored['score'],
            'motivation_signals' => $scored['signals'],
            'property_tags' => $scored['tags'],
        ]));

        if (!$deal) {
            return new WP_Error('algq_deal_update_failed', __('Deal could not be updated.', 'algq-deal-intake'), ['status' => 500]);
        }

        return rest_ensure_response($deal);
    }

    public function export(): WP_REST_Response
    {
        return rest_ensure_response([
            'filename' => 'algq-deals-' . gmdate('Ymd-His') . '.csv',
            'content_type' => 'text/csv',
            'csv' => $this->csv->to_string($this->repository->all(200)),
        ]);
    }

    public function import(WP_REST_Request $request): WP_REST_Response
    {
        $files = $request->get_file_params();
        $result = $this->csv->import($files['file'] ?? $files['algq_deal_csv'] ?? []);
        return rest_ensure_response($result);
    }

    public function can_manage(): bool
    {
        return current_user_can('manage_options');
    }
}
