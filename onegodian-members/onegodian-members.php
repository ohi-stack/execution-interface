<?php
/**
 * Plugin Name: OneGodian Members & Community
 * Description: Production membership, account, community, BuddyPress/BuddyBoss, WooCommerce, certificates, resources, app bridge, and managed-page experience for OneGodian properties.
 * Version: 1.9.0
 * Author: ONEGODIAN, LLC
 * Text Domain: onegodian-members
 */

if (!defined('ABSPATH')) {
    exit;
}

define('OGM_VERSION', '1.9.0');
define('OGM_PLUGIN_FILE', __FILE__);
define('OGM_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('OGM_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once OGM_PLUGIN_DIR . 'includes/class-onegodian-members-contributors-affiliates.php';
require_once OGM_PLUGIN_DIR . 'includes/class-onegodian-members-production-experience.php';
require_once OGM_PLUGIN_DIR . 'includes/class-onegodian-members-compatibility.php';

register_activation_hook(__FILE__, array('OneGodian_Members_Production_Experience', 'activate'));

add_action('plugins_loaded', static function () {
    OneGodian_Members_Contributors_Affiliates::instance();
    OneGodian_Members_Production_Experience::instance();
    OneGodian_Members_Compatibility::instance();
});
