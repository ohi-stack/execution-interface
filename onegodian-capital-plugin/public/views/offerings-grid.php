<?php
$offering = [
    'title' => __('Sample Capital Instrument', 'onegodian-capital'),
    'instrument_type' => __('Configurable', 'onegodian-capital'),
    'status' => __('Pending Review', 'onegodian-capital'),
    'minimum_purchase' => __('Configured per offering', 'onegodian-capital'),
    'maximum_purchase' => __('Configured per offering', 'onegodian-capital'),
    'raise_target' => __('Configured per offering', 'onegodian-capital'),
    'disclosure_packet_version' => __('v0.0.0 placeholder', 'onegodian-capital'),
];
?>
<div class="onegodian-capital-portal">
    <div class="og-warning"><strong><?php esc_html_e('Disclosure-first notice:', 'onegodian-capital'); ?></strong> <?php esc_html_e('This portal displays records and disclosures only. Review disclosure materials before any workflow continuation.', 'onegodian-capital'); ?></div>
    <div class="og-grid">
        <article class="og-card">
            <h3><?php echo esc_html($offering['title']); ?></h3>
            <dl class="og-kv">
                <dt>instrument_type</dt><dd><?php echo esc_html($offering['instrument_type']); ?></dd>
                <dt>status</dt><dd><span class="og-badge og-badge--pending"><?php echo esc_html($offering['status']); ?></span></dd>
                <dt>minimum_purchase</dt><dd><?php echo esc_html($offering['minimum_purchase']); ?></dd>
                <dt>maximum_purchase</dt><dd><?php echo esc_html($offering['maximum_purchase']); ?></dd>
                <dt>raise_target</dt><dd><?php echo esc_html($offering['raise_target']); ?></dd>
                <dt>disclosure_packet_version</dt><dd><?php echo esc_html($offering['disclosure_packet_version']); ?></dd>
            </dl>
            <p><a class="og-cta" href="#"><?php esc_html_e('View Offering', 'onegodian-capital'); ?></a></p>
        </article>
    </div>
</div>
