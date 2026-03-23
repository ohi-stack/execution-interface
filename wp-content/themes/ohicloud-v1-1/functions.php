<?php
/**
 * OHICloud v1.1 theme bootstrapping.
 */

if (!defined('ABSPATH')) {
    exit;
}

function ohicloud_theme_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('menus');

    register_nav_menus([
        'primary' => __('Primary Mega Menu', 'ohicloud-v1-1'),
        'footer_platform' => __('Footer Platform', 'ohicloud-v1-1'),
        'footer_products' => __('Footer Products', 'ohicloud-v1-1'),
        'footer_developers' => __('Footer Developers', 'ohicloud-v1-1'),
        'footer_company_legal' => __('Footer Company/Legal', 'ohicloud-v1-1'),
    ]);
}
add_action('after_setup_theme', 'ohicloud_theme_setup');

function ohicloud_enqueue_assets(): void
{
    wp_enqueue_style('ohicloud-style', get_stylesheet_uri(), [], '1.1.0');
}
add_action('wp_enqueue_scripts', 'ohicloud_enqueue_assets');

function ohicloud_add_menu_item_classes(array $classes, $item, $args): array
{
    if (($args->theme_location ?? '') === 'primary' && in_array('menu-item-has-children', $classes, true)) {
        $classes[] = 'has-mega';
    }

    return $classes;
}
add_filter('nav_menu_css_class', 'ohicloud_add_menu_item_classes', 10, 3);
