<?php

class Algq_Marketplace_Capabilities_Test extends Algq_Marketplace_TestCase
{
    public function test_capabilities_are_declared_for_expected_roles(): void
    {
        $capabilities = ALGQ_Deal_Marketplace_Capabilities::capabilities();

        $this->assertContains('algq_manage_deal_marketplace', $capabilities);
        $this->assertContains('algq_view_deal_marketplace', $capabilities);
        $this->assertContains('algq_submit_deal_interest', $capabilities);
        $this->assertContains('algq_manage_deal_ndas', $capabilities);
    }
}
