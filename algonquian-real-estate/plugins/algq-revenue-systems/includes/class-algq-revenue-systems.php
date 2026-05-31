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

	private const OPTION_PRODUCT_MAP       = 'algq_revenue_product_map';
	private const LICENSE_META_KEY         = '_algq_license_key';
	private const LICENSE_TIER_META_KEY    = '_algq_license_tier';
	private const LICENSE_STATUS_META_KEY  = '_algq_license_status';
	private const LICENSE_EXPIRES_META_KEY = '_algq_license_expires_at';
	private const LICENSE_SITES_META_KEY   = '_algq_license_activations';
	private const USER_TIER_META_KEY       = 'algq_subscription_tier';
	private const LICENSE_NAMESPACE        = 'algq/v1';

	/** @var array<string,array<string,string>> */
	private array $tiers = array(
		'free'          => array(
			'label'       => 'Free',
			'price'       => '$0',
			'description' => 'Lead magnet access, sample downloads, and entry-level buyer education.',
		),
		'investor'      => array(
			'label'       => 'Investor',
			'price'       => '$49/mo',
			'description' => 'Deal alerts, calculators, buyer portal access, premium market access, and investor-ready deal packets.',
		),
		'operator'      => array(
			'label'       => 'Operator',
			'price'       => '$199/mo',
			'description' => 'Pipeline CRM, underwriting workflows, protected templates, SOPs, and operating playbooks.',
		),
		'saas_platform' => array(
			'label'       => 'SaaS Platform',
			'price'       => '$299/mo',
			'description' => 'Recurring platform access for command center, buyer portal, marketplace, and SaaS billing workflows.',
		),
		'institutional' => array(
			'label'       => 'Institutional',
			'price'       => '$999/mo+',
			'description' => 'Full ARE stack, white-label rights, support, enterprise onboarding, and premium reporting access.',
		),
	);

	/** @var array<string,array<string,string>> */
	private array $license_levels = array(
		'single_site' => array(
			'label'       => 'Single Site',
			'price'       => '$99/year',
			'description' => 'One production WordPress installation for one ARE plugin module.',
		),
		'business'    => array(
			'label'       => 'Business',
			'price'       => '$299/year',
			'description' => 'Multi-module commercial usage for one operating business.',
		),
		'agency'      => array(
			'label'       => 'Agency',
			'price'       => '$999/year',
			'description' => 'Client delivery rights, larger activation allowance, and agency support workflows.',
		),
		'enterprise'  => array(
			'label'       => 'Enterprise',
			'price'       => 'Custom',
			'description' => 'Custom licensing, procurement support, white-label rights, and contract terms.',
		),
	);

	/** @var array<int,array<string,string>> */
	private array $digital_products = array(
		array(
			'name'    => 'Acquisition Bundle',
			'price'   => '$49',
			'tier'    => 'investor',
			'summary' => 'Seller scripts, follow-up templates, and acquisition SOPs for lead-to-offer execution.',
		),
		array(
			'name'    => 'Wholesale Toolkit',
			'price'   => '$99',
			'tier'    => 'operator',
			'summary' => 'Assignment contracts, JV agreements, buyer packets, and wholesale transaction checklists.',
		),
		array(
			'name'    => 'Investor Toolkit',
			'price'   => '$149',
			'tier'    => 'operator',
			'summary' => 'Underwriting models, deal analysis templates, funding templates, and investor-ready packets.',
		),
		array(
			'name'    => 'ARE Operations Pack',
			'price'   => '$299',
			'tier'    => 'saas_platform',
			'summary' => 'Full workflow package covering intake, pipeline, offers, funding, buyers, and reporting.',
		),
		array(
			'name'    => 'Deal Intelligence Subscription',
			'price'   => '$99/mo',
			'tier'    => 'institutional',
			'summary' => 'Premium market reports, deal intelligence, investor products, and recurring opportunity briefs.',
		),
	);

	/** @var array<int,array<string,string>> */
	private array $plugin_products = array(
		array( 'name' => 'Deal Intake', 'summary' => 'Lead capture, seller information, and acquisition intake routing.' ),
		array( 'name' => 'Pipeline CRM', 'summary' => 'Kanban stages, deal activity, and acquisition workflow visibility.' ),
		array( 'name' => 'MAO Engine', 'summary' => 'ARV, rehab, fee, risk, and maximum allowable offer calculations.' ),
		array( 'name' => 'Offer Generator', 'summary' => 'Offer summaries, LOIs, seller finance sheets, and payment schedules.' ),
		array( 'name' => 'Funding Tracker', 'summary' => 'Lender, capital request, commitment, and funding status tracking.' ),
		array( 'name' => 'Buyer Portal', 'summary' => 'NDA-gated buyer profiles, deal downloads, and buyer interest workflows.' ),
		array( 'name' => 'Document Library', 'summary' => 'Versioned documents, protected PDFs, templates, and product vault records.' ),
		array( 'name' => 'Command Center', 'summary' => 'Executive KPI dashboard, revenue panel, reporting, and operating analytics.' ),
	);

	/** @var array<int,array<string,string>> */
	private array $education_products = array(
		array( 'name' => 'Wholesaling', 'price' => '$97', 'summary' => 'Acquisition, assignment, buyer-list, and transaction fundamentals.' ),
		array( 'name' => 'Creative Finance', 'price' => '$197', 'summary' => 'Seller financing, structuring, payment modeling, and negotiation workflows.' ),
		array( 'name' => 'Multifamily Acquisition', 'price' => '$297', 'summary' => 'Underwriting, deal review, funding packets, and operator execution systems.' ),
		array( 'name' => 'ARE Certification', 'price' => '$497', 'summary' => 'Certification pathway for operators implementing the ARE revenue operating system.' ),
	);

	/** @var array<int,array<string,string>> */
	private array $services = array(
		array( 'name' => 'Acquisition Setup', 'price' => '$500', 'summary' => 'Configure acquisition pages, forms, and early seller workflows.' ),
		array( 'name' => 'Automation Setup', 'price' => '$1,500', 'summary' => 'Build automation routing for intake, follow-up, and status notifications.' ),
		array( 'name' => 'CRM Implementation', 'price' => '$2,500', 'summary' => 'Deploy pipeline CRM stages, reporting fields, and operational dashboards.' ),
		array( 'name' => 'Custom Development', 'price' => 'Custom quote', 'summary' => 'Custom ARE plugin, marketplace, dashboard, or integration development.' ),
	);

	public static function boot(): void {
		$plugin = new self();
		add_action( 'admin_menu', array( $plugin, 'register_admin_page' ) );
		add_action( 'admin_init', array( $plugin, 'register_settings' ) );
		add_action( 'woocommerce_order_status_completed', array( $plugin, 'grant_order_licenses' ), 20, 1 );
		add_action( 'woocommerce_subscription_status_active', array( $plugin, 'sync_subscription_tier' ), 20, 1 );
		add_action( 'woocommerce_subscription_status_cancelled', array( $plugin, 'deactivate_subscription_tier' ), 20, 1 );
		add_action( 'woocommerce_subscription_status_expired', array( $plugin, 'deactivate_subscription_tier' ), 20, 1 );
		add_shortcode( 'algq_monetization_store', array( $plugin, 'render_store_shortcode' ) );
		add_shortcode( 'algq_subscription_tiers', array( $plugin, 'render_tiers_shortcode' ) );
		add_shortcode( 'algq_plugin_licensing', array( $plugin, 'render_plugin_licensing_shortcode' ) );
		add_shortcode( 'algq_education_products', array( $plugin, 'render_education_shortcode' ) );
		add_shortcode( 'algq_service_products', array( $plugin, 'render_services_shortcode' ) );
		add_shortcode( 'algq_revenue_center', array( $plugin, 'render_revenue_center_shortcode' ) );
		add_shortcode( 'algq_revenue_dashboard', array( $plugin, 'render_revenue_dashboard_shortcode' ) );
		add_shortcode( 'algq_customer_dashboard', array( $plugin, 'render_customer_dashboard_shortcode' ) );
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

		foreach ( array_keys( $this->license_levels ) as $level ) {
			$clean[ 'license_' . $level ] = absint( $value[ 'license_' . $level ] ?? 0 );
		}

		foreach ( $this->education_products as $index => $product ) {
			$clean[ 'education_' . $index ] = absint( $value[ 'education_' . $index ] ?? 0 );
		}

		foreach ( $this->services as $index => $service ) {
			$clean[ 'service_' . $index ] = absint( $value[ 'service_' . $index ] ?? 0 );
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
			<p><?php esc_html_e( 'Map WooCommerce products to the full ARE revenue operating system: digital products, plugin licensing, memberships, subscriptions, education, services, protected downloads, and SaaS billing.', 'algq-revenue-systems' ); ?></p>
			<div class="notice notice-info inline">
				<p><?php echo esc_html( $this->get_gateway_status_message() ); ?></p>
			</div>
			<form method="post" action="options.php">
				<?php settings_fields( 'algq_revenue_systems' ); ?>
				<?php $this->render_mapping_table( __( 'Membership & SaaS Subscription Tiers', 'algq-revenue-systems' ), $this->tiers, $map, '' ); ?>
				<?php $this->render_mapping_table( __( 'Plugin License Products', 'algq-revenue-systems' ), $this->license_levels, $map, 'license_' ); ?>
				<?php $this->render_indexed_mapping_table( __( 'Digital Products', 'algq-revenue-systems' ), $this->digital_products, $map, 'product_' ); ?>
				<?php $this->render_indexed_mapping_table( __( 'Education Products', 'algq-revenue-systems' ), $this->education_products, $map, 'education_' ); ?>
				<?php $this->render_indexed_mapping_table( __( 'Services', 'algq-revenue-systems' ), $this->services, $map, 'service_' ); ?>
				<?php submit_button( __( 'Save Monetization Map', 'algq-revenue-systems' ) ); ?>
			</form>
		</div>
		<?php
	}

	/** @param array<string,array<string,string>> $items */
	private function render_mapping_table( string $title, array $items, array $map, string $prefix ): void {
		?>
		<h2><?php echo esc_html( $title ); ?></h2>
		<table class="widefat striped">
			<thead><tr><th><?php esc_html_e( 'Product', 'algq-revenue-systems' ); ?></th><th><?php esc_html_e( 'WooCommerce Product ID', 'algq-revenue-systems' ); ?></th><th><?php esc_html_e( 'Positioning', 'algq-revenue-systems' ); ?></th></tr></thead>
			<tbody>
			<?php foreach ( $items as $key => $item ) : ?>
				<?php $map_key = $prefix . $key; ?>
				<tr>
					<td><strong><?php echo esc_html( $item['label'] ); ?></strong><br><?php echo esc_html( $item['price'] ); ?></td>
					<td><input name="<?php echo esc_attr( self::OPTION_PRODUCT_MAP . '[' . $map_key . ']' ); ?>" type="number" min="0" value="<?php echo esc_attr( (string) ( $map[ $map_key ] ?? 0 ) ); ?>" /></td>
					<td><?php echo esc_html( $item['description'] ); ?></td>
				</tr>
			<?php endforeach; ?>
			</tbody>
		</table>
		<?php
	}

	/** @param array<int,array<string,string>> $items */
	private function render_indexed_mapping_table( string $title, array $items, array $map, string $prefix ): void {
		?>
		<h2><?php echo esc_html( $title ); ?></h2>
		<table class="widefat striped">
			<thead><tr><th><?php esc_html_e( 'Product', 'algq-revenue-systems' ); ?></th><th><?php esc_html_e( 'WooCommerce Product ID', 'algq-revenue-systems' ); ?></th><th><?php esc_html_e( 'Access / Fulfillment', 'algq-revenue-systems' ); ?></th></tr></thead>
			<tbody>
			<?php foreach ( $items as $index => $item ) : ?>
				<?php $key = $prefix . $index; ?>
				<tr>
					<td><strong><?php echo esc_html( $item['name'] ); ?></strong><br><?php echo esc_html( $item['summary'] ); ?></td>
					<td><input name="<?php echo esc_attr( self::OPTION_PRODUCT_MAP . '[' . $key . ']' ); ?>" type="number" min="0" value="<?php echo esc_attr( (string) ( $map[ $key ] ?? 0 ) ); ?>" /></td>
					<td><?php echo esc_html( $item['tier'] ?? __( 'WooCommerce order fulfillment', 'algq-revenue-systems' ) ); ?> <?php echo esc_html( $item['price'] ?? '' ); ?></td>
				</tr>
			<?php endforeach; ?>
			</tbody>
		</table>
		<?php
	}

	public function render_store_shortcode(): string {
		return $this->render_product_cards( 'Digital Product Store', 'WooCommerce-backed contracts, templates, forms, calculators, AI prompts, SOPs, courses, documents, checklists, and playbooks.', $this->digital_products, 'product_', 'Buy download' );
	}

	public function render_tiers_shortcode(): string {
		$map = $this->get_product_map();
		ob_start();
		?>
		<div class="algq-subscription-tiers">
			<h2><?php esc_html_e( 'Membership & Subscription Tiers', 'algq-revenue-systems' ); ?></h2>
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

	public function render_plugin_licensing_shortcode(): string {
		$map = $this->get_product_map();
		ob_start();
		?>
		<div class="algq-plugin-licensing">
			<h2><?php esc_html_e( 'ARE Plugin Licensing', 'algq-revenue-systems' ); ?></h2>
			<p><?php esc_html_e( 'License Deal Intake, Pipeline CRM, MAO Engine, Offer Generator, Funding Tracker, Buyer Portal, Document Library, and Command Center as independent commercial modules.', 'algq-revenue-systems' ); ?></p>
			<div class="algq-tier-grid">
				<?php foreach ( $this->license_levels as $key => $level ) : ?>
					<section class="algq-tier-card">
						<h3><?php echo esc_html( $level['label'] ); ?></h3>
						<p class="algq-tier-price"><?php echo esc_html( $level['price'] ); ?></p>
						<p><?php echo esc_html( $level['description'] ); ?></p>
						<?php echo wp_kses_post( $this->render_product_cta( absint( $map[ 'license_' . $key ] ?? 0 ), __( 'Buy license', 'algq-revenue-systems' ) ) ); ?>
					</section>
				<?php endforeach; ?>
			</div>
			<ul class="algq-module-list">
				<?php foreach ( $this->plugin_products as $product ) : ?>
					<li><strong><?php echo esc_html( $product['name'] ); ?></strong> — <?php echo esc_html( $product['summary'] ); ?></li>
				<?php endforeach; ?>
			</ul>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	public function render_education_shortcode(): string {
		return $this->render_product_cards( 'Education Products', 'Courses and certification products for wholesalers, creative finance operators, multifamily acquisition teams, and ARE implementers.', $this->education_products, 'education_', 'Enroll' );
	}

	public function render_services_shortcode(): string {
		return $this->render_product_cards( 'Services', 'Implementation revenue for consulting, automation setup, CRM implementation, and custom development.', $this->services, 'service_', 'Request service' );
	}

	public function render_revenue_center_shortcode(): string {
		ob_start();
		?>
		<div class="algq-revenue-center">
			<h2><?php esc_html_e( 'Investor Revenue Center', 'algq-revenue-systems' ); ?></h2>
			<div class="algq-tier-grid">
				<section><h3><?php esc_html_e( 'Deal Packages', 'algq-revenue-systems' ); ?></h3><p><?php esc_html_e( 'Premium access to packaged opportunities, buyer packets, underwriting, and due-diligence artifacts.', 'algq-revenue-systems' ); ?></p></section>
				<section><h3><?php esc_html_e( 'Market Reports', 'algq-revenue-systems' ); ?></h3><p><?php esc_html_e( 'Monthly subscription reports for target markets, buyer activity, and acquisition intelligence.', 'algq-revenue-systems' ); ?></p></section>
				<section><h3><?php esc_html_e( 'Funding Templates', 'algq-revenue-systems' ); ?></h3><p><?php esc_html_e( 'One-time purchase templates for funding requests, lender outreach, and capital readiness.', 'algq-revenue-systems' ); ?></p></section>
				<section><h3><?php esc_html_e( 'Deal Intelligence', 'algq-revenue-systems' ); ?></h3><p><?php esc_html_e( 'Subscription model for premium acquisition signals, marketplace visibility, and investor alerts.', 'algq-revenue-systems' ); ?></p></section>
			</div>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	public function render_revenue_dashboard_shortcode(): string {
		if ( ! current_user_can( $this->get_admin_capability() ) ) {
			return '<div class="algq-revenue-dashboard-notice">' . esc_html__( 'Revenue dashboard access requires an administrator account.', 'algq-revenue-systems' ) . '</div>';
		}

		$metrics = $this->collect_revenue_metrics();
		ob_start();
		?>
		<div class="algq-revenue-dashboard">
			<h2><?php esc_html_e( 'Command Center Revenue Panel', 'algq-revenue-systems' ); ?></h2>
			<div class="algq-tier-grid">
				<?php foreach ( $metrics as $metric ) : ?>
					<section class="algq-tier-card">
						<span><?php echo esc_html( $metric['label'] ); ?></span>
						<strong><?php echo esc_html( $metric['value'] ); ?></strong>
						<small><?php echo esc_html( $metric['detail'] ); ?></small>
					</section>
				<?php endforeach; ?>
			</div>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	public function render_customer_dashboard_shortcode(): string {
		if ( ! is_user_logged_in() ) {
			return '<div class="algq-customer-dashboard"><p>' . esc_html__( 'Log in to view licenses, expiration dates, downloads, and subscriptions.', 'algq-revenue-systems' ) . '</p>' . wp_login_form( array( 'echo' => false ) ) . '</div>';
		}

		$user_id   = get_current_user_id();
		$tier      = $this->get_user_tier( $user_id );
		$downloads = $this->get_customer_downloads( $user_id );
		ob_start();
		?>
		<div class="algq-customer-dashboard">
			<h2><?php esc_html_e( 'Customer Dashboard', 'algq-revenue-systems' ); ?></h2>
			<dl>
				<div><dt><?php esc_html_e( 'Active license', 'algq-revenue-systems' ); ?></dt><dd><?php echo esc_html( get_user_meta( $user_id, self::LICENSE_META_KEY, true ) ?: __( 'Not issued', 'algq-revenue-systems' ) ); ?></dd></div>
				<div><dt><?php esc_html_e( 'Status', 'algq-revenue-systems' ); ?></dt><dd><?php echo esc_html( get_user_meta( $user_id, self::LICENSE_STATUS_META_KEY, true ) ?: __( 'inactive', 'algq-revenue-systems' ) ); ?></dd></div>
				<div><dt><?php esc_html_e( 'Tier', 'algq-revenue-systems' ); ?></dt><dd><?php echo esc_html( $tier ? $this->tiers[ $tier ]['label'] : __( 'None', 'algq-revenue-systems' ) ); ?></dd></div>
				<div><dt><?php esc_html_e( 'Expiration', 'algq-revenue-systems' ); ?></dt><dd><?php echo esc_html( get_user_meta( $user_id, self::LICENSE_EXPIRES_META_KEY, true ) ?: __( 'No expiration recorded', 'algq-revenue-systems' ) ); ?></dd></div>
				<div><dt><?php esc_html_e( 'Downloads', 'algq-revenue-systems' ); ?></dt><dd><?php echo esc_html( (string) count( $downloads ) ); ?></dd></div>
			</dl>
			<?php echo wp_kses_post( $this->render_protected_downloads_shortcode() ); ?>
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
		$expires       = get_user_meta( get_current_user_id(), self::LICENSE_EXPIRES_META_KEY, true );
		$expires_label = $expires ? $expires : __( 'No expiration recorded', 'algq-revenue-systems' );

		/* translators: %s: current subscription tier label. */
		$tier_text = sprintf( __( 'Tier: %s', 'algq-revenue-systems' ), $tier_label );
		/* translators: 1: license key or not-issued label, 2: license status. */
		$license_text = sprintf( __( 'License: %1$s (%2$s)', 'algq-revenue-systems' ), $license_label, $status );
		/* translators: %s: license expiration. */
		$expires_text = sprintf( __( 'Expiration: %s', 'algq-revenue-systems' ), $expires_label );

		return sprintf(
			'<div class="algq-license-status"><strong>%s</strong><p>%s</p><p>%s</p><p>%s</p></div>',
			esc_html__( 'License Status', 'algq-revenue-systems' ),
			esc_html( $tier_text ),
			esc_html( $license_text ),
			esc_html( $expires_text )
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
			$key        = array_search( $product_id, $map, true );
			if ( ! is_string( $key ) ) {
				continue;
			}

			if ( isset( $this->tiers[ $key ] ) ) {
				$this->activate_license( $user_id, $key, $order_id, '+1 month' );
			}

			if ( 0 === strpos( $key, 'license_' ) ) {
				$this->activate_license( $user_id, 'operator', $order_id, '+1 year' );
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
				$this->activate_license( $user_id, $tier, (int) $subscription->get_id(), '+1 month' );
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

		$this->deactivate_license_for_user( (int) $subscription->get_user_id() );
	}

	/**
	 * @param bool  $permission
	 * @param mixed $download
	 */
	public function filter_download_permission( bool $permission, $download ): bool {
		if ( ! $permission || ! is_user_logged_in() ) {
			return $permission;
		}

		$user_id = get_current_user_id();
		if ( $this->is_license_expired( $user_id ) ) {
			$this->deactivate_license_for_user( $user_id );
			return false;
		}

		$product_id    = is_object( $download ) && method_exists( $download, 'get_product_id' ) ? (int) $download->get_product_id() : 0;
		$required_tier = $this->get_required_tier_for_product( $product_id );
		if ( ! $required_tier ) {
			return $permission;
		}

		return $this->user_has_tier_access( $user_id, $required_tier );
	}

	public function register_rest_routes(): void {
		register_rest_route(
			self::LICENSE_NAMESPACE,
			'/license/status',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'rest_license_status' ),
				'permission_callback' => static fn (): bool => is_user_logged_in(),
			)
		);

		register_rest_route(
			self::LICENSE_NAMESPACE,
			'/license',
			array(
				array(
					'methods'             => 'GET',
					'callback'            => array( $this, 'rest_license_status' ),
					'permission_callback' => static fn (): bool => is_user_logged_in(),
				),
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'rest_issue_license' ),
					'permission_callback' => fn (): bool => current_user_can( $this->get_admin_capability() ),
				),
			)
		);

		register_rest_route(
			self::LICENSE_NAMESPACE,
			'/license/(?P<license>[A-Z0-9\-]+)/activate',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'rest_activate_license' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::LICENSE_NAMESPACE,
			'/license/(?P<license>[A-Z0-9\-]+)/deactivate',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'rest_deactivate_license' ),
				'permission_callback' => fn (): bool => current_user_can( $this->get_admin_capability() ) || is_user_logged_in(),
			)
		);

		register_rest_route(
			self::LICENSE_NAMESPACE,
			'/license/(?P<license>[A-Z0-9\-]+)/renew',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'rest_renew_license' ),
				'permission_callback' => fn (): bool => current_user_can( $this->get_admin_capability() ),
			)
		);
	}

	public function rest_license_status(): WP_REST_Response {
		$user_id = get_current_user_id();
		$tier    = $this->get_user_tier( $user_id );

		return new WP_REST_Response(
			array(
				'active'        => 'active' === get_user_meta( $user_id, self::LICENSE_STATUS_META_KEY, true ) && ! $this->is_license_expired( $user_id ),
				'licenseKey'    => get_user_meta( $user_id, self::LICENSE_META_KEY, true ),
				'tier'          => $tier,
				'tierLabel'     => $tier ? $this->tiers[ $tier ]['label'] : null,
				'expiresAt'     => get_user_meta( $user_id, self::LICENSE_EXPIRES_META_KEY, true ),
				'activations'   => $this->get_license_activations( $user_id ),
				'stripeReady'   => $this->is_stripe_ready(),
				'woocommerce'   => $this->is_woocommerce_active(),
				'subscriptions' => $this->is_subscriptions_ready(),
			)
		);
	}

	public function rest_issue_license( WP_REST_Request $request ): WP_REST_Response {
		$user_id = absint( $request->get_param( 'userId' ) ?: get_current_user_id() );
		$tier    = sanitize_key( (string) ( $request->get_param( 'tier' ) ?: 'operator' ) );
		$expires = sanitize_text_field( (string) ( $request->get_param( 'expires' ) ?: '+1 year' ) );
		$this->activate_license( $user_id, $tier, 0, $expires );
		return $this->rest_license_response_for_user( $user_id );
	}

	public function rest_activate_license( WP_REST_Request $request ): WP_REST_Response {
		$user_id  = $this->get_user_id_for_license( sanitize_text_field( (string) $request['license'] ) );
		$site_url = esc_url_raw( (string) ( $request->get_param( 'siteUrl' ) ?: home_url() ) );
		if ( $user_id <= 0 ) {
			return new WP_REST_Response( array( 'active' => false, 'message' => __( 'License not found.', 'algq-revenue-systems' ) ), 404 );
		}

		$activations              = $this->get_license_activations( $user_id );
		$activations[ $site_url ] = current_time( 'mysql' );
		update_user_meta( $user_id, self::LICENSE_SITES_META_KEY, $activations );
		update_user_meta( $user_id, self::LICENSE_STATUS_META_KEY, 'active' );

		return $this->rest_license_response_for_user( $user_id );
	}

	public function rest_deactivate_license( WP_REST_Request $request ): WP_REST_Response {
		$user_id = $this->get_user_id_for_license( sanitize_text_field( (string) $request['license'] ) );
		if ( $user_id <= 0 ) {
			return new WP_REST_Response( array( 'active' => false, 'message' => __( 'License not found.', 'algq-revenue-systems' ) ), 404 );
		}

		$this->deactivate_license_for_user( $user_id );
		return $this->rest_license_response_for_user( $user_id );
	}

	public function rest_renew_license( WP_REST_Request $request ): WP_REST_Response {
		$user_id = $this->get_user_id_for_license( sanitize_text_field( (string) $request['license'] ) );
		if ( $user_id <= 0 ) {
			return new WP_REST_Response( array( 'active' => false, 'message' => __( 'License not found.', 'algq-revenue-systems' ) ), 404 );
		}

		$expires = sanitize_text_field( (string) ( $request->get_param( 'expires' ) ?: '+1 year' ) );
		update_user_meta( $user_id, self::LICENSE_STATUS_META_KEY, 'active' );
		update_user_meta( $user_id, self::LICENSE_EXPIRES_META_KEY, gmdate( 'Y-m-d', strtotime( $expires ) ) );
		return $this->rest_license_response_for_user( $user_id );
	}

	/** @param array<int,array<string,string>> $items */
	private function render_product_cards( string $title, string $description, array $items, string $prefix, string $button_label ): string {
		$map = $this->get_product_map();
		ob_start();
		?>
		<div class="algq-product-cards">
			<h2><?php echo esc_html( $title ); ?></h2>
			<p><?php echo esc_html( $description ); ?></p>
			<div class="algq-tier-grid">
				<?php foreach ( $items as $index => $product ) : ?>
					<?php $product_id = absint( $map[ $prefix . $index ] ?? 0 ); ?>
					<section class="algq-tier-card">
						<h3><?php echo esc_html( $product['name'] ); ?></h3>
						<?php if ( ! empty( $product['price'] ) ) : ?><p class="algq-tier-price"><?php echo esc_html( $product['price'] ); ?></p><?php endif; ?>
						<p><?php echo esc_html( $product['summary'] ); ?></p>
						<?php if ( ! empty( $product['tier'] ) ) : ?><em><?php echo esc_html( sprintf( __( 'Protected by %s tier access.', 'algq-revenue-systems' ), $this->tiers[ $product['tier'] ]['label'] ) ); ?></em><?php endif; ?>
						<?php echo wp_kses_post( $this->render_product_cta( $product_id, $button_label ) ); ?>
					</section>
				<?php endforeach; ?>
			</div>
		</div>
		<?php
		return (string) ob_get_clean();
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

		if ( ! $this->is_subscriptions_ready() ) {
			return __( 'WooCommerce is active. Add WooCommerce Subscriptions and WooCommerce Memberships for recurring billing and entitlement management.', 'algq-revenue-systems' );
		}

		if ( ! $this->is_stripe_ready() ) {
			return __( 'WooCommerce subscriptions are available. Install and configure the WooCommerce Stripe Gateway to enable Stripe checkout for mapped products.', 'algq-revenue-systems' );
		}

		return __( 'WooCommerce, subscriptions, and Stripe gateway classes are detected. Confirm live/test mode settings in WooCommerce Payments before launch.', 'algq-revenue-systems' );
	}

	private function is_woocommerce_active(): bool {
		return class_exists( 'WooCommerce' ) || function_exists( 'WC' );
	}

	private function is_stripe_ready(): bool {
		return class_exists( 'WC_Stripe' ) || class_exists( 'WC_Gateway_Stripe' ) || defined( 'WC_STRIPE_VERSION' );
	}

	private function is_subscriptions_ready(): bool {
		return class_exists( 'WC_Subscriptions' ) || function_exists( 'wcs_get_users_subscriptions' );
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

	private function activate_license( int $user_id, string $tier, int $source_id, string $expires = '+1 year' ): void {
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
		update_user_meta( $user_id, self::LICENSE_EXPIRES_META_KEY, gmdate( 'Y-m-d', strtotime( $expires ) ) );
		update_user_meta( $user_id, '_algq_license_source_id', $source_id );
	}

	private function deactivate_license_for_user( int $user_id ): void {
		update_user_meta( $user_id, self::LICENSE_STATUS_META_KEY, 'inactive' );
		delete_user_meta( $user_id, self::USER_TIER_META_KEY );
	}

	private function is_license_expired( int $user_id ): bool {
		$expires = (string) get_user_meta( $user_id, self::LICENSE_EXPIRES_META_KEY, true );
		return $expires && strtotime( $expires . ' 23:59:59' ) < time();
	}

	/** @return array<string,string> */
	private function get_license_activations( int $user_id ): array {
		$activations = get_user_meta( $user_id, self::LICENSE_SITES_META_KEY, true );
		return is_array( $activations ) ? array_map( 'sanitize_text_field', $activations ) : array();
	}

	private function get_user_id_for_license( string $license ): int {
		$users = get_users(
			array(
				'fields'     => 'ID',
				'number'     => 1,
				'meta_key'   => self::LICENSE_META_KEY,
				'meta_value' => $license,
			)
		);

		return ! empty( $users ) ? (int) $users[0] : 0;
	}

	private function rest_license_response_for_user( int $user_id ): WP_REST_Response {
		$tier = $this->get_user_tier( $user_id );
		return new WP_REST_Response(
			array(
				'active'      => 'active' === get_user_meta( $user_id, self::LICENSE_STATUS_META_KEY, true ) && ! $this->is_license_expired( $user_id ),
				'licenseKey'  => get_user_meta( $user_id, self::LICENSE_META_KEY, true ),
				'tier'        => $tier,
				'tierLabel'   => $tier ? $this->tiers[ $tier ]['label'] : null,
				'expiresAt'   => get_user_meta( $user_id, self::LICENSE_EXPIRES_META_KEY, true ),
				'activations' => $this->get_license_activations( $user_id ),
			)
		);
	}

	/**
	 * @return array<int,array{label:string,value:string,detail:string}>
	 */
	private function collect_revenue_metrics(): array {
		$orders          = $this->get_order_count();
		$monthly_revenue = $this->get_wc_revenue_for_days( 30 );
		$daily_revenue   = $this->get_wc_revenue_for_days( 1 );
		$mrr             = $this->get_subscription_mrr_estimate();

		return array(
			array( 'label' => __( 'Daily Revenue', 'algq-revenue-systems' ), 'value' => $this->format_currency( $daily_revenue ), 'detail' => __( 'Completed WooCommerce orders in the last 24 hours.', 'algq-revenue-systems' ) ),
			array( 'label' => __( 'Monthly Revenue', 'algq-revenue-systems' ), 'value' => $this->format_currency( $monthly_revenue ), 'detail' => __( 'Completed WooCommerce orders in the last 30 days.', 'algq-revenue-systems' ) ),
			array( 'label' => __( 'MRR', 'algq-revenue-systems' ), 'value' => $this->format_currency( $mrr ), 'detail' => __( 'Estimated active subscription monthly recurring revenue.', 'algq-revenue-systems' ) ),
			array( 'label' => __( 'ARR', 'algq-revenue-systems' ), 'value' => $this->format_currency( $mrr * 12 ), 'detail' => __( 'MRR annualized for recurring revenue planning.', 'algq-revenue-systems' ) ),
			array( 'label' => __( 'LTV', 'algq-revenue-systems' ), 'value' => $orders > 0 ? $this->format_currency( $monthly_revenue / max( 1, $orders ) * 12 ) : '—', 'detail' => __( 'Simple annualized order-value estimate for launch reporting.', 'algq-revenue-systems' ) ),
			array( 'label' => __( 'Churn', 'algq-revenue-systems' ), 'value' => $this->get_subscription_churn_label(), 'detail' => __( 'Cancelled subscriptions divided by active plus cancelled subscriptions.', 'algq-revenue-systems' ) ),
			array( 'label' => __( 'Active Subscriptions', 'algq-revenue-systems' ), 'value' => (string) $this->get_active_subscription_count(), 'detail' => __( 'WooCommerce Subscriptions active status count.', 'algq-revenue-systems' ) ),
			array( 'label' => __( 'WooCommerce Orders', 'algq-revenue-systems' ), 'value' => (string) $orders, 'detail' => __( 'Completed orders connected to ARE monetization.', 'algq-revenue-systems' ) ),
			array( 'label' => __( 'Refunds', 'algq-revenue-systems' ), 'value' => (string) $this->get_refund_count(), 'detail' => __( 'Refund records tracked by WooCommerce.', 'algq-revenue-systems' ) ),
			array( 'label' => __( 'Downloads', 'algq-revenue-systems' ), 'value' => (string) $this->get_download_permission_count(), 'detail' => __( 'Granted downloadable product permissions.', 'algq-revenue-systems' ) ),
			array( 'label' => __( 'Conversion Rate', 'algq-revenue-systems' ), 'value' => 'Connect analytics', 'detail' => __( 'Ready for storefront analytics or CRM conversion source.', 'algq-revenue-systems' ) ),
		);
	}

	private function get_wc_revenue_for_days( int $days ): float {
		if ( ! function_exists( 'wc_get_orders' ) ) {
			return 0.0;
		}

		$orders = wc_get_orders(
			array(
				'limit'        => -1,
				'status'       => array( 'completed', 'processing' ),
				'date_created' => '>' . gmdate( 'Y-m-d H:i:s', strtotime( '-' . $days . ' days' ) ),
				'return'       => 'objects',
			)
		);

		$total = 0.0;
		foreach ( $orders as $order ) {
			if ( is_object( $order ) && method_exists( $order, 'get_total' ) ) {
				$total += (float) $order->get_total();
			}
		}

		return $total;
	}

	private function get_order_count(): int {
		if ( ! function_exists( 'wc_orders_count' ) ) {
			return 0;
		}

		return (int) wc_orders_count( 'completed' ) + (int) wc_orders_count( 'processing' );
	}

	private function get_refund_count(): int {
		if ( ! function_exists( 'wc_orders_count' ) ) {
			return 0;
		}

		return (int) wc_orders_count( 'refunded' );
	}

	private function get_download_permission_count(): int {
		global $wpdb;
		$table = $wpdb->prefix . 'woocommerce_downloadable_product_permissions';
		if ( ! $this->table_exists( $table ) ) {
			return 0;
		}

		return (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table}" );
	}

	private function get_active_subscription_count(): int {
		if ( ! function_exists( 'wcs_get_subscriptions' ) ) {
			return 0;
		}

		return count( wcs_get_subscriptions( array( 'subscription_status' => 'active', 'limit' => -1 ) ) );
	}

	private function get_subscription_mrr_estimate(): float {
		if ( ! function_exists( 'wcs_get_subscriptions' ) ) {
			return 0.0;
		}

		$total = 0.0;
		foreach ( wcs_get_subscriptions( array( 'subscription_status' => 'active', 'limit' => -1 ) ) as $subscription ) {
			if ( is_object( $subscription ) && method_exists( $subscription, 'get_total' ) ) {
				$total += (float) $subscription->get_total();
			}
		}

		return $total;
	}

	private function get_subscription_churn_label(): string {
		if ( ! function_exists( 'wcs_get_subscriptions' ) ) {
			return 'Connect subscriptions';
		}

		$active    = count( wcs_get_subscriptions( array( 'subscription_status' => 'active', 'limit' => -1 ) ) );
		$cancelled = count( wcs_get_subscriptions( array( 'subscription_status' => 'cancelled', 'limit' => -1 ) ) );
		$total     = $active + $cancelled;
		return $total > 0 ? round( ( $cancelled / $total ) * 100, 1 ) . '%' : '0%';
	}

	private function format_currency( float $amount ): string {
		if ( function_exists( 'wc_price' ) ) {
			return wp_strip_all_tags( wc_price( $amount ) );
		}

		return '$' . number_format( $amount, 2 );
	}

	private function table_exists( string $table ): bool {
		global $wpdb;
		return (string) $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table ) ) === $table;
	}
}
