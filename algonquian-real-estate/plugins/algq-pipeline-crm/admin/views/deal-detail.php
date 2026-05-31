<?php
/**
 * Deal detail view.
 *
 * @package Algonquian_Pipeline_CRM
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="wrap algq-pipeline-wrap">
    <h1><?php esc_html_e('Deal Detail', 'algq-pipeline-crm'); ?></h1>
    <?php if (!$deal) : ?>
        <p><?php esc_html_e('Deal not found.', 'algq-pipeline-crm'); ?></p>
    <?php else : ?>
        <table class="widefat striped algq-pipeline-detail-table">
            <tbody>
                <tr><th><?php esc_html_e('Deal ID', 'algq-pipeline-crm'); ?></th><td>#<?php echo esc_html((string) $deal['id']); ?></td></tr>
                <tr><th><?php esc_html_e('Property Address', 'algq-pipeline-crm'); ?></th><td><?php echo esc_html((string) $deal['property_address']); ?></td></tr>
                <tr><th><?php esc_html_e('Seller', 'algq-pipeline-crm'); ?></th><td><?php echo esc_html((string) $deal['seller_name']); ?></td></tr>
                <tr><th><?php esc_html_e('Stage', 'algq-pipeline-crm'); ?></th><td><?php echo esc_html((string) $deal['stage_key']); ?></td></tr>
                <tr><th><?php esc_html_e('Priority', 'algq-pipeline-crm'); ?></th><td><?php echo esc_html((string) $deal['priority']); ?></td></tr>
                <tr><th><?php esc_html_e('Asking Price', 'algq-pipeline-crm'); ?></th><td><?php echo esc_html($this->board->format_money($deal['asking_price'])); ?></td></tr>
                <tr><th><?php esc_html_e('Estimated ARV', 'algq-pipeline-crm'); ?></th><td><?php echo esc_html($this->board->format_money($deal['estimated_arv'])); ?></td></tr>
                <tr><th><?php esc_html_e('Created', 'algq-pipeline-crm'); ?></th><td><?php echo esc_html((string) $deal['created_at']); ?></td></tr>
                <tr><th><?php esc_html_e('Updated', 'algq-pipeline-crm'); ?></th><td><?php echo esc_html((string) $deal['updated_at']); ?></td></tr>
            </tbody>
        </table>
    <?php endif; ?>
</div>
