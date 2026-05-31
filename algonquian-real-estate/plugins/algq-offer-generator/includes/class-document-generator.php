<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Offer_Document_Generator
{
    private ALGQ_Offer_Merge_Engine $merge_engine;

    /** @var array<string,string> */
    private array $templates = [
        'loi' => '<h1>Letter of Intent</h1><p>{{buyer_name}} offers to purchase {{property_address}} from {{seller_name}} for {{purchase_price}}.</p><p>Earnest money: {{earnest_money}}. Closing date: {{closing_date}}.</p><p>{{offer_terms}}</p><p>Generated: {{generated_date}}</p>',
        'purchase_agreement' => '<h1>Purchase Agreement Summary</h1><p>Buyer: {{buyer_name}}</p><p>Seller: {{seller_name}}</p><p>Property: {{property_address}}</p><p>Purchase price: {{purchase_price}}</p><p>Terms: {{offer_terms}}</p>',
        'seller_financing' => '<h1>Seller Financing Sheet</h1><p>{{seller_name}} financing terms for {{property_address}}.</p><p>Price: {{purchase_price}}</p><p>{{offer_terms}}</p>',
        'assignment_contract' => '<h1>Assignment Contract Summary</h1><p>Contract rights for {{property_address}} are prepared for assignment review.</p><p>{{offer_terms}}</p>',
    ];

    public function __construct(ALGQ_Offer_Merge_Engine $merge_engine)
    {
        $this->merge_engine = $merge_engine;
    }

    public function generate(string $document_type, array $payload): array
    {
        $document_type = sanitize_key($document_type);
        $template = $this->templates[$document_type] ?? $this->templates['loi'];
        $merged = $this->merge_engine->merge($template, $payload);

        return [
            'document_type' => $document_type,
            'title' => $this->title_for($document_type),
            'merge_payload' => $this->merge_engine->normalize($payload),
            'rendered_html' => '<article class="algq-offer-document">' . wp_kses_post($merged) . '</article>',
        ];
    }

    private function title_for(string $document_type): string
    {
        $titles = [
            'loi' => __('Letter of Intent', 'algq-offer-generator'),
            'purchase_agreement' => __('Purchase Agreement', 'algq-offer-generator'),
            'seller_financing' => __('Seller Financing Sheet', 'algq-offer-generator'),
            'assignment_contract' => __('Assignment Contract', 'algq-offer-generator'),
        ];
        return $titles[$document_type] ?? __('Offer Document', 'algq-offer-generator');
    }
}
