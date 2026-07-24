<?php
if (!defined('ABSPATH')) {
    exit;
}

abstract class INO_Platform_Module {
    protected $plugin;
    protected $slug;
    protected $label;
    protected $capability = 'read';

    public function __construct($plugin, $slug, $label, $capability = 'read') {
        $this->plugin = $plugin;
        $this->slug = $slug;
        $this->label = $label;
        $this->capability = $capability;
    }

    public function slug() { return $this->slug; }
    public function label() { return $this->label; }
    public function capability() { return $this->capability; }
    public function register_hooks() {}
    public function register_rest_routes() {}
    public function activation() {}
    public function schema() { return array(); }

    protected function current_user_can_access() {
        return current_user_can($this->capability);
    }

    protected function rest_permission() {
        return is_user_logged_in() && $this->current_user_can_access();
    }
}
