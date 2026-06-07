<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<section class="ogc-card ogc-full">
	<h2>Product sync log</h2>
	<?php if ( empty( $log ) ) : ?>
		<p>No product sync log entries yet.</p>
	<?php else : ?>
		<table class="widefat striped">
			<thead><tr><th>Time</th><th>Message</th></tr></thead>
			<tbody>
			<?php foreach ( array_reverse( $log ) as $entry ) : ?>
				<tr><td><?php echo esc_html( $entry['time'] ); ?></td><td><?php echo esc_html( $entry['message'] ); ?></td></tr>
			<?php endforeach; ?>
			</tbody>
		</table>
	<?php endif; ?>
</section>
