<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Offer_Merge_Engine
{
    /** @var array<string,string> */
    private array $defaults = [
        'seller_name' => 'Seller',
        'buyer_name' => 'Algonquian Real Estate',
        'property_address' => 'Property address pending',
        'purchase_price' => '$0',
        'earnest_money' => '$1,000',
        'closing_date' => 'TBD',
        'offer_terms' => 'Offer terms pending final review.',
        'generated_date' => '',
    ];

    /**
     * @return array<string,string>
     */
    public function normalize(array $input): array
    {
        $values = $this->defaults;
        $values['generated_date'] = gmdate('Y-m-d');

        foreach ($input as $key => $value) {
            $key = sanitize_key((string) $key);
            if ('' === $key) {
                continue;
            }
            $values[$key] = is_scalar($value) ? sanitize_textarea_field((string) $value) : wp_json_encode($value);
        }

        return $values;
    }

    public function merge(string $template, array $payload): string
    {
        $payload = $this->normalize($payload);
        foreach ($payload as $key => $value) {
            $template = str_replace('{{' . $key . '}}', $value, $template);
        }
        return $template;
    }

    /**
     * @return array<string,string>
     */
    public function field_labels(): array
    {
        return [
            'seller_name' => __('Seller Name', 'algq-offer-generator'),
            'buyer_name' => __('Buyer Name', 'algq-offer-generator'),
            'property_address' => __('Property Address', 'algq-offer-generator'),
            'purchase_price' => __('Purchase Price', 'algq-offer-generator'),
            'earnest_money' => __('Earnest Money', 'algq-offer-generator'),
            'closing_date' => __('Closing Date', 'algq-offer-generator'),
            'offer_terms' => __('Offer Terms', 'algq-offer-generator'),
            'generated_date' => __('Generated Date', 'algq-offer-generator'),
        ];
    }
}
