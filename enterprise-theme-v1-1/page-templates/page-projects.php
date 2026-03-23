<?php
/**
 * Template Name: Projects Listing
 *
 * @package enterprise-theme-v1-1
 */

get_header();
$projects = new WP_Query(
	array(
		'post_type'      => 'project',
		'posts_per_page' => (int) og_get( 'projects_per_page' ),
	)
);
?>
<main class="og-container">
	<?php if ( $projects->have_posts() ) : ?>
		<?php while ( $projects->have_posts() ) : $projects->the_post(); ?>
			<?php get_template_part( 'template-parts/project', 'card' ); ?>
		<?php endwhile; ?>
		<?php wp_reset_postdata(); ?>
	<?php endif; ?>
</main>
<?php
get_footer();
