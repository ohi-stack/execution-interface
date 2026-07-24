<?php
if (!defined('ABSPATH')) { exit; }
class INO_PSRP_Admin {
    private $data;
    public function __construct($data) { $this->data = $data; }
    public function init() { add_action('admin_menu', array($this, 'menu')); add_action('admin_enqueue_scripts', array($this, 'assets')); }
    public function assets($hook) { if (strpos($hook, 'ino-pequot') !== false) { wp_enqueue_style('ino-psrp-admin', INO_PSRP_URL . 'assets/css/ino-psrp.css', array(), INO_PSRP_VERSION); } }
    public function menu() { add_menu_page('Pequot Street Project', 'Pequot Street', 'edit_ino_project_records', 'ino-pequot-street', array($this, 'render'), 'dashicons-admin-home', 31); }
    public function render() { $manifest = $this->data->manifest(); ?>
        <div class="wrap ino-psrp-admin"><h1>Pequot Street Redevelopment & Preservation</h1><p>Housing and development administrative module for INO project records.</p><pre><?php echo esc_html(wp_json_encode($manifest, JSON_PRETTY_PRINT)); ?></pre></div>
    <?php }
}
