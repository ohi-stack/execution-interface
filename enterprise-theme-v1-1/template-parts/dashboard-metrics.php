<?php
/**
 * Dashboard metrics.
 *
 * @package enterprise-theme-v1-1
 */

$metrics = $args['metrics'] ?? array( 'services' => 0, 'projects' => 0 );
?>
<section class="og-card">
	<h2><?php esc_html_e( 'Metrics', 'enterprise-theme-v1-1' ); ?></h2>
	<ul>
		<li><?php echo esc_html( sprintf( __( 'Services: %d', 'enterprise-theme-v1-1' ), (int) $metrics['services'] ) ); ?></li>
		<li><?php echo esc_html( sprintf( __( 'Projects: %d', 'enterprise-theme-v1-1' ), (int) $metrics['projects'] ) ); ?></li>
	</ul>
</section>
