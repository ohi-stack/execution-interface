<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Intake_Plugin
{
    private static ?self $instance = null;

    private ALGQ_Deal_Intake_Repository $repository;
    private ALGQ_Deal_Intake_Validator $validator;
    private ALGQ_Deal_Intake_Scorer $scorer;
    private ALGQ_Deal_Intake_CSV $csv;
    private ALGQ_Deal_Intake_REST_Controller $rest;
    private ALGQ_Deal_Intake_Admin $admin;
    private ALGQ_Deal_Intake_Public $public;

    private function __construct()
    {
        $this->repository = new ALGQ_Deal_Intake_Repository();
        $this->validator = new ALGQ_Deal_Intake_Validator();
        $this->scorer = new ALGQ_Deal_Intake_Scorer();
        $this->csv = new ALGQ_Deal_Intake_CSV($this->repository, $this->validator, $this->scorer);
        $this->rest = new ALGQ_Deal_Intake_REST_Controller($this->repository, $this->validator, $this->scorer);
        $this->admin = new ALGQ_Deal_Intake_Admin($this->repository, $this->csv);
        $this->public = new ALGQ_Deal_Intake_Public($this->repository, $this->validator, $this->scorer);
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
        $this->public->register();
        $this->admin->register();
        add_action('rest_api_init', [$this->rest, 'register_routes']);
    }
}
