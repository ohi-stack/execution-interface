<?php
if (!defined('ABSPATH')) {
    exit;
}

class INO_Platform_Admin {
    private $plugin;
    public function __construct($plugin) { $this->plugin = $plugin; }
    public function register_menu() {
        add_menu_page(__('INO Platform', 'ino-platform'), __('INO Platform', 'ino-platform'), 'ino_manage_records', 'ino-platform', array($this, 'render'), 'dashicons-shield-alt', 58);
    }
    public function render() {
        echo '<div class="wrap"><h1>INO Platform</h1><p>Version ' . esc_html(INO_PLATFORM_VERSION) . '</p><ul>';
        foreach ($this->plugin->modules() as $module) {
            echo '<li><strong>' . esc_html($module->label()) . '</strong>: ' . esc_html($module->schema()['description']) . '</li>';
        }
        echo '</ul></div>';
    }
}
