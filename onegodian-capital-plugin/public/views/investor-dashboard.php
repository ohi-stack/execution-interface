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
