<?php
if (! defined('ABSPATH')) {
    exit;
}
?>
<div class="algq-mao-public" data-algq-mao-calculator>
    <h2><?php echo esc_html($atts['title']); ?></h2>
    <form class="algq-mao-card algq-mao-grid">
        <label><span><?php esc_html_e('After Repair Value', 'algq-mao-engine'); ?></span><input name="arv" type="number" step="0.01" min="0" required></label>
        <label><span><?php esc_html_e('Repairs', 'algq-mao-engine'); ?></span><input name="repairs" type="number" step="0.01" min="0"></label>
        <label><span><?php esc_html_e('Closing Costs', 'algq-mao-engine'); ?></span><input name="closing_costs" type="number" step="0.01" min="0"></label>
        <label><span><?php esc_html_e('Holding Costs', 'algq-mao-engine'); ?></span><input name="holding_costs" type="number" step="0.01" min="0"></label>
        <label><span><?php esc_html_e('Selling Costs', 'algq-mao-engine'); ?></span><input name="selling_costs" type="number" step="0.01" min="0"></label>
        <label><span><?php esc_html_e('Financing Costs', 'algq-mao-engine'); ?></span><input name="financing_costs" type="number" step="0.01" min="0"></label>
        <label><span><?php esc_html_e('Desired Profit', 'algq-mao-engine'); ?></span><input name="desired_profit" type="number" step="0.01" min="0"></label>
        <label><span><?php esc_html_e('Wholesale Fee', 'algq-mao-engine'); ?></span><input name="wholesale_fee" type="number" step="0.01" min="0"></label>
        <label><span><?php esc_html_e('Safety Buffer', 'algq-mao-engine'); ?></span><input name="safety_buffer" type="number" step="0.01" min="0"></label>
        <button type="submit"><?php esc_html_e('Calculate MAO', 'algq-mao-engine'); ?></button>
    </form>
    <output class="algq-mao-result" aria-live="polite"></output>
</div>
