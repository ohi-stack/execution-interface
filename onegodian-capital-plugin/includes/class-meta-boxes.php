<?php
class Onegodian_Capital_Meta_Boxes {
    public static function register_meta() {
        $fields = ['instrument_type','status','minimum_purchase','maximum_purchase','raise_target','issue_date','maturity_date','term_months','repayment_terms','use_of_funds','disclosure_packet_version'];
        foreach ($fields as $field) {
            register_post_meta('onegodian_offering', $field, ['show_in_rest' => true, 'single' => true, 'type' => 'string']);
        }
    }
}
