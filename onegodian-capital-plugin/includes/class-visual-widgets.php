<?php
if (!defined('ABSPATH')) { exit; }

class Onegodian_Capital_Visual_Widgets {
    public static function register() {
        add_shortcode('onegodian_capital_certificate_workflow', [__CLASS__, 'render_certificate_workflow_widget']);
        add_shortcode('onegodian_capital_disclosure_workflow', [__CLASS__, 'render_disclosure_workflow_widget']);
        add_shortcode('onegodian_capital_operating_boundary', [__CLASS__, 'render_operating_boundary_widget']);
        add_shortcode('onegodian_capital_dashboard_preview', [__CLASS__, 'render_dashboard_preview_widget']);
        add_shortcode('onegodian_capital_offerings_preview', [__CLASS__, 'render_offerings_preview_widget']);
        add_shortcode('onegodian_capital_certificate_gallery', [__CLASS__, 'render_certificate_gallery_widget']);
        add_action('wp_dashboard_setup', [__CLASS__, 'register_dashboard_widgets']);
    }

    private static function option(string $key): string {
        if (class_exists('Onegodian_Capital_Settings')) {
            return Onegodian_Capital_Settings::get($key);
        }
        return (string) get_option($key, '');
    }

    private static function panel(string $title, string $url, string $description = ''): string {
        $description = $description ?: 'Optional visual preview. Configure an image URL in Capital Portal settings.';
        $html = '<section class="ogc-visual-widget ogc-workflow-panel">';
        $html .= '<h3>' . esc_html($title) . '</h3>';
        if ($url) {
            $html .= '<img class="ogc-visual-image" src="' . esc_url($url) . '" alt="' . esc_attr($title . ' visual preview only.') . '" />';
        } else {
            $html .= '<div class="ogc-visual-placeholder"><strong>' . esc_html($title) . '</strong><span>' . esc_html($description) . '</span></div>';
        }
        $html .= '<p class="ogc-visual-note">Visuals are presentation aids only. Legal, disclosure, eligibility, payment, ledger, and certificate controls remain authoritative.</p>';
        $html .= '</section>';
        return $html;
    }

    public static function render_certificate_workflow_widget(){
        return self::panel('Certificate Workflow', self::option('certificate_workflow_image_url'), 'Certificate issuance, internal review, ledger recording, and verification workflow.');
    }

    public static function render_disclosure_workflow_widget(){
        return self::panel('Disclosure Workflow', self::option('disclosure_workflow_image_url'), 'Disclosure draft, review, approval, publication, acknowledgement, and audit workflow.');
    }

    public static function render_operating_boundary_widget(){
        return self::panel('Operating Boundary', self::option('operating_boundary_image_url'), 'WordPress, WooCommerce, Capital Portal, disclosure gate, and certificate verification layer boundary.');
    }

    public static function render_dashboard_preview_widget(){
        return self::panel('Dashboard Preview', self::option('dashboard_preview_image_url'), 'Investor dashboard and operator dashboard visual preview.');
    }

    public static function render_offerings_preview_widget(){
        return self::panel('Offerings Preview', self::option('offerings_preview_image_url'), 'Offering cards, status labels, eligibility notices, and disclosure packet previews.');
    }

    public static function render_certificate_gallery_widget(){
        $items = [
            'Founder Note Certificate' => self::option('founder_note_certificate_image_url'),
            'Infrastructure Bond Certificate' => self::option('infrastructure_bond_certificate_image_url'),
            'Platform Growth Note Certificate' => self::option('platform_growth_note_certificate_image_url'),
        ];
        $html = '<section class="ogc-visual-widget ogc-certificate-gallery"><h3>Certificate Gallery</h3><div class="ogc-visual-grid">';
        foreach ($items as $label => $url) {
            $html .= '<article>' . self::panel($label, $url, 'Optional certificate preview URL can be configured in settings.') . '</article>';
        }
        return $html . '</div></section>';
    }

    public static function register_dashboard_widgets(){
        $widgets = [
            'Certificate Workflow' => 'render_certificate_workflow_widget',
            'Disclosure Workflow' => 'render_disclosure_workflow_widget',
            'Production Readiness' => 'render_offerings_preview_widget',
            'Operating Boundary' => 'render_operating_boundary_widget',
            'Dashboard Preview' => 'render_dashboard_preview_widget',
            'Certificate Gallery' => 'render_certificate_gallery_widget',
        ];
        foreach ($widgets as $label => $method) {
            wp_add_dashboard_widget('ogc_' . sanitize_key($label), $label, [__CLASS__, $method]);
        }
    }
}
