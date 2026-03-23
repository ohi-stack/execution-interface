<?php
/**
 * Service card.
 *
 * @package enterprise-theme-v1-1
 */
?>
<article <?php post_class( 'og-card og-service-card' ); ?>>
	<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
	<?php if ( has_post_thumbnail() ) : ?>
		<?php the_post_thumbnail( 'medium' ); ?>
	<?php endif; ?>
	<?php the_excerpt(); ?>
</article>
