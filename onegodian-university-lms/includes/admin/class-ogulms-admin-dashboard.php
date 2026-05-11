<?php

namespace OGULMS\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Dashboard {
	public function render(): void {
		echo '<h2>' . esc_html__( 'LMS Dashboard', 'onegodian-university-lms' ) . '</h2>';
		echo '<p>' . esc_html__( 'This is the admin shell for upcoming LMS analytics widgets.', 'onegodian-university-lms' ) . '</p>';
	}
}
