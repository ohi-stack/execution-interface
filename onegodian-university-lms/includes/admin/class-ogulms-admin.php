<?php

namespace OGULMS\Admin;

use OGULMS\Page_Generator;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Admin {
	/** @var array<string, callable> */
	private array $tabs = array();

	public function __construct( Page_Generator $page_generator ) {
		$this->tabs = array(
			'dashboard' => array( new Dashboard(), 'render' ),
			'courses'   => array( new Courses(), 'render' ),
			'students'  => array( new Students(), 'render' ),
			'settings'  => array( new Settings( $page_generator ), 'render' ),
		);

		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	public function register_menu(): void {
		add_menu_page(
			__( 'University LMS', 'onegodian-university-lms' ),
			__( 'University LMS', 'onegodian-university-lms' ),
			'manage_options',
			'ogulms',
			array( $this, 'render_shell' ),
			'dashicons-welcome-learn-more',
			26
		);
	}

	public function enqueue_assets( string $hook_suffix ): void {
		if ( 'toplevel_page_ogulms' !== $hook_suffix ) {
			return;
		}

		wp_enqueue_style(
			'ogulms-admin',
			OGULMS_URL . 'assets/admin/admin.css',
			array(),
			OGULMS_VERSION
		);
	}

	public function render_shell(): void {
		$tab = isset( $_GET['tab'] ) ? sanitize_key( wp_unslash( $_GET['tab'] ) ) : 'dashboard';

		if ( ! isset( $this->tabs[ $tab ] ) ) {
			$tab = 'dashboard';
		}

		echo '<div class="wrap ogulms-admin-wrap">';
		echo '<h1>' . esc_html__( 'Onegodian University LMS', 'onegodian-university-lms' ) . '</h1>';
		$this->render_tabs( $tab );
		echo '<section class="ogulms-panel">';
		call_user_func( $this->tabs[ $tab ] );
		echo '</section>';
		echo '</div>';
	}

	private function render_tabs( string $active_tab ): void {
		$tabs = array(
			'dashboard' => __( 'Dashboard', 'onegodian-university-lms' ),
			'courses'   => __( 'Courses', 'onegodian-university-lms' ),
			'students'  => __( 'Students', 'onegodian-university-lms' ),
			'settings'  => __( 'Settings', 'onegodian-university-lms' ),
		);

		echo '<nav class="nav-tab-wrapper ogulms-nav">';
		foreach ( $tabs as $slug => $label ) {
			$class = ( $active_tab === $slug ) ? 'nav-tab nav-tab-active' : 'nav-tab';
			$url   = add_query_arg(
				array(
					'page' => 'ogulms',
					'tab'  => $slug,
				),
				admin_url( 'admin.php' )
			);
			echo '<a class="' . esc_attr( $class ) . '" href="' . esc_url( $url ) . '">' . esc_html( $label ) . '</a>';
		}
		echo '</nav>';
	}
}
