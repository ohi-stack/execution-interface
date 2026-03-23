<?php get_header(); ?>
<div class="wrap" style="padding:2rem 0;">
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
  <article <?php post_class(); ?>>
    <h1><?php the_title(); ?></h1>
    <?php the_content(); ?>
  </article>
<?php endwhile; endif; ?>
</div>
<?php get_footer(); ?>
