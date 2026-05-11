<?php
/**
 * Plugin Name: Onegodian University LMS
 * Description: LMS plugin scaffold with admin UI framework.
 * Version: 2.0.0
 * Author: ONEGODIAN, LLC
 * Text Domain: onegodian-university-lms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'OGULMS_VERSION', '2.0.0' );
define( 'OGULMS_FILE', __FILE__ );
define( 'OGULMS_PATH', plugin_dir_path( __FILE__ ) );
define( 'OGULMS_URL', plugin_dir_url( __FILE__ ) );

require_once OGULMS_PATH . 'includes/class-ogulms-plugin.php';

\OGULMS\Plugin::boot();
