<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class OGC_Product_Sync {
	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'save_post_product', array( $this, 'sync_product_on_save' ), 20, 3 );
		add_action( 'woocommerce_update_product', array( $this, 'sync_product_by_id' ), 20, 1 );
		add_action( 'woocommerce_product_options_general_product_data', array( $this, 'render_product_fields' ) );
		add_action( 'woocommerce_admin_process_product_object', array( $this, 'save_product_fields' ) );
	}

	public static function allowed_capital_product_types() {
		return array( 'capital', 'contribution', 'digital_download', 'certificate', 'membership', 'service', 'course_reference', 'founder_product' );
	}

	public function woocommerce_active() {
		return class_exists( 'WooCommerce' ) && function_exists( 'wc_get_product' );
	}


	public function render_product_fields() {
		global $post;
		if ( ! $post ) {
			return;
		}

		echo '<div class="options_group"><p class="form-field"><label for="_ogc_capital_product_type">' . esc_html__( 'Capital product type', 'onegodian-capital' ) . '</label><select id="_ogc_capital_product_type" name="_ogc_capital_product_type">';
		$current = get_post_meta( $post->ID, '_ogc_capital_product_type', true );
		foreach ( self::allowed_capital_product_types() as $type ) {
			echo '<option value="' . esc_attr( $type ) . '" ' . selected( $current, $type, false ) . '>' . esc_html( ucwords( str_replace( '_', ' ', $type ) ) ) . '</option>';
		}
		echo '</select></p>';
		woocommerce_wp_checkbox( array( 'id' => '_ogc_disclosure_required', 'label' => __( 'Disclosure required', 'onegodian-capital' ) ) );
		woocommerce_wp_checkbox( array( 'id' => '_ogc_certificate_enabled', 'label' => __( 'Certificate enabled', 'onegodian-capital' ) ) );
		woocommerce_wp_checkbox( array( 'id' => '_ogc_dashboard_visible', 'label' => __( 'Dashboard visible', 'onegodian-capital' ) ) );
		woocommerce_wp_checkbox( array( 'id' => '_ogc_app_visible', 'label' => __( 'App visible', 'onegodian-capital' ) ) );
		echo '</div>';
	}

	public function save_product_fields( $product ) {
		$type = isset( $_POST['_ogc_capital_product_type'] ) ? sanitize_text_field( wp_unslash( $_POST['_ogc_capital_product_type'] ) ) : 'capital';
		if ( ! in_array( $type, self::allowed_capital_product_types(), true ) ) {
			$type = 'capital';
		}
		$product->update_meta_data( '_ogc_capital_product_type', $type );
		foreach ( array( '_ogc_disclosure_required', '_ogc_certificate_enabled', '_ogc_dashboard_visible', '_ogc_app_visible' ) as $key ) {
			$product->update_meta_data( $key, isset( $_POST[ $key ] ) ? 'yes' : '' );
		}
	}

	public function sync_product_on_save( $post_id, $post, $update ) {
		if ( wp_is_post_revision( $post_id ) || ! get_option( 'ogc_product_sync_enabled', true ) ) {
			return;
		}
		$this->sync_product_by_id( $post_id );
	}

	public function sync_product_by_id( $product_id ) {
		if ( ! $this->woocommerce_active() ) {
			return false;
		}

		$product = wc_get_product( $product_id );
		if ( ! $product || ! $this->is_product_eligible( $product_id ) ) {
			return false;
		}

		$products                = get_option( 'ogc_synced_products', array() );
		$products[ $product_id ] = $this->format_product( $product );
		update_option( 'ogc_synced_products', $products, false );
		$this->mark_sync( sprintf( 'Synced product #%d: %s', $product_id, $product->get_name() ) );
		return true;
	}

	public function sync_all_products() {
		if ( ! $this->woocommerce_active() ) {
			$this->mark_sync( 'WooCommerce is not active; product sync skipped.' );
			return array();
		}

		$query = array(
			'limit'  => -1,
			'return' => 'ids',
			'status' => array( 'publish', 'private', 'draft', 'pending' ),
		);
		$ids   = wc_get_products( $query );
		$count = 0;
		foreach ( $ids as $product_id ) {
			if ( $this->sync_product_by_id( $product_id ) ) {
				$count++;
			}
		}
		$this->mark_sync( sprintf( 'Manual sync completed. %d eligible products synced.', $count ) );
		return $this->get_products();
	}

	public function is_product_eligible( $product_id ) {
		$eligible_categories = array_filter( (array) get_option( 'ogc_product_sync_categories', array() ) );
		if ( empty( $eligible_categories ) ) {
			return true;
		}
		$product_categories = wp_get_post_terms( $product_id, 'product_cat', array( 'fields' => 'slugs' ) );
		return ! empty( array_intersect( $eligible_categories, $product_categories ) );
	}

	public function format_product( $product ) {
		$product_id  = $product->get_id();
		$categories  = wp_get_post_terms( $product_id, 'product_cat', array( 'fields' => 'names' ) );
		$capital_type = get_post_meta( $product_id, '_ogc_capital_product_type', true );
		if ( ! in_array( $capital_type, self::allowed_capital_product_types(), true ) ) {
			$capital_type = 'capital';
		}

		return array(
			'product_id'            => $product_id,
			'title'                 => $product->get_name(),
			'slug'                  => $product->get_slug(),
			'permalink'             => get_permalink( $product_id ),
			'sku'                   => $product->get_sku(),
			'price'                 => $product->get_price(),
			'regular_price'         => $product->get_regular_price(),
			'sale_price'            => $product->get_sale_price(),
			'stock_status'          => $product->get_stock_status(),
			'product_status'        => get_post_status( $product_id ),
			'product_type'          => $product->get_type(),
			'categories'            => $categories,
			'short_description'     => wp_strip_all_tags( $product->get_short_description() ),
			'description'           => wp_strip_all_tags( $product->get_description() ),
			'last_modified'         => get_post_modified_time( 'c', true, $product_id ),
			'capital_product_type'  => $capital_type,
			'disclosure_required'   => (bool) get_post_meta( $product_id, '_ogc_disclosure_required', true ),
			'certificate_enabled'   => (bool) get_post_meta( $product_id, '_ogc_certificate_enabled', true ),
			'dashboard_visible'     => (bool) get_post_meta( $product_id, '_ogc_dashboard_visible', true ),
			'app_visible'           => (bool) get_post_meta( $product_id, '_ogc_app_visible', true ),
		);
	}

	public function get_products() {
		return array_values( (array) get_option( 'ogc_synced_products', array() ) );
	}

	public function get_status() {
		$products = $this->get_products();
		return array(
			'woocommerce_active'       => $this->woocommerce_active(),
			'product_sync_enabled'     => (bool) get_option( 'ogc_product_sync_enabled', true ),
			'synced_product_count'     => count( $products ),
			'total_synced_products'    => count( $products ),
			'last_product_sync'        => get_option( 'ogc_last_product_sync', null ),
			'eligible_categories'      => array_values( (array) get_option( 'ogc_product_sync_categories', array() ) ),
			'capital_website_url'      => get_option( 'ogc_capital_website_url', 'https://capital.onegodian.com' ),
			'app_product_dashboard_url'=> get_option( 'ogc_app_product_dashboard_url', 'https://app.onegodian.com/capital/products' ),
		);
	}

	public function get_log() {
		return array_values( (array) get_option( 'ogc_product_sync_log', array() ) );
	}

	private function mark_sync( $message ) {
		$now = current_time( 'mysql' );
		update_option( 'ogc_last_product_sync', $now, false );
		$log   = $this->get_log();
		$log[] = array( 'time' => $now, 'message' => sanitize_text_field( $message ) );
		$log   = array_slice( $log, -50 );
		update_option( 'ogc_product_sync_log', $log, false );
	}
}
