<?php if (!defined('ABSPATH')) { exit; } ?>
<form method="post">
    <?php wp_nonce_field('onegodian_accept_disclosure', 'onegodian_accept_disclosure_nonce'); ?>
    <p><?php echo esc_html__('Disclosure acceptance is required before any paid order can issue an instrument record.', 'onegodian-capital'); ?></p>
    <button type="submit"><?php echo esc_html__('Accept Disclosure', 'onegodian-capital'); ?></button>
</form>
