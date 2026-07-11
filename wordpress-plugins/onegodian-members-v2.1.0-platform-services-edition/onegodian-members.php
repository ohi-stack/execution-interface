<?php
/**
 * Plugin Name: OneGodian Members
 * Plugin URI: https://onegodian.com
 * Description: Platform Services Edition member platform with certificates, digital IDs, protected content, WooCommerce, Stripe, app bridge, BuddyPress community hooks, auto pages, admin tabs, and REST service boundaries.
 * Version: 2.1.0
 * Requires at least: 6.3
 * Requires PHP: 7.4
 * Author: OneGodian
 * Author URI: https://onegodian.com
 * Text Domain: onegodian-members
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ONEGODIAN_MEMBERS_VERSION', '2.1.0');
define('ONEGODIAN_MEMBERS_FILE', __FILE__);
define('ONEGODIAN_MEMBERS_DIR', plugin_dir_path(__FILE__));
define('ONEGODIAN_MEMBERS_URL', plugin_dir_url(__FILE__));
define('ONEGODIAN_MEMBERS_REST_NAMESPACE', 'onegodian-members/v1');

require_once ONEGODIAN_MEMBERS_DIR . 'includes/class-onegodian-members.php';

register_activation_hook(__FILE__, array('OneGodian_Members', 'activate'));
register_deactivation_hook(__FILE__, array('OneGodian_Members', 'deactivate'));

add_action('plugins_loaded', array('OneGodian_Members', 'instance'));
