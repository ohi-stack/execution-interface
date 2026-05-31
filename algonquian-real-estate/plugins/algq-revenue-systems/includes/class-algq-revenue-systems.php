<?php
/**
 * Revenue Systems plugin class.
 *
 * @package Algonquian_Real_Estate
 */

// phpcs:disable Squiz.Commenting.ClassComment.Missing,Squiz.Commenting.FunctionComment.Missing,Generic.Commenting.DocComment.MissingShort,Squiz.Commenting.FunctionComment.MissingParamComment,Squiz.Commenting.FunctionComment.MissingParamTag

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class ALGQ_Revenue_Systems {

	private const OPTION_PRODUCT_MAP      = 'algq_revenue_product_map';
	private const LICENSE_META_KEY        = '_algq_license_key';
	private const LICENSE_TIER_META_KEY   = '_algq_license_tier';
	private const LICENSE_STATUS_META_KEY = '_algq_license_status';
	private const USER_TIER_META_KEY      = 'algq_subscription_tier';

	/** @var array<string,array<string,string>> */
	private array $tiers = array(
		'investor'   => array(
			'label'       => 'Investor',
			'price'       => '$49/mo',
			'description' => 'Buyer portal access, investor-ready deal packets, protected downloads, and monthly opportunity briefs.',
		),
		'buyer'      => array(
			'label'       => 'Buyer',
			'price'       => '$99/mo',
			'description' => 'Deal-room access, due-diligence downloads, NDA-gated packet delivery, and purchase workflow visibility.',
		),
		'pro'        => array(
			'label'       => 'Pro',
			'price'       => '$299/mo',
			'description' => 'Contract packs, calculators, checklists, MAO tools, training library, and commercial-use licensing.',
		),
		'enterprise' => array(
			'label'       => 'Enterprise',
			'price'       => 'Custom',
			'description' => 'Team licensing, white-label workflows, advanced support, and custom Stripe/WooCommerce fulfillment mapping.',
		),
	);

	/** @var array<int,array<string,string>> */
	private array $digital_products = array(
		array(
			'name'    => 'Contract Packs',
			'tier'    => 'pro',
			'summary' => 'Assignment, purchase, disclosure, and transaction templates delivered as protected WooCommerce downloads.',
		),
		array(
			'name'    => 'Deal Spreadsheets',
			'tier'    => 'buyer',
			'summary' => 'Underwriting workbooks, rehab budgets, rent-roll models, and acquisition calculators.',
		),
		array(
			'name'    => 'MAO Calculator Library',
			'tier'    => 'pro',
			'summary' => 'Downloadable calculator sheets paired with the MAO Engine workflow.',
		),
		array(
			'name'    => 'Buyer Checklists',
			'tier'    => 'investor',
			'summary' => 'Inspection, funding, title, closing, and post-close operating checklists.',
		),
		array(
			'name'    => 'Training Vault',
			'tier'    => 'enterprise',
			'summary' => 'Premium education modules and SOPs for platform operators and real-estate teams.',
		),
	);

	public static function boot(): void {
		$plugin = new self();
		add_action( 'admin_menu', array( $plugin, 'register_admin_page' ) );
		add_action( 'admin_init', array( $plugin, 'register_settings' ) );
		add_action( 'woocommerce_order_status_completed', array( $plugin, 'grant_order_licenses' ), 20, 1 );
		add_action( 'woocommerce_subscription_status_active', array( $plugin, 'sync_subscription_tier' ), 20, 1 );
		add_action( 'woocommerce_subscription_status_cancelled', array( $plugin, 'deactivate_subscription_tier' ), 20, 1 );
		add_shortcode( 'algq_monetization_store', array( $plugin, 'render_store_shortcode' ) );
		add_shortcode( 'algq_subscription_tiers', array( $plugin, 'render_tiers_shortcode' ) );
		add_shortcode( 'algq_protected_downloads', array( $plugin, 'render_protected_downloads_shortcode' ) );
		add_shortcode( 'algq_license_status', array( $plugin, 'render_license_status_shortcode' ) );
		add_filter( 'woocommerce_downloadable_file_permission', array( $plugin, 'filter_download_permission' ), 10, 2 );
		add_action( 'rest_api_init', array( $plugin, 'register_rest_routes' ) );
	}

	public function register_admin_page(): void {
		add_submenu_page(
			$this->is_woocommerce_active() ? 'woocommerce' : 'options-general.php',
			'Algonquian Monetization',
			'Algonquian Monetization',
			$this->get_admin_capability(),
			'algq-revenue-systems',
			array( $this, 'render_admin_page' )
		);
	}

	public function register_settings(): void {
		register_setting(
			'algq_revenue_systems',
			self::OPTION_PRODUCT_MAP,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( $this, 'sanitize_product_map' ),
				'default'           => array(),
			)
		);
	}

	/**
	 * @param mixed $value
	 * @return array<string,int>
	 */
	public function sanitize_product_map( $value ): array {
		$clean = array();
		if ( ! is_array( $value ) ) {
			return $clean;
		}

		foreach ( array_keys( $this->tiers ) as $tier ) {
			$clean[ $tier ] = absint( $value[ $tier ] ?? 0 );
		}

		foreach ( $this->digital_products as $index => $product ) {
			$key           = 'product_' . $index;
			$clean[ $key ] = absint( $value[ $key ] ?? 0 );
		}

		return $clean;
	}

	public function render_admin_page(): void {
		if ( ! current_user_can( $this->get_admin_capability() ) ) {
			wp_die( esc_html__( 'You do not have permission to manage monetization settings.', 'algq-revenue-systems' ) );
		}

		$map = $this->get_product_map();
		?>
		<div class="wrap algq-revenue-settings">
			<h1><?php esc_html_e( 'Algonquian WooCommerce Monetization', 'algq-revenue-systems' ); ?></h1>
			<p><?php esc_html_e( 'Map WooCommerce products to subscription tiers and digital downloads, then use the shortcodes on public pages.', 'algq-revenue-systems' ); ?></p>
			<div class="notice notice-info inline">
				<p><?php echo esc_html( $this->get_gateway_status_message() ); ?></p>
			</div>
			<form method="post" action="options.php">
				<?php settings_fields( 'algq_revenue_systems' ); ?>
				<h2><?php esc_html_e( 'Subscription Tiers', 'algq-revenue-systems' ); ?></h2>
				<table class="widefat striped">
					<thead><tr><th><?php esc_html_e( 'Tier', 'algq-revenue-systems' ); ?></th><th><?php esc_html_e( 'WooCommerce Product ID', 'algq-revenue-systems' ); ?></th><th><?php esc_html_e( 'Positioning', 'algq-revenue-systems' ); ?></th></tr></thead>
					<tbody>
					<?php foreach ( $this->tiers as $key => $tier ) : ?>
						<tr>
							<td><strong><?php echo esc_html( $tier['label'] ); ?></strong><br><?php echo esc_html( $tier['price'] ); ?></td>
							<td><input name="<?php echo esc_attr( self::OPTION_PRODUCT_MAP . '[' . $key . ']' ); ?>" type="number" min="0" value="<?php echo esc_attr( (string) ( $map[ $key ] ?? 0 ) ); ?>" /></td>
							<td><?php echo esc_html( $tier['description'] ); ?></td>
						</tr>
					<?php endforeach; ?>
					</tbody>
				</table>

				<h2><?php esc_html_e( 'Digital Products', 'algq-revenue-systems' ); ?></h2>
				<table class="widefat striped">
					<thead><tr><th><?php esc_html_e( 'Product', 'algq-revenue-systems' ); ?></th><th><?php esc_html_e( 'WooCommerce Product ID', 'algq-revenue-systems' ); ?></th><th><?php esc_html_e( 'Download Protection', 'algq-revenue-systems' ); ?></th></tr></thead>
					<tbody>
					<?php foreach ( $this->digital_products as $index => $product ) : ?>
						<?php $key = 'product_' . $index; ?>
						<tr>
							<td><strong><?php echo esc_html( $product['name'] ); ?></strong><br><?php echo esc_html( $product['summary'] ); ?></td>
							<td><input name="<?php echo esc_attr( self::OPTION_PRODUCT_MAP . '[' . $key . ']' ); ?>" type="number" min="0" value="<?php echo esc_attr( (string) ( $map[ $key ] ?? 0 ) ); ?>" /></td>
							<td><?php /* translators: %s: subscription tier label. */ printf( esc_html__( 'Requires %s tier or higher; fulfilled with WooCommerce secure downloads.', 'algq-revenue-systems' ), esc_html( $this->tiers[ $product['tier'] ]['label'] ) ); ?></td>
						</tr>
					<?php endforeach; ?>
					</tbody>
				</table>
				<?php submit_button( __( 'Save Monetization Map', 'algq-revenue-systems' ) ); ?>
			</form>
		</div>
		<?php
	}

	public function render_store_shortcode(): string {
		$map = $this->get_product_map();
		ob_start();
		?>
		<div class="algq-monetization-store">
			<h2><?php esc_html_e( 'Digital Product Store', 'algq-revenue-systems' ); ?></h2>
			<p><?php esc_html_e( 'WooCommerce-backed downloads with license tracking, tier gating, and Stripe-ready checkout.', 'algq-revenue-systems' ); ?></p>
			<ul>
				<?php foreach ( $this->digital_products as $index => $product ) : ?>
					<?php $product_id = absint( $map[ 'product_' . $index ] ?? 0 ); ?>
					<li>
						<strong><?php echo esc_html( $product['name'] ); ?></strong>
						<span><?php echo esc_html( $product['summary'] ); ?></span>
						<em><?php /* translators: %s: subscription tier label. */ printf( esc_html__( 'Included with %s tier access.', 'algq-revenue-systems' ), esc_html( $this->tiers[ $product['tier'] ]['label'] ) ); ?></em>
						<?php echo wp_kses_post( $this->render_product_cta( $product_id, __( 'Buy download', 'algq-revenue-systems' ) ) ); ?>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	public function render_tiers_shortcode(): string {
		$map = $this->get_product_map();
		ob_start();
		?>
		<div class="algq-subscription-tiers">
			<h2><?php esc_html_e( 'Subscription Tiers', 'algq-revenue-systems' ); ?></h2>
			<div class="algq-tier-grid">
				<?php foreach ( $this->tiers as $key => $tier ) : ?>
					<?php $product_id = absint( $map[ $key ] ?? 0 ); ?>
					<section class="algq-tier-card algq-tier-<?php echo esc_attr( $key ); ?>">
						<h3><?php echo esc_html( $tier['label'] ); ?></h3>
						<p class="algq-tier-price"><?php echo esc_html( $tier['price'] ); ?></p>
						<p><?php echo esc_html( $tier['description'] ); ?></p>
						<?php echo wp_kses_post( $this->render_product_cta( $product_id, __( 'Subscribe', 'algq-revenue-systems' ) ) ); ?>
					</section>
				<?php endforeach; ?>
			</div>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	public function render_protected_downloads_shortcode(): string {
		if ( ! is_user_logged_in() ) {
			return '<div class="algq-protected-downloads"><p>' . esc_html__( 'Log in to access protected downloads.', 'algq-revenue-systems' ) . '</p>' . wp_login_form( array( 'echo' => false ) ) . '</div>';
		}

		$user_id   = get_current_user_id();
		$tier      = $this->get_user_tier( $user_id );
		$downloads = $this->get_customer_downloads( $user_id );
		ob_start();
		?>
		<div class="algq-protected-downloads">
			<h2><?php esc_html_e( 'Protected Downloads', 'algq-revenue-systems' ); ?></h2>
			<p><?php /* translators: %s: current subscription tier label. */ printf( esc_html__( 'Current tier: %s', 'algq-revenue-systems' ), esc_html( $tier ? $this->tiers[ $tier ]['label'] : __( 'None', 'algq-revenue-systems' ) ) ); ?></p>
			<?php if ( empty( $downloads ) ) : ?>
				<p><?php esc_html_e( 'No WooCommerce downloads are currently assigned to this account.', 'algq-revenue-systems' ); ?></p>
			<?php else : ?>
				<ul>
					<?php foreach ( $downloads as $download ) : ?>
						<li><a href="<?php echo esc_url( $download['download_url'] ); ?>"><?php echo esc_html( $download['product_name'] ); ?></a></li>
					<?php endforeach; ?>
				</ul>
			<?php endif; ?>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	public function render_license_status_shortcode(): string {
		if ( ! is_user_logged_in() ) {
			return '<p>' . esc_html__( 'Log in to view license status.', 'algq-revenue-systems' ) . '</p>';
		}

		$license       = get_user_meta( get_current_user_id(), self::LICENSE_META_KEY, true );
		$status        = get_user_meta( get_current_user_id(), self::LICENSE_STATUS_META_KEY, true );
		$status        = $status ? $status : 'inactive';
		$tier          = $this->get_user_tier( get_current_user_id() );
		$tier_label    = $tier ? $this->tiers[ $tier ]['label'] : __( 'None', 'algq-revenue-systems' );
		$license_label = $license ? $license : __( 'Not issued', 'algq-revenue-systems' );

		/* translators: %s: current subscription tier label. */
		$tier_text = sprintf( __( 'Tier: %s', 'algq-revenue-systems' ), $tier_label );
		/* translators: 1: license key or not-issued label, 2: license status. */
		$license_text = sprintf( __( 'License: %1$s (%2$s)', 'algq-revenue-systems' ), $license_label, $status );

		return sprintf(
			'<div class="algq-license-status"><strong>%s</strong><p>%s</p><p>%s</p></div>',
			esc_html__( 'License Status', 'algq-revenue-systems' ),
			esc_html( $tier_text ),
			esc_html( $license_text )
		);
	}

	public function grant_order_licenses( int $order_id ): void {
		if ( ! function_exists( 'wc_get_order' ) ) {
			return;
		}

		$order = wc_get_order( $order_id );
		if ( ! $order ) {
			return;
		}

		$user_id = (int) $order->get_user_id();
		if ( $user_id <= 0 ) {
			return;
		}

		$map = $this->get_product_map();
		foreach ( $order->get_items() as $item ) {
			$product_id = (int) $item->get_product_id();
			$tier       = array_search( $product_id, $map, true );
			if ( is_string( $tier ) && isset( $this->tiers[ $tier ] ) ) {
				$this->activate_license( $user_id, $tier, $order_id );
			}
		}
	}

	/**
	 * @param mixed $subscription
	 */
	public function sync_subscription_tier( $subscription ): void {
		if ( ! is_object( $subscription ) || ! method_exists( $subscription, 'get_user_id' ) || ! method_exists( $subscription, 'get_items' ) ) {
			return;
		}

		$user_id = (int) $subscription->get_user_id();
		$map     = $this->get_product_map();
		foreach ( $subscription->get_items() as $item ) {
			$product_id = (int) $item->get_product_id();
			$tier       = array_search( $product_id, $map, true );
			if ( is_string( $tier ) && isset( $this->tiers[ $tier ] ) ) {
				$this->activate_license( $user_id, $tier, (int) $subscription->get_id() );
				return;
			}
		}
	}

	/**
	 * @param mixed $subscription
	 */
	public function deactivate_subscription_tier( $subscription ): void {
		if ( ! is_object( $subscription ) || ! method_exists( $subscription, 'get_user_id' ) ) {
			return;
		}

		$user_id = (int) $subscription->get_user_id();
		update_user_meta( $user_id, self::LICENSE_STATUS_META_KEY, 'inactive' );
		delete_user_meta( $user_id, self::USER_TIER_META_KEY );
	}

	/**
	 * @param bool  $permission
	 * @param mixed $download
	 */
	public function filter_download_permission( bool $permission, $download ): bool {
		if ( ! $permission || ! is_user_logged_in() ) {
			return $permission;
		}

		$product_id    = is_object( $download ) && method_exists( $download, 'get_product_id' ) ? (int) $download->get_product_id() : 0;
		$required_tier = $this->get_required_tier_for_product( $product_id );
		if ( ! $required_tier ) {
			return $permission;
		}

		return $this->user_has_tier_access( get_current_user_id(), $required_tier );
	}

	public function register_rest_routes(): void {
		register_rest_route(
			'algq/v1',
			'/license/status',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'rest_license_status' ),
				'permission_callback' => static fn (): bool => is_user_logged_in(),
			)
		);
	}

	public function rest_license_status(): WP_REST_Response {
		$user_id = get_current_user_id();
		$tier    = $this->get_user_tier( $user_id );

		return new WP_REST_Response(
			array(
				'active'      => 'active' === get_user_meta( $user_id, self::LICENSE_STATUS_META_KEY, true ),
				'licenseKey'  => get_user_meta( $user_id, self::LICENSE_META_KEY, true ),
				'tier'        => $tier,
				'tierLabel'   => $tier ? $this->tiers[ $tier ]['label'] : null,
				'stripeReady' => $this->is_stripe_ready(),
			)
		);
	}

	/**
	 * @return array<string,int>
	 */
	private function get_product_map(): array {
		$value = get_option( self::OPTION_PRODUCT_MAP, array() );
		return is_array( $value ) ? array_map( 'absint', $value ) : array();
	}

	private function render_product_cta( int $product_id, string $label ): string {
		if ( $product_id > 0 && function_exists( 'wc_get_cart_url' ) ) {
			$url = add_query_arg( 'add-to-cart', $product_id, wc_get_cart_url() );
			return '<a class="button algq-commerce-cta" href="' . esc_url( $url ) . '">' . esc_html( $label ) . '</a>';
		}

		if ( $product_id > 0 ) {
			return '<span class="algq-commerce-cta algq-commerce-cta-disabled">' . esc_html__( 'WooCommerce required for checkout.', 'algq-revenue-systems' ) . '</span>';
		}

		return '<span class="algq-commerce-cta algq-commerce-cta-disabled">' . esc_html__( 'Product mapping pending.', 'algq-revenue-systems' ) . '</span>';
	}

	private function get_admin_capability(): string {
		return $this->is_woocommerce_active() ? 'manage_woocommerce' : 'manage_options';
	}

	private function get_gateway_status_message(): string {
		if ( ! $this->is_woocommerce_active() ) {
			return __( 'WooCommerce is not active. Storefront CTAs remain in safe pending mode until WooCommerce is installed.', 'algq-revenue-systems' );
		}

		if ( ! $this->is_stripe_ready() ) {
			return __( 'WooCommerce is active. Install and configure the WooCommerce Stripe Gateway to enable Stripe checkout for mapped products.', 'algq-revenue-systems' );
		}

		return __( 'WooCommerce and Stripe gateway classes are detected. Confirm live/test mode settings in WooCommerce Payments before launch.', 'algq-revenue-systems' );
	}

	private function is_woocommerce_active(): bool {
		return class_exists( 'WooCommerce' ) || function_exists( 'WC' );
	}

	private function is_stripe_ready(): bool {
		return class_exists( 'WC_Stripe' ) || class_exists( 'WC_Gateway_Stripe' ) || defined( 'WC_STRIPE_VERSION' );
	}

	/**
	 * @return array<int,array<string,string>>
	 */
	private function get_customer_downloads( int $user_id ): array {
		if ( ! function_exists( 'wc_get_customer_available_downloads' ) ) {
			return array();
		}

		$downloads = wc_get_customer_available_downloads( $user_id );
		return is_array( $downloads ) ? $downloads : array();
	}

	private function get_required_tier_for_product( int $product_id ): ?string {
		if ( $product_id <= 0 ) {
			return null;
		}

		$map = $this->get_product_map();
		foreach ( $this->digital_products as $index => $product ) {
			if ( ( $map[ 'product_' . $index ] ?? 0 ) === $product_id ) {
				return $product['tier'];
			}
		}

		return null;
	}

	private function user_has_tier_access( int $user_id, string $required_tier ): bool {
		$current_tier = $this->get_user_tier( $user_id );
		if ( ! $current_tier ) {
			return false;
		}

		$order = array_keys( $this->tiers );
		return array_search( $current_tier, $order, true ) >= array_search( $required_tier, $order, true );
	}

	private function get_user_tier( int $user_id ): ?string {
		$tier = (string) get_user_meta( $user_id, self::USER_TIER_META_KEY, true );
		return isset( $this->tiers[ $tier ] ) ? $tier : null;
	}

	private function activate_license( int $user_id, string $tier, int $source_id ): void {
		if ( $user_id <= 0 || ! isset( $this->tiers[ $tier ] ) ) {
			return;
		}

		$license = get_user_meta( $user_id, self::LICENSE_META_KEY, true );
		if ( ! $license ) {
			$license = 'ALGQ-' . strtoupper( wp_generate_password( 16, false, false ) );
			update_user_meta( $user_id, self::LICENSE_META_KEY, $license );
		}

		update_user_meta( $user_id, self::LICENSE_TIER_META_KEY, $tier );
		update_user_meta( $user_id, self::LICENSE_STATUS_META_KEY, 'active' );
		update_user_meta( $user_id, self::USER_TIER_META_KEY, $tier );
		update_user_meta( $user_id, '_algq_license_source_id', $source_id );
	}
}

