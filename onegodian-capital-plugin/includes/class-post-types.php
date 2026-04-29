<?php
class Onegodian_Capital_Post_Types {
    public static function register() {
        register_post_type('onegodian_offering', [
            'labels' => [
                'name' => __('Capital Offerings', 'onegodian-capital'),
                'singular_name' => __('Capital Offering', 'onegodian-capital'),
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail'],
            'has_archive' => false,
        ]);
    }
}
