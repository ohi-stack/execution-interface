<?php
/**
 * Plugin Name: OneGodian Members
 * Description: Modern WooCommerce-powered membership, contributor, creator network, and affiliate widgets for ONEGODIAN.
 * Version: 1.7.1
 * Author: ONEGODIAN, LLC
 * Text Domain: onegodian-members
 */

if (!defined('ABSPATH')) {
    exit;
}

define('OGM_VERSION', '1.7.1');
define('OGM_PLUGIN_FILE', __FILE__);
define('OGM_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('OGM_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once OGM_PLUGIN_DIR . 'includes/class-onegodian-members-contributors-affiliates.php';

add_action('plugins_loaded', static function () {
    OneGodian_Members_Contributors_Affiliates::instance();
});
