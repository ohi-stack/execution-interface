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
        echo '<div class="wrap"><h1>INO Platform Digital Operating System</h1><p>Version ' . esc_html(INO_PLATFORM_VERSION) . '</p><p>The platform unifies public information, secure member services, identity and heritage preservation, governance, programs, records, housing, grants, volunteer management, communications, reporting, integrations, and administrative controls.</p><p><strong>Operational disclosure:</strong> only implemented, documented, tested, permission-controlled, and repeatable capabilities should be represented as operational; other entries are documented platform boundaries.</p><ul>';
        foreach ($this->plugin->modules() as $module) {
            $schema = $module->schema();
            $status = isset($schema['operational_status']) ? $schema['operational_status'] : 'active_boundary';
            echo '<li><strong>' . esc_html($module->label()) . '</strong>: ' . esc_html($schema['description']) . ' <em>(' . esc_html($status) . ')</em></li>';
        }
        echo '</ul></div>';
    }
}
