<?php

defined('ABSPATH') || exit;

class Onegodian_Capital_Widgets {
    public static function render_readiness_checklist(): string {
        $items = [
            'Legal review complete',
            'Disclosure approval complete',
            'Investor eligibility rules documented',
            'Stripe live-mode reviewed and approved',
            'Refund and cancellation policy approved',
            'Data retention policy approved',
            'Backup/export testing completed',
            'Admin permissions testing completed',
            'Certificate verification testing completed',
            'Tax/accounting review completed',
        ];

        $html = '<section class="ogc-widget-card"><h2>Readiness Checklist</h2><p>No live capital workflow may be activated until every item below is completed and documented.</p><ul>';
        foreach ($items as $item) {
            $html .= '<li>⬜ ' . esc_html($item) . '</li>';
        }

        return $html . '</ul></section>';
    }

    public static function render_shortcode_reference(): string {
        return '<section class="ogc-widget-card"><h2>Operational Boundary</h2><p>This admin layer is for recordkeeping and workflow controls only. Do not enable public offering checkout, live investment intake, paid-order issuance, or repayment workflows before readiness approval.</p></section>';
    }

    public static function render_help_panel(): string {
        return '<section class="ogc-widget-card"><h2>Admin Guidance</h2><p>Use Offerings, Disclosures, Certificates, Ledger, and Investors to validate records before any legal/compliance activation. Keep legal-review warnings in place across all workflows.</p></section>';
    }
}
