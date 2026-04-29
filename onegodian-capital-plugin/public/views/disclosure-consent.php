<div class="onegodian-capital-portal og-panel og-navy-panel">
    <p class="og-eyebrow">Disclosure</p>
    <h2 class="og-heading">Disclosure Consent</h2>
    <div class="og-warning">Disclosure packet consent is required before progression in the scaffolded purchase flow.</div>
    <div class="onegodian-capital-table-wrap"><table class="og-table onegodian-capital-responsive-table">
        <thead><tr><th>disclosure_packet_version</th><th>status</th><th>accepted_on</th></tr></thead>
        <tbody><tr><td>v0.0.0 placeholder</td><td><span class="og-badge og-badge--pending">Awaiting Acceptance</span></td><td>—</td></tr></tbody>
    </table></div>
</div>
<?php if (!defined('ABSPATH')) { exit; } ?>
<form method="post">
    <?php wp_nonce_field('onegodian_accept_disclosure', 'onegodian_accept_disclosure_nonce'); ?>
    <p><?php echo esc_html__('Disclosure acceptance is required before any paid order can issue an instrument record.', 'onegodian-capital'); ?></p>
    <button type="submit"><?php echo esc_html__('Accept Disclosure', 'onegodian-capital'); ?></button>
</form>
