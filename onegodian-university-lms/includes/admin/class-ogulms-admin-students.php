<?php

namespace OGULMS\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Students {
	public function render(): void {
		echo '<h2>' . esc_html__( 'Students', 'onegodian-university-lms' ) . '</h2>';
		echo '<p>' . esc_html__( 'Students CRM and enrollment management placeholders live here.', 'onegodian-university-lms' ) . '</p>';
	}
}
