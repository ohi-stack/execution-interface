<?php
/**
 * Customizer controls.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_customize_register( WP_Customize_Manager $wp_customize ): void {
	$wp_customize->add_section(
		'og_branding',
		array(
			'title'    => __( 'Brand Tokens', 'enterprise-theme-v1-1' ),
			'priority' => 30,
		)
	);

	$settings = array(
		'primary_color' => array( 'label' => __( 'Primary Color', 'enterprise-theme-v1-1' ), 'type' => 'color' ),
		'accent_color'  => array( 'label' => __( 'Accent Color', 'enterprise-theme-v1-1' ), 'type' => 'color' ),
		'heading_font'  => array( 'label' => __( 'Heading Font', 'enterprise-theme-v1-1' ), 'type' => 'text' ),
		'body_font'     => array( 'label' => __( 'Body Font', 'enterprise-theme-v1-1' ), 'type' => 'text' ),
		'organization_logo' => array( 'label' => __( 'Logo', 'enterprise-theme-v1-1' ), 'type' => 'media' ),
		'theme_mode'    => array( 'label' => __( 'Theme Mode', 'enterprise-theme-v1-1' ), 'type' => 'select' ),
	);

	foreach ( $settings as $key => $setting ) {
		$wp_customize->add_setting(
			$key,
			array(
				'default'           => og_default_config()[ $key ] ?? '',
				'transport'         => 'refresh',
				'sanitize_callback' => 'sanitize_text_field',
			)
		);

		if ( 'color' === $setting['type'] ) {
			$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, $key, array( 'label' => $setting['label'], 'section' => 'og_branding', 'settings' => $key ) ) );
		} elseif ( 'media' === $setting['type'] ) {
			$wp_customize->add_control( new WP_Customize_Media_Control( $wp_customize, $key, array( 'label' => $setting['label'], 'section' => 'og_branding', 'mime_type' => 'image' ) ) );
		} elseif ( 'select' === $setting['type'] ) {
			$wp_customize->add_control( $key, array( 'label' => $setting['label'], 'section' => 'og_branding', 'type' => 'select', 'choices' => array( 'services' => 'Services', 'platform' => 'Platform', 'commerce' => 'Commerce' ) ) );
		} else {
			$wp_customize->add_control( $key, array( 'label' => $setting['label'], 'section' => 'og_branding', 'type' => 'text' ) );
		}
	}
}
add_action( 'customize_register', 'og_customize_register' );
