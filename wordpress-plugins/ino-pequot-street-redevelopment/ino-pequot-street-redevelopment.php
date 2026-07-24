<?php
/**
 * Plugin Name: INO Pequot Street Redevelopment & Preservation
 * Description: INO-branded redevelopment module for Pequot Street housing, preservation, GIS, legal notices, timeline, forms workflows, and public WPBakery content.
 * Version: 0.1.0
 * Author: ONEGODIAN / INO
 * Text Domain: ino-pequot-street
 */

if (!defined('ABSPATH')) {
    exit;
}

define('INO_PSRP_VERSION', '0.1.0');
define('INO_PSRP_FILE', __FILE__);
define('INO_PSRP_PATH', plugin_dir_path(__FILE__));
define('INO_PSRP_URL', plugin_dir_url(__FILE__));

require_once INO_PSRP_PATH . 'includes/class-ino-psrp.php';

register_activation_hook(__FILE__, array('INO_PSRP', 'activate'));
register_deactivation_hook(__FILE__, array('INO_PSRP', 'deactivate'));

add_action('plugins_loaded', function () {
    INO_PSRP::instance()->init();
});
