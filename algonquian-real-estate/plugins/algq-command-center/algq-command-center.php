<?php
/**
 * Plugin Name: Algonquian Command Center
 * Description: Executive admin dashboard widgets for active deals, pipeline value, offers, buyer activity, and funding status.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('wp_dashboard_setup', function (): void {
    wp_add_dashboard_widget('algq_command_center', 'Algonquian Command Center', function (): void {
        $widgets = ['Active Deals', 'Pipeline Value', 'Offers Sent', 'Buyer Activity', 'Funding Status', 'Monthly Leads', 'Deals Closed', 'Assignment Revenue', 'Product Sales'];
        echo '<ul class="algq-command-center">';
        foreach ($widgets as $widget) {
            echo '<li><strong>' . esc_html($widget) . ':</strong> <span>Connect data source</span></li>';
        }
        echo '</ul>';
    });
});
