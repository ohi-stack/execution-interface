<?php
/**
 * Mode switching behavior.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_is_commerce_mode(): bool {
	return 'commerce' === og_build_theme_state()['mode'];
}

function og_mode_filter_nav_items( string $items, stdClass $args ): string {
	if ( 'primary' !== $args->theme_location ) {
		return $items;
	}

	if ( ! og_is_commerce_mode() && function_exists( 'wc_get_page_permalink' ) ) {
		$shop_url = wc_get_page_permalink( 'shop' );
		if ( $shop_url ) {
			$items = str_replace( 'href="' . esc_url( $shop_url ) . '"', 'href="#" style="display:none"', $items );
		}
	}

	if ( og_build_theme_state()['feature_flags']['dashboard'] ) {
		$items .= '<li class="menu-item menu-item-dashboard"><a href="' . esc_url( home_url( '/dashboard/' ) ) . '">' . esc_html__( 'Dashboard', 'enterprise-theme-v1-1' ) . '</a></li>';
	}

	return $items;
}
add_filter( 'wp_nav_menu_items', 'og_mode_filter_nav_items', 10, 2 );

function og_disable_woocommerce_templates(): void {
	if ( function_exists( 'is_woocommerce' ) && ! og_is_commerce_mode() && ( is_woocommerce() || is_cart() || is_checkout() ) ) {
		wp_safe_redirect( home_url( '/' ) );
		exit;
	}
}
add_action( 'template_redirect', 'og_disable_woocommerce_templates' );
