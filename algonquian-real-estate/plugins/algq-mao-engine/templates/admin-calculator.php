<?php
if (! defined('ABSPATH')) {
    exit;
}
?>
<div class="wrap algq-mao-wrap">
    <h1><?php esc_html_e('Algonquian MAO Engine', 'algq-mao-engine'); ?></h1>
    <p><?php esc_html_e('Calculate acquisition offer ranges using ARV, cost, profit, wholesale, and risk assumptions.', 'algq-mao-engine'); ?></p>

    <?php if (is_array($calculation)) : ?>
        <div class="notice notice-success is-dismissible">
            <p>
                <?php
                printf(
                    esc_html__('Calculation saved. MAO: %1$s | Range: %2$s - %3$s', 'algq-mao-engine'),
                    esc_html(number_format_i18n($calculation['maximum_allowable_offer'], 2)),
                    esc_html(number_format_i18n($calculation['offer_low'], 2)),
                    esc_html(number_format_i18n($calculation['offer_high'], 2))
                );
                ?>
            </p>
        </div>
    <?php endif; ?>

    <form method="post" class="algq-mao-card algq-mao-grid">
        <?php wp_nonce_field('algq_mao_admin_calculate', 'algq_mao_nonce'); ?>
        <?php
        $fields = array(
            'deal_name' => __('Deal Name', 'algq-mao-engine'),
            'property_address' => __('Property Address', 'algq-mao-engine'),
            'lead_source' => __('Lead Source', 'algq-mao-engine'),
            'arv' => __('After Repair Value', 'algq-mao-engine'),
            'repairs' => __('Repairs', 'algq-mao-engine'),
            'closing_costs' => __('Closing Costs', 'algq-mao-engine'),
            'holding_costs' => __('Holding Costs', 'algq-mao-engine'),
            'selling_costs' => __('Selling Costs', 'algq-mao-engine'),
            'financing_costs' => __('Financing Costs', 'algq-mao-engine'),
            'desired_profit' => __('Desired Profit', 'algq-mao-engine'),
            'wholesale_fee' => __('Wholesale Fee', 'algq-mao-engine'),
            'safety_buffer' => __('Safety Buffer', 'algq-mao-engine'),
        );
        foreach ($fields as $name => $label) :
            $type = in_array($name, array('deal_name', 'property_address', 'lead_source'), true) ? 'text' : 'number';
            ?>
            <label>
                <span><?php echo esc_html($label); ?></span>
                <input type="<?php echo esc_attr($type); ?>" name="<?php echo esc_attr($name); ?>" step="0.01" min="0">
            </label>
        <?php endforeach; ?>
        <button class="button button-primary" type="submit"><?php esc_html_e('Calculate & Save', 'algq-mao-engine'); ?></button>
    </form>

    <h2><?php esc_html_e('Recent Calculations', 'algq-mao-engine'); ?></h2>
    <table class="widefat striped">
        <thead><tr><th><?php esc_html_e('Deal', 'algq-mao-engine'); ?></th><th><?php esc_html_e('ARV', 'algq-mao-engine'); ?></th><th><?php esc_html_e('MAO', 'algq-mao-engine'); ?></th><th><?php esc_html_e('Created', 'algq-mao-engine'); ?></th></tr></thead>
        <tbody>
        <?php foreach ($history as $item) : ?>
            <tr>
                <td><?php echo esc_html($item['deal_name'] ?: $item['property_address']); ?></td>
                <td><?php echo esc_html(number_format_i18n((float) $item['arv'], 2)); ?></td>
                <td><?php echo esc_html(number_format_i18n((float) $item['maximum_allowable_offer'], 2)); ?></td>
                <td><?php echo esc_html($item['created_at']); ?></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
</div>
