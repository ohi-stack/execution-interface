<?php

if (! defined('ABSPATH')) {
    exit;
}

class ALGQ_MAO_Calculator
{
    private const MONEY_FIELDS = array(
        'arv',
        'repairs',
        'closing_costs',
        'holding_costs',
        'selling_costs',
        'financing_costs',
        'desired_profit',
        'wholesale_fee',
        'safety_buffer',
    );

    public function calculate(array $raw_input): array
    {
        $input = $this->sanitize_input($raw_input);
        $costs = $input['repairs'] + $input['closing_costs'] + $input['holding_costs'] + $input['selling_costs'] + $input['financing_costs'] + $input['desired_profit'] + $input['wholesale_fee'] + $input['safety_buffer'];
        $mao = max(0, $input['arv'] - $costs);
        $low_multiplier = (float) apply_filters('algq_mao_offer_low_multiplier', 0.95, $input);
        $high_multiplier = (float) apply_filters('algq_mao_offer_high_multiplier', 1.02, $input);

        return array(
            'inputs' => $input,
            'cost_total' => round($costs, 2),
            'maximum_allowable_offer' => round($mao, 2),
            'offer_low' => round(max(0, $mao * $low_multiplier), 2),
            'offer_high' => round(max(0, $mao * $high_multiplier), 2),
            'offer_percent' => $input['arv'] > 0 ? round(($mao / $input['arv']) * 100, 4) : 0,
        );
    }

    public function sanitize_input(array $raw_input): array
    {
        $input = array(
            'deal_name' => isset($raw_input['deal_name']) ? sanitize_text_field(wp_unslash($raw_input['deal_name'])) : '',
            'property_address' => isset($raw_input['property_address']) ? sanitize_text_field(wp_unslash($raw_input['property_address'])) : '',
            'lead_source' => isset($raw_input['lead_source']) ? sanitize_text_field(wp_unslash($raw_input['lead_source'])) : '',
        );

        foreach (self::MONEY_FIELDS as $field) {
            $input[$field] = $this->sanitize_money($raw_input[$field] ?? 0);
        }

        return $input;
    }

    private function sanitize_money($value): float
    {
        if (is_string($value)) {
            $value = preg_replace('/[^0-9.\-]/', '', wp_unslash($value));
        }

        return round(max(0, (float) $value), 2);
    }
}
