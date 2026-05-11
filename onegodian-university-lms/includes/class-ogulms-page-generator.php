<?php

namespace OGULMS;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Page_Generator {
	private const OPTION_KEY = 'ogulms_core_pages';

	/** @var array<string, array{title: string, shortcode: string}> */
	private array $pages = array(
		'catalog' => array(
			'title'     => 'Course Catalog',
			'shortcode' => '[og_course_catalog]',
		),
		'dashboard' => array(
			'title'     => 'Student Dashboard',
			'shortcode' => '[og_student_dashboard]',
		),
		'verify-certificate' => array(
			'title'     => 'Certificate Verification',
			'shortcode' => '[og_certificate_verify]',
		),
		'live-classes' => array(
			'title'     => 'Live Classes',
			'shortcode' => '[og_live_classes]',
		),
	);

	public function __construct() {
		add_action( 'admin_post_ogulms_generate_pages', array( $this, 'handle_generate_pages' ) );
	}

	public function handle_generate_pages(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Unauthorized', 'onegodian-university-lms' ) );
		}

		check_admin_referer( 'ogulms_generate_pages' );

		$created = 0;
		$updated_pages = $this->get_saved_pages();

		foreach ( $this->pages as $slug => $config ) {
			$page_id = isset( $updated_pages[ $slug ] ) ? (int) $updated_pages[ $slug ] : 0;
			if ( $page_id > 0 && 'trash' !== get_post_status( $page_id ) ) {
				continue;
			}

			$existing = get_page_by_path( $slug, OBJECT, 'page' );
			if ( $existing instanceof \WP_Post ) {
				$page_id = (int) $existing->ID;
			} else {
				$page_id = wp_insert_post(
					array(
						'post_title'   => $config['title'],
						'post_name'    => $slug,
						'post_content' => $config['shortcode'],
						'post_status'  => 'publish',
						'post_type'    => 'page',
					),
					true
				);
			}

			if ( ! is_wp_error( $page_id ) && $page_id > 0 ) {
				$updated_pages[ $slug ] = $page_id;
				$created++;
			}
		}

		update_option( self::OPTION_KEY, $updated_pages );

		$redirect = add_query_arg(
			array(
				'page'      => 'ogulms',
				'tab'       => 'settings',
				'generated' => (string) $created,
			),
			admin_url( 'admin.php' )
		);

		wp_safe_redirect( $redirect );
		exit;
	}

	/** @return array<string, int> */
	public function get_saved_pages(): array {
		$saved = get_option( self::OPTION_KEY, array() );
		if ( ! is_array( $saved ) ) {
			return array();
		}

		return array_map( 'intval', $saved );
	}
}
