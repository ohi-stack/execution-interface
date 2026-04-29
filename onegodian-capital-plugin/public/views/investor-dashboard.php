<div class="onegodian-capital-portal">
    <h2 class="og-heading">Investor Dashboard</h2>
    <div class="og-grid">
        <section class="og-panel"><h3>My Capital Instruments</h3><table class="og-table"><tr><th>Instrument</th><th>Status</th></tr><tr><td>Placeholder</td><td><span class="og-badge og-badge--draft">Draft</span></td></tr></table></section>
        <section class="og-panel"><h3>Certificates</h3><table class="og-table"><tr><th>Certificate</th><th>Status</th></tr><tr><td>Placeholder</td><td><span class="og-badge og-badge--pending">Pending</span></td></tr></table></section>
        <section class="og-panel"><h3>Disclosure Acceptances</h3><table class="og-table"><tr><th>Packet</th><th>Acceptance</th></tr><tr><td>v0.0.0</td><td>Not yet accepted</td></tr></table></section>
        <section class="og-panel"><h3>Ledger History</h3><table class="og-table"><tr><th>Entry</th><th>Date</th></tr><tr><td>Placeholder ledger row</td><td>—</td></tr></table></section>
        <section class="og-panel"><h3>Account Notices</h3><div class="og-warning">No active notices. Compliance notices appear here when configured.</div></section>
    </div>
</div>
<?php
if (!defined('ABSPATH')) { exit; }
if (!is_user_logged_in()) {
    echo '<p>' . esc_html__('Please log in to view your instruments.', 'onegodian-capital') . '</p>';
    return;
}
global $wpdb;
$table = $wpdb->prefix . 'onegodian_capital_instruments';
$cert_table = $wpdb->prefix . 'onegodian_capital_certificates';
$rows = $wpdb->get_results($wpdb->prepare("SELECT i.instrument_number, i.instrument_type, i.principal_amount, i.status, i.issue_date, i.maturity_date, c.id AS certificate_id FROM {$table} i LEFT JOIN {$cert_table} c ON c.instrument_id = i.id WHERE i.user_id = %d ORDER BY i.created_at DESC", get_current_user_id()), ARRAY_A);
?>
<table>
    <thead><tr><th>Instrument #</th><th>Type</th><th>Principal</th><th>Status</th><th>Issue Date</th><th>Maturity Date</th><th>Certificate ID</th></tr></thead>
    <tbody>
        <?php foreach ($rows as $row) : ?>
            <tr>
                <td><?php echo esc_html($row['instrument_number']); ?></td>
                <td><?php echo esc_html($row['instrument_type']); ?></td>
                <td><?php echo esc_html($row['principal_amount']); ?></td>
                <td><?php echo esc_html($row['status']); ?></td>
                <td><?php echo esc_html($row['issue_date']); ?></td>
                <td><?php echo esc_html($row['maturity_date']); ?></td>
                <td><?php echo esc_html($row['certificate_id']); ?></td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>
