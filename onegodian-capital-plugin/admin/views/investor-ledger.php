<?php
if (!defined('ABSPATH')) { exit; }
if (!current_user_can('view_onegodian_ledger')) {
    wp_die(esc_html__('Insufficient permissions.', 'onegodian-capital'));
}
$rows = Onegodian_Capital_Ledger::get_rows();
?>
<div class="wrap">
    <h1><?php echo esc_html__('Investor Ledger', 'onegodian-capital'); ?></h1>
    <table class="widefat fixed striped">
        <thead><tr><th>ID</th><th>Instrument</th><th>Type</th><th>Amount</th><th>Currency</th><th>Reference ID</th><th>Created</th></tr></thead>
        <tbody>
            <?php foreach ($rows as $row) : ?>
                <tr>
                    <td><?php echo esc_html($row['id']); ?></td>
                    <td><?php echo esc_html($row['instrument_id']); ?></td>
                    <td><?php echo esc_html($row['entry_type']); ?></td>
                    <td><?php echo esc_html($row['amount']); ?></td>
                    <td><?php echo esc_html($row['currency']); ?></td>
                    <td><?php echo esc_html($row['reference_id']); ?></td>
                    <td><?php echo esc_html($row['created_at']); ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
