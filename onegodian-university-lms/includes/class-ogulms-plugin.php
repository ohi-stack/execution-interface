<?php

namespace OGULMS;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once OGULMS_PATH . 'includes/class-ogulms-page-generator.php';
require_once OGULMS_PATH . 'includes/admin/class-ogulms-admin.php';
require_once OGULMS_PATH . 'includes/admin/class-ogulms-admin-dashboard.php';
require_once OGULMS_PATH . 'includes/admin/class-ogulms-admin-courses.php';
require_once OGULMS_PATH . 'includes/admin/class-ogulms-admin-students.php';
require_once OGULMS_PATH . 'includes/admin/class-ogulms-admin-settings.php';

class Plugin {
	public static function boot(): void {
		if ( is_admin() ) {
			$page_generator = new Page_Generator();
			new Admin\Admin( $page_generator );
		}
	}
}
