<?php
/**
 * Template Name: Landing
 *
 * @package enterprise-theme-v1-1
 */

get_header();
$state = og_build_theme_state();
?>
<main class="og-container">
	<section class="og-card">
		<h1><?php the_title(); ?></h1>
		<p><?php echo esc_html( $state['variants']['cta_label'] ); ?></p>
		<a class="og-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php echo esc_html( $state['variants']['cta_label'] ); ?></a>
	</section>
	<?php the_content(); ?>
</main>
<?php
get_footer();
