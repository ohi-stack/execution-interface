<?php
/**
 * Template Name: Dashboard
 *
 * @package enterprise-theme-v1-1
 */

get_header();
?>
<main class="og-container">
	<?php get_template_part( 'template-parts/dashboard', 'metrics', array( 'metrics' => og_get_dashboard_metrics() ) ); ?>
</main>
<?php
get_footer();
