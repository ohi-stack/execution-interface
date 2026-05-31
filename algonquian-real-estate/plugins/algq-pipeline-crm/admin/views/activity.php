<?php
/**
 * Activity view.
 *
 * @package Algonquian_Pipeline_CRM
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="wrap algq-pipeline-wrap">
    <h1><?php esc_html_e('Pipeline Activity', 'algq-pipeline-crm'); ?></h1>
    <table class="widefat striped">
        <thead><tr><th><?php esc_html_e('Time', 'algq-pipeline-crm'); ?></th><th><?php esc_html_e('Deal', 'algq-pipeline-crm'); ?></th><th><?php esc_html_e('Type', 'algq-pipeline-crm'); ?></th><th><?php esc_html_e('Note', 'algq-pipeline-crm'); ?></th><th><?php esc_html_e('Change', 'algq-pipeline-crm'); ?></th></tr></thead>
        <tbody>
        <?php foreach ($activity as $item) : ?>
            <tr>
                <td><?php echo esc_html((string) $item['created_at']); ?></td>
                <td>#<?php echo esc_html((string) $item['deal_id']); ?></td>
                <td><code><?php echo esc_html((string) $item['activity_type']); ?></code></td>
                <td><?php echo esc_html((string) $item['activity_note']); ?></td>
                <td><?php echo esc_html(trim((string) $item['old_value'] . ' → ' . (string) $item['new_value'], ' →')); ?></td>
            </tr>
        <?php endforeach; ?>
        <?php if ([] === $activity) : ?>
            <tr><td colspan="5"><?php esc_html_e('No activity has been logged yet.', 'algq-pipeline-crm'); ?></td></tr>
        <?php endif; ?>
        </tbody>
    </table>
</div>
