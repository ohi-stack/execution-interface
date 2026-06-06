<?php

class Algq_Marketplace_Plugin_Loads_Test extends Algq_Marketplace_TestCase
{
    public function test_main_plugin_file_exists_and_loaded(): void
    {
        $this->assertFileExists(ALGQ_MARKETPLACE_TESTS_PLUGIN_FILE);
        $this->assertTrue(function_exists('algq_marketplace'));
        $this->assertInstanceOf(ALGQ_Deal_Marketplace::class, algq_marketplace());
    }

    public function test_required_constants_are_defined(): void
    {
        $this->assertSame('1.0.1', ALGQ_DEAL_MARKETPLACE_VERSION);
        $this->assertSame('1.0.1', ALGQ_MARKETPLACE_VERSION);
        $this->assertSame(ALGQ_MARKETPLACE_TESTS_PLUGIN_FILE, ALGQ_MARKETPLACE_FILE);
        $this->assertDirectoryExists(ALGQ_MARKETPLACE_DIR);
        $this->assertNotEmpty(ALGQ_MARKETPLACE_URL);
    }

    public function test_core_classes_exist_after_bootstrap(): void
    {
        $this->assertTrue(class_exists('ALGQ_Deal_Marketplace'));
        $this->assertTrue(class_exists('ALGQ_Deal_Marketplace_Activator'));
        $this->assertTrue(class_exists('ALGQ_Deal_Marketplace_Security'));
    }

    public function test_optional_plugins_can_be_inactive_without_fatals(): void
    {
        $integrations = new ALGQ_Deal_Marketplace_Integrations(new ALGQ_Deal_Marketplace_Cache());
        $status = $integrations->suite_status();

        $this->assertArrayHasKey('deal_intake', $status);
        $this->assertArrayHasKey('command_center', $status);
    }
}
