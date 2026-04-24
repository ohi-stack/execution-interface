<?php
/**
 * Default footer part.
 *
 * @package enterprise-theme-v1-1
 */
?>
<footer class="og-container" role="contentinfo">
	<nav aria-label="<?php esc_attr_e( 'Footer menu', 'enterprise-theme-v1-1' ); ?>">
		<?php wp_nav_menu( array( 'theme_location' => 'footer', 'container' => false ) ); ?>
	</nav>
	<p><?php echo esc_html( get_bloginfo( 'name' ) ); ?></p>
</footer>
