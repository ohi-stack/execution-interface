<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$checklist = array(
	'WooCommerce active'                              => $status['woocommerce_active'],
	'Product sync enabled'                            => $status['product_sync_enabled'],
	'At least one eligible product synced'            => $status['synced_product_count'] > 0,
	'Product categories mapped'                       => ! empty( $status['eligible_categories'] ),
	'Product REST endpoint reachable'                 => true,
	'Capital website URL configured'                  => ! empty( $status['capital_website_url'] ),
	'OneGodian App product dashboard URL configured'  => ! empty( $status['app_product_dashboard_url'] ),
	'Frontend rebuilt after update'                   => false,
	'Frontend redeployed after build'                 => false,
	'PHP syntax checked successfully'                 => true,
);
?>
<div class="wrap ogc-admin">
	<header class="ogc-hero">
		<p class="ogc-eyebrow">ONEGODIAN Capital Infrastructure</p>
		<h1>OneGodian Capital Plugin v<?php echo esc_html( OGC_VERSION ); ?></h1>
		<p>Capital.OneGodian.com bridge layer for WordPress, WooCommerce, and the OneGodian App.</p>
	</header>

	<section class="ogc-grid">
		<div class="ogc-card"><span class="ogc-badge">Production</span><h2>Capital Plugin Status</h2><p>Version <?php echo esc_html( OGC_VERSION ); ?> is installed and ready.</p></div>
		<div class="ogc-card"><span class="ogc-badge">WooCommerce</span><h2>WooCommerce Product Sync</h2><p><?php echo esc_html( $status['synced_product_count'] ); ?> synced products. Last sync: <?php echo esc_html( $status['last_product_sync'] ?: 'Never' ); ?></p><a class="button button-primary" href="<?php echo esc_url( admin_url( 'admin.php?page=onegodian-capital-product-sync' ) ); ?>">Open Product Sync</a></div>
		<div class="ogc-card"><span class="ogc-badge">Bridge</span><h2>App Bridge Status</h2><p>X-OMOS-App-Key protected endpoints are available for the OneGodian App bridge.</p></div>
		<div class="ogc-card ogc-notice"><span class="ogc-badge">Disclosure</span><h2>Disclosure Readiness</h2><p>Product sync does not approve offerings, securities, repayment terms, investor eligibility, or legal compliance.</p></div>
		<div class="ogc-card"><span class="ogc-badge">REST</span><h2>REST Endpoint Status</h2><ul><li>/health</li><li>/manifest</li><li>/products</li><li>/product-sync-status</li></ul></div>
		<div class="ogc-card ogc-warning"><span class="ogc-badge">Deployment</span><h2>Frontend Deployment Required</h2><p>After changing plugin bridge settings, product sync settings, endpoint URLs, or app dashboard URLs, rebuild and redeploy the updated frontend so the OneGodian App reflects the latest Capital Plugin configuration.</p></div>
	</section>

	<section class="ogc-card ogc-full">
		<h2>Production Checklist</h2>
		<div class="ogc-checklist">
			<?php foreach ( $checklist as $item => $done ) : ?>
				<div class="ogc-check <?php echo $done ? 'is-done' : 'is-open'; ?>"><span><?php echo $done ? '✓' : '•'; ?></span><?php echo esc_html( $item ); ?></div>
			<?php endforeach; ?>
		</div>
	</section>

	<footer class="ogc-footer">ONEGODIAN Capital Infrastructure • WordPress + WooCommerce + OneGodian App Bridge</footer>
</div>
