<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_PDF_Signature_Plugin
{
    private static ?self $instance = null;

    private ALGQ_PDF_Signature_Repository $repository;
    private ALGQ_PDF_Signature_Renderer $renderer;
    private ALGQ_PDF_Signature_REST_Controller $rest;
    private ALGQ_PDF_Signature_Admin $admin;
    private ALGQ_PDF_Signature_Public $public;

    private function __construct()
    {
        $this->repository = new ALGQ_PDF_Signature_Repository();
        $this->renderer = new ALGQ_PDF_Signature_Renderer();
        $this->rest = new ALGQ_PDF_Signature_REST_Controller($this->repository, $this->renderer);
        $this->admin = new ALGQ_PDF_Signature_Admin($this->repository, $this->renderer);
        $this->public = new ALGQ_PDF_Signature_Public($this->repository, $this->renderer);
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
        $this->admin->register();
        $this->public->register();
        add_action('rest_api_init', [$this->rest, 'register_routes']);
    }
}
