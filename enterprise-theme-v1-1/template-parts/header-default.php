<?php
/**
 * Default header part.
 *
 * @package enterprise-theme-v1-1
 */

$state = $args['state'] ?? og_build_theme_state();
?>
<header class="og-container" role="banner">
	<div class="og-header-bar">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
		<nav aria-label="<?php esc_attr_e( 'Primary menu', 'enterprise-theme-v1-1' ); ?>">
			<?php wp_nav_menu( array( 'theme_location' => 'primary', 'container' => false ) ); ?>
		</nav>
	</div>
	<?php if ( ! empty( $state['feature_flags']['hero'] ) ) : ?>
		<?php get_template_part( 'template-parts/hero', 'dynamic', array( 'state' => $state ) ); ?>
	<?php endif; ?>
</header>
