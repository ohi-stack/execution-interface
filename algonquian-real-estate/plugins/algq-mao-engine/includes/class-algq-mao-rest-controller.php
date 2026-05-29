<?php

if (! defined('ABSPATH')) {
    exit;
}

class ALGQ_MAO_REST_Controller
{
    private const NAMESPACE = 'algq-mao/v1';

    private ALGQ_MAO_Calculator $calculator;
    private ALGQ_MAO_Repository $repository;

    public function __construct(ALGQ_MAO_Calculator $calculator, ALGQ_MAO_Repository $repository)
    {
        $this->calculator = $calculator;
        $this->repository = $repository;
    }

    public function register_routes(): void
    {
        register_rest_route(self::NAMESPACE, '/calculate', array(
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => array($this, 'calculate'),
            'permission_callback' => '__return_true',
            'args' => $this->args_schema(),
        ));

        register_rest_route(self::NAMESPACE, '/calculations', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'index'),
                'permission_callback' => array($this, 'can_manage'),
            ),
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'store'),
                'permission_callback' => array($this, 'can_manage'),
                'args' => $this->args_schema(),
            ),
        ));
    }

    public function calculate(WP_REST_Request $request): WP_REST_Response
    {
        return rest_ensure_response($this->calculator->calculate($request->get_params()));
    }

    public function index(WP_REST_Request $request): WP_REST_Response
    {
        $limit = (int) $request->get_param('limit');

        return rest_ensure_response(array(
            'items' => $this->repository->latest($limit > 0 ? $limit : 25),
        ));
    }

    public function store(WP_REST_Request $request): WP_REST_Response
    {
        $calculation = $this->calculator->calculate($request->get_params());
        $calculation['id'] = $this->repository->create($calculation);

        return rest_ensure_response($calculation);
    }

    public function can_manage(): bool
    {
        return current_user_can('manage_options');
    }

    private function args_schema(): array
    {
        return array(
            'arv' => array('required' => true, 'type' => 'number', 'minimum' => 0),
            'repairs' => array('type' => 'number', 'minimum' => 0),
            'closing_costs' => array('type' => 'number', 'minimum' => 0),
            'holding_costs' => array('type' => 'number', 'minimum' => 0),
            'selling_costs' => array('type' => 'number', 'minimum' => 0),
            'financing_costs' => array('type' => 'number', 'minimum' => 0),
            'desired_profit' => array('type' => 'number', 'minimum' => 0),
            'wholesale_fee' => array('type' => 'number', 'minimum' => 0),
            'safety_buffer' => array('type' => 'number', 'minimum' => 0),
        );
    }
}
