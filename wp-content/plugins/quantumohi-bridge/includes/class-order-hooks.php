<?php

if (!defined('ABSPATH')) {
    exit;
}

class QOHI_Bridge_Order_Hooks
{
    private QOHI_Bridge_Certificate_Trigger $trigger;

    public function __construct(QOHI_Bridge_Certificate_Trigger $trigger)
    {
        $this->trigger = $trigger;
    }

    public function register(): void
    {
        add_action('woocommerce_payment_complete', [$this, 'on_payment_complete'], 10, 1);
    }

    public function on_payment_complete(int $order_id): void
    {
        if ($order_id <= 0) {
            return;
        }

        $result = $this->trigger->trigger_for_order($order_id);

        if (!empty($result['requestId'])) {
            update_post_meta($order_id, '_qohi_request_id', sanitize_text_field((string) $result['requestId']));
        }

        if (!empty($result['data']['executionId'])) {
            update_post_meta($order_id, '_qohi_execution_id', sanitize_text_field((string) $result['data']['executionId']));
        }

        update_post_meta($order_id, '_qohi_bridge_last_result', wp_json_encode($result));
    }
}
