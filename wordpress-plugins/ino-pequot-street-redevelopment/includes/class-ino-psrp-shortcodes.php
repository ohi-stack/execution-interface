<?php
if (!defined('ABSPATH')) {
    exit;
}

class INO_PSRP_Shortcodes {
    private $data;
    public function __construct($data) { $this->data = $data; }
    public function init() { add_shortcode('ino_pequot_project', array($this, 'project_page')); }
    public function project_page($atts) {
        wp_enqueue_style('ino-psrp');
        $pages = $this->data->pages();
        ob_start(); ?>
        <section class="ino-psrp-hero">
            <p class="ino-kicker">INO Housing & Development</p>
            <h1>Pequot Street Redevelopment & Preservation Project</h1>
            <p>Redevelopment, preservation, resident engagement, parcel diligence, and public-record coordination for a legally disciplined Pequot Street project workspace.</p>
            <div class="ino-actions"><a href="#ino-project-pages">Explore pages</a><a href="#ino-forms">Submit interest</a></div>
        </section>
        <section class="ino-psrp-grid" id="ino-project-pages">
            <?php foreach ($pages as $slug => $title) : ?>
                <article><span><?php echo esc_html(strtoupper(str_replace('-', ' ', $slug))); ?></span><h2><?php echo esc_html($title); ?></h2><p>WPBakery-ready content block with image, video, map, document, and workflow placeholders.</p></article>
            <?php endforeach; ?>
        </section>
        <section class="ino-psrp-panel" id="ino-forms"><h2>OneGodian Forms Bridge Workflows</h2><ul><li>Resident interest intake</li><li>Survey response routing</li><li>Document submission triage</li><li>Legal notice acknowledgement log</li></ul></section>
        <section class="ino-psrp-legal"><h2>Easement and title discipline</h2><p><?php echo esc_html($this->data->legal_language()); ?></p></section>
        <?php return ob_get_clean();
    }
}
