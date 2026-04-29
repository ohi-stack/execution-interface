<div class="wrap onegodian-admin-wrap">
    <div class="og-admin-warning"><strong>Ledger scope:</strong> Administrative ledger recordkeeping only.</div>
    <table class="og-admin-table">
        <thead><tr><th>Entry ID</th><th>Type</th><th>Status</th><th>Timestamp</th></tr></thead>
        <tbody><tr><td>placeholder</td><td>placeholder</td><td><span class="og-admin-badge">Pending</span></td><td>—</td></tr></tbody>
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
