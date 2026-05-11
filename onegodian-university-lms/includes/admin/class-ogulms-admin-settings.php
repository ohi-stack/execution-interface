<?php

namespace OGULMS\Admin;

use OGULMS\Page_Generator;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Settings {
	private Page_Generator $page_generator;

	public function __construct( Page_Generator $page_generator ) {
		$this->page_generator = $page_generator;
	}

	public function render(): void {
		$generated = isset( $_GET['generated'] ) ? absint( $_GET['generated'] ) : null;
		if ( null !== $generated ) {
			echo '<div class="notice notice-success"><p>';
			echo esc_html( sprintf( __( 'Auto page generation complete. %d page(s) created or linked.', 'onegodian-university-lms' ), $generated ) );
			echo '</p></div>';
		}

		echo '<h2>' . esc_html__( 'Settings', 'onegodian-university-lms' ) . '</h2>';
		echo '<p>' . esc_html__( 'Use the generator below to create the core LMS public pages.', 'onegodian-university-lms' ) . '</p>';

		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
		echo '<input type="hidden" name="action" value="ogulms_generate_pages" />';
		wp_nonce_field( 'ogulms_generate_pages' );
		submit_button( __( 'Auto-Create LMS Pages', 'onegodian-university-lms' ), 'primary' );
		echo '</form>';

		$pages = $this->page_generator->get_saved_pages();
		if ( ! empty( $pages ) ) {
			echo '<h3>' . esc_html__( 'Generated Pages', 'onegodian-university-lms' ) . '</h3><ul>';
			foreach ( $pages as $slug => $page_id ) {
				$link = get_permalink( $page_id );
				echo '<li><strong>' . esc_html( $slug ) . ':</strong> ';
				echo $link ? '<a href="' . esc_url( $link ) . '" target="_blank" rel="noopener">' . esc_html( $link ) . '</a>' : esc_html__( 'Unavailable', 'onegodian-university-lms' );
				echo '</li>';
			}
			echo '</ul>';
		}
	}
}
