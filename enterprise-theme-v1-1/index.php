<?php
/**
 * Default template.
 *
 * @package enterprise-theme-v1-1
 */

get_header();
?>
<main class="og-container">
	<?php if ( have_posts() ) : ?>
		<?php while ( have_posts() ) : the_post(); ?>
			<article <?php post_class( 'og-card' ); ?>>
				<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
				<?php the_excerpt(); ?>
			</article>
		<?php endwhile; ?>
	<?php else : ?>
		<p><?php esc_html_e( 'No content found.', 'enterprise-theme-v1-1' ); ?></p>
	<?php endif; ?>
</main>
<?php
get_footer();
