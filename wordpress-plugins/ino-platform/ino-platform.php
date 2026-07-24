<?php
/**
 * Plugin Name: INO Platform
 * Plugin URI: https://onegodian.com
 * Description: Digital operating system for the Indigenous Nation of Onegodia integrating public website, membership, governance, programs, records, housing, grants, volunteers, communications, administration, REST endpoints, and WordPress ecosystem compatibility.
 * Version: 0.2.0
 * Requires at least: 6.3
 * Requires PHP: 7.4
 * Author: OHI Stack
 * Author URI: https://onegodian.com
 * Text Domain: ino-platform
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) {
    exit;
}

define('INO_PLATFORM_VERSION', '0.2.0');
define('INO_PLATFORM_FILE', __FILE__);
define('INO_PLATFORM_DIR', plugin_dir_path(__FILE__));
define('INO_PLATFORM_URL', plugin_dir_url(__FILE__));
define('INO_PLATFORM_REST_NAMESPACE', 'ino-platform/v1');

require_once INO_PLATFORM_DIR . 'includes/class-ino-platform.php';

register_activation_hook(__FILE__, array('INO_Platform', 'activate'));
register_deactivation_hook(__FILE__, array('INO_Platform', 'deactivate'));

add_action('plugins_loaded', array('INO_Platform', 'instance'));
