<?php
/**
 * Settings view.
 *
 * @package Algonquian_Pipeline_CRM
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="wrap algq-pipeline-wrap">
    <h1><?php esc_html_e('Pipeline Settings', 'algq-pipeline-crm'); ?></h1>
    <p><?php esc_html_e('Default acquisition stages are managed automatically for this MVP.', 'algq-pipeline-crm'); ?></p>
    <h2><?php esc_html_e('Default Stages', 'algq-pipeline-crm'); ?></h2>
    <table class="widefat striped">
        <thead><tr><th><?php esc_html_e('Key', 'algq-pipeline-crm'); ?></th><th><?php esc_html_e('Label', 'algq-pipeline-crm'); ?></th><th><?php esc_html_e('Order', 'algq-pipeline-crm'); ?></th></tr></thead>
        <tbody>
        <?php foreach ($stages as $stage) : ?>
            <tr><td><code><?php echo esc_html((string) $stage['stage_key']); ?></code></td><td><?php echo esc_html((string) $stage['stage_label']); ?></td><td><?php echo esc_html((string) $stage['stage_order']); ?></td></tr>
        <?php endforeach; ?>
        </tbody>
    </table>
</div>
