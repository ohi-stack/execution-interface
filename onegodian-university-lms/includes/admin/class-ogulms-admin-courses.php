<?php

namespace OGULMS\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Courses {
	public function render(): void {
		echo '<h2>' . esc_html__( 'Courses', 'onegodian-university-lms' ) . '</h2>';
		echo '<p>' . esc_html__( 'Course management table scaffold. Integrate CPT and lesson builder in the next iteration.', 'onegodian-university-lms' ) . '</p>';
	}
}
