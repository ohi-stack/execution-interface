<?php

if (! defined('ABSPATH')) {
    exit;
}

class OG_LMS_Post_Types
{
    public static function register(): void
    {
        self::register_post_types();
        self::register_taxonomies();
    }

    private static function register_post_types(): void
    {
        $supports = ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'author'];

        register_post_type('og_course', [
            'label' => __('Courses', OG_LMS_TEXT_DOMAIN),
            'public' => true,
            'show_in_rest' => true,
            'rewrite' => ['slug' => 'course'],
            'supports' => $supports,
            'has_archive' => 'courses',
            'menu_icon' => 'dashicons-welcome-learn-more',
        ]);

        register_post_type('og_lesson', [
            'label' => __('Lessons', OG_LMS_TEXT_DOMAIN),
            'public' => true,
            'show_in_rest' => true,
            'rewrite' => ['slug' => 'lesson'],
            'supports' => $supports,
            'menu_icon' => 'dashicons-media-document',
        ]);

        register_post_type('og_quiz', [
            'label' => __('Quizzes', OG_LMS_TEXT_DOMAIN),
            'public' => false,
            'show_ui' => true,
            'show_in_rest' => true,
            'supports' => ['title', 'custom-fields'],
            'menu_icon' => 'dashicons-editor-ol',
        ]);

        register_post_type('og_assignment', [
            'label' => __('Assignments', OG_LMS_TEXT_DOMAIN),
            'public' => false,
            'show_ui' => true,
            'show_in_rest' => true,
            'supports' => ['title', 'editor', 'custom-fields'],
            'menu_icon' => 'dashicons-portfolio',
        ]);

        register_post_type('og_certificate_template', [
            'label' => __('Certificate Templates', OG_LMS_TEXT_DOMAIN),
            'public' => false,
            'show_ui' => true,
            'show_in_rest' => true,
            'supports' => ['title', 'editor', 'thumbnail'],
            'menu_icon' => 'dashicons-awards',
        ]);

        register_post_type('og_live_class', [
            'label' => __('Live Classes', OG_LMS_TEXT_DOMAIN),
            'public' => false,
            'show_ui' => true,
            'show_in_rest' => true,
            'supports' => ['title', 'editor', 'custom-fields'],
            'menu_icon' => 'dashicons-video-alt3',
        ]);

        register_post_type('og_question_bank', [
            'label' => __('Question Bank', OG_LMS_TEXT_DOMAIN),
            'public' => false,
            'show_ui' => true,
            'show_in_rest' => true,
            'supports' => ['title', 'editor', 'custom-fields'],
            'menu_icon' => 'dashicons-format-chat',
        ]);

        register_post_type('og_bundle', [
            'label' => __('Course Bundles', OG_LMS_TEXT_DOMAIN),
            'public' => false,
            'show_ui' => true,
            'show_in_rest' => true,
            'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
            'menu_icon' => 'dashicons-screenoptions',
        ]);
    }

    private static function register_taxonomies(): void
    {
        register_taxonomy('og_course_category', ['og_course'], [
            'label' => __('Course Categories', OG_LMS_TEXT_DOMAIN),
            'public' => true,
            'show_in_rest' => true,
            'hierarchical' => true,
            'rewrite' => ['slug' => 'course-category'],
        ]);

        register_taxonomy('og_course_tag', ['og_course'], [
            'label' => __('Course Tags', OG_LMS_TEXT_DOMAIN),
            'public' => true,
            'show_in_rest' => true,
            'hierarchical' => false,
            'rewrite' => ['slug' => 'course-tag'],
        ]);

        register_taxonomy('og_instructor', ['og_course', 'og_lesson'], [
            'label' => __('Instructors', OG_LMS_TEXT_DOMAIN),
            'public' => true,
            'show_in_rest' => true,
            'hierarchical' => false,
            'rewrite' => ['slug' => 'instructor'],
        ]);
    }
}
