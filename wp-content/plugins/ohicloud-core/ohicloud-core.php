<?php
/**
 * Plugin Name: OHICloud Core
 * Description: Core menu registration, VC snippets, and setup helpers for OHICloud v1.1.
 * Version: 1.1.0
 * Author: OHICloud
 */

if (!defined('ABSPATH')) {
    exit;
}

const OHICLOUD_VC_HERO_TEMPLATE = <<<'VC'
[vc_row full_width="stretch_row_content" parallax="content-moving" parallax_image="1466"]
[vc_column css=".vc_custom_ohicloud_home_hero{background:linear-gradient(180deg, rgba(7,28,42,0.90) 0%, rgba(7,28,42,0.72) 55%, rgba(7,28,42,0.92) 100%) !important;}"]
  [vc_empty_space height="40px"]
  [vc_column_text]
    BADGE (page-specific)
    H1 (page-specific)
    SUBHEAD (page-specific)
  [/vc_column_text]
  [vc_empty_space height="36px"]
  [vc_row_inner]
    [vc_column_inner width="1/2"] PRIMARY CTA [/vc_column_inner]
    [vc_column_inner width="1/2"] SECONDARY CTA [/vc_column_inner]
  [/vc_row_inner]
  [vc_empty_space height="70px"]
[/vc_column]
[/vc_row]
VC;

function ohicloud_core_register_settings(): void
{
    register_setting('reading', 'ohicloud_vc_snippets');
}
add_action('admin_init', 'ohicloud_core_register_settings');

function ohicloud_core_get_snippet(string $name): string
{
    $defaults = ['canonical_hero' => OHICLOUD_VC_HERO_TEMPLATE];
    $stored = get_option('ohicloud_vc_snippets', []);

    if (!is_array($stored)) {
        $stored = [];
    }

    return (string) ($stored[$name] ?? $defaults[$name] ?? '');
}

function ohicloud_vc_snippet_shortcode($atts): string
{
    $atts = shortcode_atts(['name' => 'canonical_hero'], $atts, 'ohicloud_vc_snippet');
    return '<pre>' . esc_html(ohicloud_core_get_snippet((string) $atts['name'])) . '</pre>';
}
add_shortcode('ohicloud_vc_snippet', 'ohicloud_vc_snippet_shortcode');

function ohicloud_register_menu_seeders(): void
{
    add_management_page(__('OHICloud Menus', 'ohicloud-core'), __('OHICloud Menus', 'ohicloud-core'), 'manage_options', 'ohicloud-menu-seed', 'ohicloud_render_menu_seed_page');
}
add_action('admin_menu', 'ohicloud_register_menu_seeders');

function ohicloud_render_menu_seed_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }

    if (isset($_POST['ohicloud_seed_menus']) && check_admin_referer('ohicloud_seed_menus')) {
        ohicloud_seed_navigation();
        echo '<div class="updated"><p>Menus created and assigned.</p></div>';
    }

    echo '<div class="wrap"><h1>OHICloud Menu Seeder</h1><form method="post">';
    wp_nonce_field('ohicloud_seed_menus');
    submit_button('Create/Refresh Mega + Footer Menus', 'primary', 'ohicloud_seed_menus');
    echo '</form></div>';
}

function ohicloud_upsert_menu(string $name): int
{
    $menu = wp_get_nav_menu_object($name);
    return $menu ? (int) $menu->term_id : (int) wp_create_nav_menu($name);
}

function ohicloud_add_menu_item(int $menu_id, string $title, string $path, int $parent = 0): int
{
    return (int) wp_update_nav_menu_item($menu_id, 0, [
        'menu-item-title' => $title,
        'menu-item-url' => home_url($path),
        'menu-item-status' => 'publish',
        'menu-item-parent-id' => $parent,
    ]);
}

function ohicloud_seed_navigation(): void
{
    $locations = get_theme_mod('nav_menu_locations', []);
    $primary_id = ohicloud_upsert_menu('OHICloud Primary Mega');

    $map = [
        'Platform' => ['/what-is-ohicloud', '/how-it-works', '/why-ohicloud', '/architecture', '/governance', '/security'],
        'Products' => ['/products', '/products/hosting', '/products/compute', '/products/wordpress', '/products/storage', '/products/networking'],
        'Pricing' => ['/pricing', '/pricing/starter', '/pricing/business', '/pricing/interstellar'],
        'Solutions' => ['/solutions', '/use-cases/creators', '/use-cases/agencies', '/use-cases/enterprise', '/use-cases/sovereign'],
        'Developers' => ['/docs', '/docs/quick-start', '/docs/platform', '/docs/api', '/docs/cli', '/docs/developers'],
        'Company' => ['/company', '/about/quantumohi', '/roadmap', '/press', '/terms', '/privacy'],
    ];

    foreach ($map as $section => $links) {
        $parent = ohicloud_add_menu_item($primary_id, $section, $links[0]);
        foreach ($links as $i => $path) {
            if ($i === 0) {
                continue;
            }
            $title = ucwords(str_replace('-', ' ', basename($path)));
            ohicloud_add_menu_item($primary_id, $title, $path, $parent);
        }
    }

    $footer_map = [
        'footer_platform' => ['What Is OHICloud' => '/what-is-ohicloud', 'How It Works' => '/how-it-works', 'Architecture' => '/architecture'],
        'footer_products' => ['Hosting' => '/products/hosting', 'Compute' => '/products/compute', 'WordPress' => '/products/wordpress', 'Storage' => '/products/storage'],
        'footer_developers' => ['Docs Hub' => '/docs', 'API' => '/docs/api', 'CLI' => '/docs/cli', 'Quick Start' => '/docs/quick-start'],
        'footer_company_legal' => ['Company' => '/company', 'Press' => '/press', 'Terms' => '/terms', 'Privacy' => '/privacy'],
    ];

    foreach ($footer_map as $location => $items) {
        $menu_id = ohicloud_upsert_menu('OHICloud ' . ucfirst(str_replace('_', ' ', $location)));
        foreach ($items as $label => $path) {
            ohicloud_add_menu_item($menu_id, $label, $path);
        }
        $locations[$location] = $menu_id;
    }

    $locations['primary'] = $primary_id;
    set_theme_mod('nav_menu_locations', $locations);
}
