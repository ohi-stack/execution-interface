<?php
/**
 * Plugin Name: One Companion Platform
 * Description: Production foundation for nonmedical companion operations.
 * Version: 0.5.0
 */

defined( 'ABSPATH' ) || exit;

define( 'OCH_VERSION', '0.5.0' );
define( 'OCH_SCHEMA_VERSION', 1 );
define( 'OCH_FILE', __FILE__ );

require_once __DIR__ . '/includes/class-och-capabilities.php';
require_once __DIR__ . '/includes/class-och-authorization.php';
require_once __DIR__ . '/includes/class-och-repository.php';
require_once __DIR__ . '/includes/class-och-migrations.php';
require_once __DIR__ . '/includes/class-och-audit.php';
require_once __DIR__ . '/includes/class-och-settings.php';
require_once __DIR__ . '/includes/class-och-plugin.php';

register_activation_hook( __FILE__, array( 'OCH_Plugin', 'activate' ) );
add_action( 'plugins_loaded', array( 'OCH_Plugin', 'boot' ) );
