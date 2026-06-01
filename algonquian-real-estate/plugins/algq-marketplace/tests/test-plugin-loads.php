<?php

class Algq_Marketplace_Plugin_Loads_Test extends Algq_Marketplace_TestCase
{
    public function test_main_plugin_file_exists_and_loaded(): void
    {
        $this->assertFileExists(ALGQ_MARKETPLACE_TESTS_PLUGIN_FILE);
        $this->assertTrue(function_exists('algq_marketplace'));
        $this->assertInstanceOf(Algq_Marketplace_Plugin::class, algq_marketplace());
    }

    public function test_required_constants_are_defined(): void
    {
        $this->assertSame('0.1.0', ALGQ_MARKETPLACE_VERSION);
        $this->assertSame(ALGQ_MARKETPLACE_TESTS_PLUGIN_FILE, ALGQ_MARKETPLACE_FILE);
        $this->assertDirectoryExists(ALGQ_MARKETPLACE_DIR);
        $this->assertNotEmpty(ALGQ_MARKETPLACE_URL);
    }

    public function test_core_classes_exist_after_bootstrap(): void
    {
        $this->assertTrue(class_exists('Algq_Marketplace_Plugin'));
        $this->assertTrue(class_exists('Algq_Marketplace_Activator'));
        $this->assertTrue(class_exists('Algq_Marketplace_Sanitizer'));
    }
}
