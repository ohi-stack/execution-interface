<?php

class Algq_Marketplace_Capabilities_Test extends Algq_Marketplace_TestCase
{
    public function test_capabilities_are_declared_for_expected_roles(): void
    {
        $capabilities = Algq_Marketplace_Activator::capabilities();

        $this->assertArrayHasKey('administrator', $capabilities);
        $this->assertArrayHasKey('algq_marketplace_manager', $capabilities);
        $this->assertArrayHasKey('algq_investor', $capabilities);
        $this->assertContains('algq_manage_marketplace', $capabilities['administrator']);
        $this->assertContains('algq_publish_marketplace_deals', $capabilities['algq_marketplace_manager']);
        $this->assertContains('algq_view_marketplace_deals', $capabilities['algq_investor']);
    }
}
