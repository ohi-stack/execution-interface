<?php

if (! defined('ABSPATH')) {
    exit;
}

class ALGQ_MAO_Plugin
{
    private ALGQ_MAO_Calculator $calculator;
    private ALGQ_MAO_Repository $repository;
    private ALGQ_MAO_REST_Controller $rest_controller;
    private ALGQ_MAO_Admin $admin;
    private ALGQ_MAO_Public $public;

    public function __construct()
    {
        $this->calculator = new ALGQ_MAO_Calculator();
        $this->repository = new ALGQ_MAO_Repository();
        $this->rest_controller = new ALGQ_MAO_REST_Controller($this->calculator, $this->repository);
        $this->admin = new ALGQ_MAO_Admin($this->calculator, $this->repository);
        $this->public = new ALGQ_MAO_Public($this->calculator);
    }

    public function run(): void
    {
        add_action('init', array($this, 'load_textdomain'));
        add_action('rest_api_init', array($this->rest_controller, 'register_routes'));
        add_action('admin_menu', array($this->admin, 'register_menu'));
        add_action('admin_enqueue_scripts', array($this->admin, 'enqueue_assets'));
        add_action('wp_enqueue_scripts', array($this->public, 'enqueue_assets'));
        add_shortcode('algq_mao_calculator', array($this->public, 'render_shortcode'));
    }

    public function load_textdomain(): void
    {
        load_plugin_textdomain('algq-mao-engine', false, dirname(plugin_basename(ALGQ_MAO_ENGINE_FILE)) . '/languages');
    }
}
