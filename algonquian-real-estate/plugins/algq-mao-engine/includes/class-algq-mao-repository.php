<?php

if (! defined('ABSPATH')) {
    exit;
}

class ALGQ_MAO_Repository
{
    public function create(array $calculation): int
    {
        global $wpdb;

        $inputs = $calculation['inputs'];
        $wpdb->insert(
            ALGQ_MAO_Activator::table_name(),
            array(
                'deal_name' => $inputs['deal_name'],
                'property_address' => $inputs['property_address'],
                'lead_source' => $inputs['lead_source'],
                'arv' => $inputs['arv'],
                'repairs' => $inputs['repairs'],
                'closing_costs' => $inputs['closing_costs'],
                'holding_costs' => $inputs['holding_costs'],
                'selling_costs' => $inputs['selling_costs'],
                'financing_costs' => $inputs['financing_costs'],
                'desired_profit' => $inputs['desired_profit'],
                'wholesale_fee' => $inputs['wholesale_fee'],
                'safety_buffer' => $inputs['safety_buffer'],
                'maximum_allowable_offer' => $calculation['maximum_allowable_offer'],
                'offer_low' => $calculation['offer_low'],
                'offer_high' => $calculation['offer_high'],
                'offer_percent' => $calculation['offer_percent'],
                'inputs' => wp_json_encode($inputs),
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql'),
            ),
            array('%s', '%s', '%s', '%f', '%f', '%f', '%f', '%f', '%f', '%f', '%f', '%f', '%f', '%f', '%f', '%f', '%s', '%d', '%s')
        );

        return (int) $wpdb->insert_id;
    }

    public function latest(int $limit = 25): array
    {
        global $wpdb;

        $limit = max(1, min(100, $limit));
        $table_name = ALGQ_MAO_Activator::table_name();

        return $wpdb->get_results(
            $wpdb->prepare("SELECT * FROM {$table_name} ORDER BY created_at DESC LIMIT %d", $limit),
            ARRAY_A
        );
    }
}
