<?php
/**
 * Theme default configuration.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_default_config(): array {
	return array(
		'theme_mode'         => 'services',
		'layout'             => 'default',
		'primary_color'      => '#0f172a',
		'accent_color'       => '#1d4ed8',
		'heading_font'       => 'Inter, sans-serif',
		'body_font'          => 'Inter, sans-serif',
		'brand_radius'       => '12px',
		'organization_name'  => get_bloginfo( 'name' ),
		'organization_url'   => home_url( '/' ),
		'organization_logo'  => '',
		'feature_dashboard'  => true,
		'feature_hero'       => true,
		'service_cta_label'  => __( 'Request Consultation', 'enterprise-theme-v1-1' ),
		'projects_per_page'  => 12,
		'services_per_page'  => 12,
	);
}
