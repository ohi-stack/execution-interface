<?php

class Algq_Marketplace_Shortcodes_Test extends Algq_Marketplace_TestCase
{
    public function test_marketplace_shortcodes_are_registered(): void
    {
        $this->assertTrue(shortcode_exists('algq_marketplace'));
        $this->assertTrue(shortcode_exists('algq_deal_marketplace'));
    }

    public function test_marketplace_shortcode_renders_expected_safe_markup(): void
    {
        $html = call_user_func($GLOBALS['shortcode_tags']['algq_marketplace']);

        $this->assertNotFalse(strpos($html, 'algq-marketplace'));
        $this->assertNotFalse(strpos($html, 'ARE Deal Marketplace'));
        $this->assertNotFalse(strpos($html, 'Wholesale deals'));
        $this->assertNotFalse(strpos($html, 'algq_deal_marketplace_interest'));
        $this->assertNotFalse(strpos($html, 'NDA acceptance is required'));
    }
}
