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
    private static function panel($title,$url){$img=$url?'<img class="ogc-visual-image" src="'.esc_url($url).'" alt="'.esc_attr($title.' visual preview only.').'" />':'';return '<section class="ogc-visual-widget ogc-workflow-panel"><h3>'.esc_html($title).'</h3>'.$img.'</section>';}
    public static function render_certificate_workflow_widget(){return self::panel('Certificate Workflow', get_option('certificate_workflow_image_url'));}
    public static function render_disclosure_workflow_widget(){return self::panel('Disclosure Workflow', get_option('disclosure_workflow_image_url'));}
    public static function render_operating_boundary_widget(){return self::panel('Operating Boundary', get_option('operating_boundary_image_url'));}
    public static function render_dashboard_preview_widget(){return self::panel('Dashboard Preview', get_option('dashboard_preview_image_url'));}
    public static function render_offerings_preview_widget(){return self::panel('Offerings Preview', get_option('offerings_preview_image_url'));}
    public static function render_certificate_gallery_widget(){
        $items=['Founder Note'=>get_option('founder_note_certificate_image_url'),'Infrastructure Bond'=>get_option('infrastructure_bond_certificate_image_url'),'Platform Growth Note'=>get_option('platform_growth_note_certificate_image_url')];
        $html='<section class="ogc-visual-widget ogc-certificate-gallery"><h3>Certificate Gallery</h3><div class="ogc-visual-grid">';
        foreach($items as $k=>$v){$html.='<article>'.self::panel($k,$v).'</article>';}
        return $html.'</div></section>';
    }
    public static function register_dashboard_widgets(){
        $widgets=['Certificate Workflow'=>'render_certificate_workflow_widget','Disclosure Workflow'=>'render_disclosure_workflow_widget','Production Readiness'=>'render_offerings_preview_widget','Operating Boundary'=>'render_operating_boundary_widget','Dashboard Preview'=>'render_dashboard_preview_widget','Certificate Gallery'=>'render_certificate_gallery_widget'];
        foreach($widgets as $label=>$method){wp_add_dashboard_widget('ogc_'.sanitize_key($label),$label,[__CLASS__,$method]);}
    }
}
