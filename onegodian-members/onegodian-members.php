<?php
/**
 * Plugin Name: INO Platform
 * Description: Digital operating system for the Indigenous Nation of Onegodia: public website, membership, governance, records, programs, housing, grants, volunteers, communications, certificates, and administration.
 * Version: 1.8.0
 * Author: ONEGODIAN, LLC
 * Text Domain: onegodian-members
 */

if (!defined('ABSPATH')) {
    exit;
}

define('OGM_VERSION', '1.8.0');
define('OGM_PLUGIN_FILE', __FILE__);
define('OGM_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('OGM_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once OGM_PLUGIN_DIR . 'includes/class-onegodian-members-contributors-affiliates.php';

add_action('plugins_loaded', static function () {
    OneGodian_Members_Contributors_Affiliates::instance();
});
