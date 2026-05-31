<?php
/**
 * Pipeline board view.
 *
 * @package Algonquian_Pipeline_CRM
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="algq-pipeline-board" data-algq-pipeline-board>
    <?php foreach ($stages as $stage) : ?>
        <?php
        $stage_key = (string) $stage['stage_key'];
        $stage_deals = $grouped_deals[$stage_key] ?? [];
        ?>
        <section class="algq-pipeline-column" data-stage-key="<?php echo esc_attr($stage_key); ?>">
            <header class="algq-pipeline-column__header">
                <h2><?php echo esc_html((string) $stage['stage_label']); ?></h2>
                <span class="algq-pipeline-count" data-stage-count><?php echo esc_html((string) count($stage_deals)); ?></span>
            </header>
            <div class="algq-pipeline-dropzone" data-stage-key="<?php echo esc_attr($stage_key); ?>">
                <?php foreach ($stage_deals as $deal) : ?>
                    <article class="algq-pipeline-card" draggable="true" data-deal-id="<?php echo esc_attr((string) $deal['id']); ?>">
                        <div class="algq-pipeline-card__topline">
                            <strong><?php echo esc_html(sprintf(__('Deal #%d', 'algq-pipeline-crm'), absint($deal['id']))); ?></strong>
                            <span class="algq-pipeline-priority algq-pipeline-priority--<?php echo esc_attr((string) $deal['priority']); ?>"><?php echo esc_html(ucfirst((string) $deal['priority'])); ?></span>
                        </div>
                        <h3><?php echo esc_html((string) $deal['property_address']); ?></h3>
                        <dl class="algq-pipeline-card__meta">
                            <div><dt><?php esc_html_e('Seller', 'algq-pipeline-crm'); ?></dt><dd><?php echo esc_html((string) $deal['seller_name']); ?></dd></div>
                            <div><dt><?php esc_html_e('Assigned', 'algq-pipeline-crm'); ?></dt><dd><?php echo esc_html($this->get_assigned_user_name($deal)); ?></dd></div>
                            <div><dt><?php esc_html_e('Days in stage', 'algq-pipeline-crm'); ?></dt><dd><?php echo esc_html((string) $this->get_days_in_stage($deal)); ?></dd></div>
                            <div><dt><?php esc_html_e('Asking', 'algq-pipeline-crm'); ?></dt><dd><?php echo esc_html($this->format_money($deal['asking_price'])); ?></dd></div>
                            <?php if ('' !== (string) $deal['estimated_arv'] && null !== $deal['estimated_arv']) : ?>
                                <div><dt><?php esc_html_e('ARV', 'algq-pipeline-crm'); ?></dt><dd><?php echo esc_html($this->format_money($deal['estimated_arv'])); ?></dd></div>
                            <?php endif; ?>
                        </dl>
                    </article>
                <?php endforeach; ?>
            </div>
        </section>
    <?php endforeach; ?>
</div>
