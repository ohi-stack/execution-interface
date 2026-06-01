<?php

class Algq_Marketplace_Sanitization_Test extends Algq_Marketplace_TestCase
{
    public function test_text_sanitizer_strips_markup(): void
    {
        $this->assertSame('Featured Deal', Algq_Marketplace_Sanitizer::text(' <script>alert(1)</script>Featured Deal '));
    }

    public function test_key_sanitizer_returns_safe_key(): void
    {
        $this->assertSame('premium-listing_1', Algq_Marketplace_Sanitizer::key('Premium Listing_1!'));
    }

    public function test_url_sanitizer_rejects_unsafe_protocols(): void
    {
        $this->assertSame('', Algq_Marketplace_Sanitizer::url('javascript:alert(1)'));
        $this->assertSame('https://example.com/deal', Algq_Marketplace_Sanitizer::url('https://example.com/deal'));
    }

    public function test_textarea_sanitizer_strips_markup(): void
    {
        $this->assertSame("Line one\nLine two", Algq_Marketplace_Sanitizer::textarea("Line one\n<strong>Line two</strong>"));
    }
}
