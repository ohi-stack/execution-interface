<?php
/**
 * Main Deal Marketplace plugin coordinator.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace
{
    private static ?ALGQ_Deal_Marketplace $instance = null;

    private ALGQ_Deal_Marketplace_Cache $cache;
    private ALGQ_Deal_Marketplace_Repository $repository;
    private ALGQ_Deal_Marketplace_Security $security;
    private ALGQ_Deal_Marketplace_Renderer $renderer;
    private ALGQ_Deal_Marketplace_Assets $assets;
    private ALGQ_Deal_Marketplace_Shortcodes $shortcodes;
    private ALGQ_Deal_Marketplace_Admin $admin;
    private ALGQ_Deal_Marketplace_Audit_Log $audit_log;
    private ALGQ_Deal_Marketplace_NDA $nda;
    private ALGQ_Deal_Marketplace_Interest $interest;
    private ALGQ_Deal_Marketplace_Integrations $integrations;
    private bool $has_run = false;

    private function __construct()
    {
        $this->cache = new ALGQ_Deal_Marketplace_Cache();
        $this->repository = new ALGQ_Deal_Marketplace_Repository();
        $this->security = new ALGQ_Deal_Marketplace_Security();
        $this->assets = new ALGQ_Deal_Marketplace_Assets();
        $this->renderer = new ALGQ_Deal_Marketplace_Renderer($this->repository, $this->security);
        $this->shortcodes = new ALGQ_Deal_Marketplace_Shortcodes($this->renderer, $this->assets);
        $this->admin = new ALGQ_Deal_Marketplace_Admin($this->renderer, $this->security);
        $this->audit_log = new ALGQ_Deal_Marketplace_Audit_Log($this->repository);
        $this->nda = new ALGQ_Deal_Marketplace_NDA($this->repository, $this->audit_log);
        $this->interest = new ALGQ_Deal_Marketplace_Interest($this->repository, $this->security, $this->audit_log);
        $this->integrations = new ALGQ_Deal_Marketplace_Integrations($this->cache);
    }

    public static function instance(): ALGQ_Deal_Marketplace
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function run(): void
    {
        if ($this->has_run) {
            return;
        }

        $this->has_run = true;

        load_plugin_textdomain(ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN, false, dirname(ALGQ_DEAL_MARKETPLACE_BASENAME) . '/languages');

        $this->assets->register_hooks();
        $this->admin->register_hooks();
        $this->interest->register_hooks();
        $this->integrations->register_hooks();

        add_action('init', [$this, 'register_public_hooks']);
        add_action('rest_api_init', [$this, 'register_rest_routes']);
    }

    public function register_public_hooks(): void
    {
        $this->shortcodes->register();
    }

    public function register_rest_routes(): void
    {
        register_rest_route('algq/v1', '/marketplace', [
            'methods' => 'GET',
            'permission_callback' => '__return_true',
            'callback' => function (): WP_REST_Response {
                return new WP_REST_Response([
                    'name' => 'ARE Deal Marketplace',
                    'version' => ALGQ_DEAL_MARKETPLACE_VERSION,
                    'shortcodes' => ['[algq_marketplace]', '[algq_deal_marketplace]'],
                    'modules' => $this->repository->default_modules(),
                    'integrations' => $this->integrations->suite_status(),
                ]);
            },
        ]);
    }

    public function audit_log(): ALGQ_Deal_Marketplace_Audit_Log
    {
        return $this->audit_log;
    }

    public function nda(): ALGQ_Deal_Marketplace_NDA
    {
        return $this->nda;
    }
}
