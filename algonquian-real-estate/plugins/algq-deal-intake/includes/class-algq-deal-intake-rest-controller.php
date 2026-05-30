<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Intake_REST_Controller
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
            'methods' => WP_REST_Server::READABLE,
            'callback' => [$this, 'show'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
    }

    public function index(WP_REST_Request $request): WP_REST_Response
    {
        return rest_ensure_response($this->repository->all((int) ($request->get_param('limit') ?: 50), [
            'status' => $request->get_param('status'),
            'lead_source' => $request->get_param('lead_source'),
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

    public function can_manage(): bool
    {
        return current_user_can('manage_options');
    }
}
