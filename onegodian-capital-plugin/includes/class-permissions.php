<?php
class Onegodian_Capital_Permissions {
    public static function register_caps() {
        $role = get_role('administrator');
        if (!$role) { return; }
        $caps = ['manage_onegodian_capital','view_onegodian_ledger','issue_onegodian_instruments','manage_onegodian_disclosures','export_onegodian_capital_records'];
        foreach ($caps as $cap) { $role->add_cap($cap); }
    }
}
