<?php

if (!defined('ABSPATH')) {
    exit;
}

class QOHI_Bridge_Certificate_Trigger
{
    private QOHI_Bridge_Http_Client $http_client;

    public function __construct(QOHI_Bridge_Http_Client $http_client)
    {
        $this->http_client = $http_client;
    }

    public function trigger_for_order(int $order_id): array
    {
        $payload = [
            'workflow' => 'certificate.issue',
            'source' => 'wordpress',
            'orderId' => $order_id,
        ];

        return $this->http_client->post_execute($payload);
    }
}
