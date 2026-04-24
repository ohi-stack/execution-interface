<?php
/**
 * Template Name: Services Listing
 *
 * @package enterprise-theme-v1-1
 */

get_header();
$services = new WP_Query(
	array(
		'post_type'      => 'service',
		'posts_per_page' => (int) og_get( 'services_per_page' ),
	)
);
?>
<main class="og-container">
	<?php if ( $services->have_posts() ) : ?>
		<?php while ( $services->have_posts() ) : $services->the_post(); ?>
			<?php get_template_part( 'template-parts/service', 'card' ); ?>
		<?php endwhile; ?>
		<?php wp_reset_postdata(); ?>
	<?php endif; ?>
</main>
<?php
get_footer();
