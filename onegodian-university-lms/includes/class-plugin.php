<?php

if (! defined('ABSPATH')) {
    exit;
}

final class OG_LMS_Plugin
{
    public function run(): void
    {
        add_action('init', [OG_LMS_Post_Types::class, 'register']);
        add_action('init', [OG_LMS_Roles::class, 'register']);
        add_action('init', [OG_LMS_Security::class, 'register']);
        add_action('rest_api_init', [OG_LMS_REST_API::class, 'register_routes']);
        add_action('wp_enqueue_scripts', [OG_LMS_Assets::class, 'enqueue_public']);
        add_action('admin_enqueue_scripts', [OG_LMS_Assets::class, 'enqueue_admin']);

        OG_LMS_Course_Renderer::register_shortcodes();
        OG_LMS_Student_Dashboard_Shortcode::register();
        OG_LMS_Emails::bootstrap();
        OG_LMS_Migrations::run();

        OG_LMS_WooCommerce_Integration::bootstrap();
        OG_LMS_Live_Classes::bootstrap();
        OG_LMS_Quiz_Engine::bootstrap();
        OG_LMS_Stripe_Gateway::bootstrap();
        OG_LMS_Tutor_Migration::bootstrap();
    }
}
