<?php
/**
 * Theme bootstrap.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

$og_modules = array(
	'/config/defaults.php',
	'/inc/options.php',
	'/inc/setup.php',
	'/inc/enqueue.php',
	'/inc/customizer.php',
	'/inc/layout.php',
	'/inc/hooks.php',
	'/inc/security.php',
	'/inc/performance.php',
	'/inc/schema.php',
	'/inc/cpt-projects.php',
	'/inc/cpt-services.php',
	'/inc/cpt-leads.php',
	'/inc/taxonomies.php',
	'/inc/ajax-handlers.php',
	'/inc/mode-switch.php',
);

foreach ( $og_modules as $og_module ) {
	require_once get_template_directory() . $og_module;
}
