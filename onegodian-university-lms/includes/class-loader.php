<?php

if (! defined('ABSPATH')) {
    exit;
}

require_once OG_LMS_PLUGIN_PATH . 'includes/class-activator.php';
require_once OG_LMS_PLUGIN_PATH . 'includes/class-deactivator.php';
require_once OG_LMS_PLUGIN_PATH . 'includes/class-post-types.php';
require_once OG_LMS_PLUGIN_PATH . 'includes/class-db-schema.php';
require_once OG_LMS_PLUGIN_PATH . 'includes/class-rest-api.php';
require_once OG_LMS_PLUGIN_PATH . 'includes/class-security.php';
require_once OG_LMS_PLUGIN_PATH . 'includes/class-roles.php';
require_once OG_LMS_PLUGIN_PATH . 'includes/class-assets.php';
require_once OG_LMS_PLUGIN_PATH . 'includes/class-helpers.php';

require_once OG_LMS_PLUGIN_PATH . 'modules/enrollments/class-enrollment-service.php';
require_once OG_LMS_PLUGIN_PATH . 'modules/progress/class-progress-service.php';
require_once OG_LMS_PLUGIN_PATH . 'modules/courses/class-course-renderer.php';
require_once OG_LMS_PLUGIN_PATH . 'modules/quizzes/class-quiz-engine.php';
require_once OG_LMS_PLUGIN_PATH . 'modules/certificates/class-certificate-generator.php';
require_once OG_LMS_PLUGIN_PATH . 'modules/woocommerce/class-woocommerce-integration.php';
require_once OG_LMS_PLUGIN_PATH . 'modules/stripe/class-stripe-gateway.php';
require_once OG_LMS_PLUGIN_PATH . 'modules/live-classes/class-live-classes.php';
require_once OG_LMS_PLUGIN_PATH . 'modules/migration/class-tutor-migration.php';
require_once OG_LMS_PLUGIN_PATH . 'public/class-student-dashboard-shortcode.php';
