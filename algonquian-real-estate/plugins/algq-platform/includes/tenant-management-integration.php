<?php
/**
 * Tenant management bridge for the Algonquian platform plugin.
 */
if (!defined('ABSPATH')) {
    exit;
}

function algq_platform_tenant_management_is_active() {
    return shortcode_exists('algq_tenant_center') || class_exists('ALGQ_Tenant_Management');
}

function algq_platform_tenant_module_link() {
    if (algq_platform_tenant_management_is_active()) {
        return '<a class="algq-platform-link" href="' . esc_url(home_url('/tenants')) . '">' . esc_html__('Open Algonquian Tenant Management', 'algq-platform') . '</a>';
    }
    return do_shortcode('[algq_platform_tenant_fallback]');
}

add_shortcode('algq_platform_tenant_module', 'algq_platform_tenant_module_link');

if (!shortcode_exists('algq_platform_tenant_fallback')) {
    add_shortcode('algq_platform_tenant_fallback', function () {
        return '<div class="algq-platform-fallback"><h2>' . esc_html__('Tenant Operations', 'algq-platform') . '</h2><p>' . esc_html__('Activate Algonquian Tenant Management for full tenant, lease, rent, maintenance, notices, documents, and inspection workflows.', 'algq-platform') . '</p></div>';
    });
}
