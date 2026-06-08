<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$selected_categories = (array) get_option( 'ogc_product_sync_categories', array() );
?>
<div class="wrap ogc-admin">
	<header class="ogc-hero">
		<p class="ogc-eyebrow">WooCommerce Product Sync</p>
		<h1>OneGodian Capital → Product Sync</h1>
		<p>Sync eligible WooCommerce products into the Capital Plugin app bridge payload.</p>
	</header>

	<section class="ogc-grid">
		<div class="ogc-card"><span class="ogc-badge">Status</span><h2>WooCommerce sync status</h2><p>WooCommerce active: <strong><?php echo $status['woocommerce_active'] ? 'Yes' : 'No'; ?></strong></p><p>Auto-sync on product save/update: <strong><?php echo $status['product_sync_enabled'] ? 'Enabled' : 'Disabled'; ?></strong></p></div>
		<div class="ogc-card"><span class="ogc-badge">Metrics</span><h2>Sync totals</h2><p>Last sync time: <strong><?php echo esc_html( $status['last_product_sync'] ?: 'Never' ); ?></strong></p><p>Total synced products: <strong><?php echo esc_html( $status['total_synced_products'] ); ?></strong></p></div>
	</section>

	<section class="ogc-card ogc-notice ogc-full">
		<h2>Product Sync Legal Notice</h2>
		<p>Product sync imports WooCommerce product metadata into the OneGodian Capital Plugin for administrative display, dashboard routing, and app bridge visibility. Product sync does not approve offerings, securities, repayment terms, investor eligibility, or legal compliance. All capital-related products, disclosures, certificates, and public offering language must be reviewed before public use.</p>
	</section>

	<section class="ogc-card ogc-full">
		<h2>Sync Products Now</h2>
		<form method="post">
			<?php wp_nonce_field( 'ogc_product_sync_now' ); ?>
			<button class="button button-primary" name="ogc_sync_products_now" value="1">Sync Products Now</button>
		</form>
	</section>

	<section class="ogc-card ogc-full">
		<h2>Product Sync Settings</h2>
		<form method="post">
			<?php wp_nonce_field( 'ogc_product_sync_settings' ); ?>
			<label class="ogc-toggle"><input type="checkbox" name="ogc_product_sync_enabled" value="1" <?php checked( $status['product_sync_enabled'] ); ?>> Auto-sync on product save/update</label>
			<h3>Eligible product categories</h3>
			<div class="ogc-checklist">
				<?php if ( ! is_wp_error( $categories ) && ! empty( $categories ) ) : ?>
					<?php foreach ( $categories as $category ) : ?>
						<label class="ogc-check"><input type="checkbox" name="ogc_product_sync_categories[]" value="<?php echo esc_attr( $category->slug ); ?>" <?php checked( in_array( $category->slug, $selected_categories, true ) ); ?>> <?php echo esc_html( $category->name ); ?></label>
					<?php endforeach; ?>
				<?php else : ?>
					<p>No WooCommerce categories found. Leaving this empty syncs all products.</p>
				<?php endif; ?>
			</div>
			<p><label>Capital website URL<br><input class="regular-text" type="url" name="ogc_capital_website_url" value="<?php echo esc_attr( $status['capital_website_url'] ); ?>"></label></p>
			<p><label>OneGodian App product dashboard URL<br><input class="regular-text" type="url" name="ogc_app_product_dashboard_url" value="<?php echo esc_attr( $status['app_product_dashboard_url'] ); ?>"></label></p>
			<button class="button button-primary" name="ogc_save_product_sync" value="1">Save Product Sync Settings</button>
		</form>
	</section>

	<?php include OGC_PATH . 'admin/views/product-sync-log.php'; ?>
	<footer class="ogc-footer">ONEGODIAN Capital Infrastructure • WordPress + WooCommerce + OneGodian App Bridge</footer>
</div>
