<?php

class Algq_Marketplace_Activation_Test extends Algq_Marketplace_TestCase
{
    public function test_activation_class_and_method_exist(): void
    {
        $this->assertTrue(class_exists('Algq_Marketplace_Activator'));
        $this->assertTrue(method_exists('Algq_Marketplace_Activator', 'activate'));
    }

    public function test_generated_page_definitions_are_available(): void
    {
        $pages = Algq_Marketplace_Activator::generated_pages();

        $this->assertNotEmpty($pages);
        $this->assertSame('are-marketplace', $pages[0]['slug']);
        $this->assertSame('ARE Marketplace', $pages[0]['title']);
        $this->assertSame('[algq_marketplace]', $pages[0]['content']);
        $this->assertSame('algq_marketplace_page_id', $pages[0]['option_name']);
        $this->assertSame($pages, algq_marketplace_generated_pages());
    }

    public function test_activation_hook_is_registered_when_using_shims(): void
    {
        if (!isset($GLOBALS['algq_marketplace_activation_hooks'])) {
            $this->markTestSkipped('Activation hook registry is only available in the lightweight test shims.');
        }

        $this->assertArrayHasKey(ALGQ_MARKETPLACE_TESTS_PLUGIN_FILE, $GLOBALS['algq_marketplace_activation_hooks']);
        $this->assertSame(['Algq_Marketplace_Activator', 'activate'], $GLOBALS['algq_marketplace_activation_hooks'][ALGQ_MARKETPLACE_TESTS_PLUGIN_FILE]);
    }
}
