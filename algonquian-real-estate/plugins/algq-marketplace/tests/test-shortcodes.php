<?php

class Algq_Marketplace_Shortcodes_Test extends Algq_Marketplace_TestCase
{
    public function test_marketplace_shortcode_is_registered(): void
    {
        $this->assertTrue(shortcode_exists('algq_marketplace'));
    }

    public function test_marketplace_shortcode_renders_expected_safe_markup(): void
    {
        $html = algq_marketplace()->render_shortcode();

        $this->assertNotFalse(strpos($html, 'algq-marketplace'));
        $this->assertNotFalse(strpos($html, 'ARE Marketplace'));
        $this->assertNotFalse(strpos($html, 'Wholesale deals'));
    }
}
