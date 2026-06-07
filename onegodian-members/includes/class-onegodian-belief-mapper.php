<?php
/**
 * Belief Mapper module for Onegodian Members.
 *
 * @package Onegodian_Members
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Onegodian_Belief_Mapper_Module
{
    public function register(): void
    {
        add_shortcode('onegodian_belief_mapper', array($this, 'render_mapper'));
        add_shortcode('onegodian_belief_mapper_lite', array($this, 'render_lite'));
        add_shortcode('onegodian_belief_mapper_results', array($this, 'render_results'));
        add_shortcode('onegodian_belief_mapper_certificate', array($this, 'render_certificate'));
        add_shortcode('onegodian_belief_mapper_resources', array($this, 'render_resources'));
        add_shortcode('onegodian_belief_mapper_dashboard', array($this, 'render_dashboard'));
    }

    /** @return array<string, string> */
    public static function pages(): array
    {
        return array(
            'Belief Mapper' => '[onegodian_belief_mapper]',
            'Belief Mapper Lite' => '[onegodian_belief_mapper_lite]',
            'Belief Mapper Results' => '[onegodian_belief_mapper_results]',
            'Belief Mapper Certificate' => '[onegodian_belief_mapper_certificate]',
            'Belief Mapper Resources' => '[onegodian_belief_mapper_resources]',
            'Belief Mapper Dashboard' => '[onegodian_belief_mapper_dashboard]',
        );
    }

    /** @param array<string, string>|string $atts */
    public function render_mapper($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Belief Mapper', 'onegodian-members'),
            'description' => __('Map core beliefs, values, and next-step learning paths with the OneGodian alignment framework.', 'onegodian-members'),
        ), $atts, 'onegodian_belief_mapper');

        $steps = array(
            __('Reflect on your current beliefs.', 'onegodian-members'),
            __('Identify shared values and growth areas.', 'onegodian-members'),
            __('Review resources before making important decisions.', 'onegodian-members'),
        );

        return $this->panel('ogm-belief-mapper', $atts['title'], $atts['description'], $this->ordered_list($steps) . $this->disclaimer());
    }

    /** @param array<string, string>|string $atts */
    public function render_lite($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Belief Mapper Lite', 'onegodian-members'),
            'description' => __('A quick orientation version for visitors who want a lightweight introduction.', 'onegodian-members'),
        ), $atts, 'onegodian_belief_mapper_lite');

        return $this->panel('ogm-belief-mapper-lite', $atts['title'], $atts['description'], '<div class="ogm-belief-prompts"><span>Faith</span><span>Family</span><span>Service</span><span>Learning</span></div>' . $this->disclaimer());
    }

    /** @param array<string, string>|string $atts */
    public function render_results($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Belief Mapper Results', 'onegodian-members'),
            'description' => __('Review saved mapper outcomes, learning recommendations, and certificate readiness notes.', 'onegodian-members'),
        ), $atts, 'onegodian_belief_mapper_results');

        return $this->panel('ogm-belief-mapper-results', $atts['title'], $atts['description'], $this->definition_list(array(
            __('Alignment summary', 'onegodian-members') => __('Pending user completion', 'onegodian-members'),
            __('Recommended path', 'onegodian-members') => __('Review resources and speak with a qualified advisor when needed.', 'onegodian-members'),
            __('Certificate readiness', 'onegodian-members') => __('Not yet issued', 'onegodian-members'),
        )) . $this->disclaimer());
    }

    /** @param array<string, string>|string $atts */
    public function render_certificate($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Belief Mapper Certificate', 'onegodian-members'),
            'description' => __('Certificate status and completion details for the Belief Mapper module.', 'onegodian-members'),
        ), $atts, 'onegodian_belief_mapper_certificate');

        return $this->panel('ogm-belief-mapper-certificate', $atts['title'], $atts['description'], $this->definition_list(array(
            __('Status', 'onegodian-members') => __('Pending review', 'onegodian-members'),
            __('Certificate ID', 'onegodian-members') => __('Generated after completion', 'onegodian-members'),
        )) . $this->disclaimer());
    }

    /** @param array<string, string>|string $atts */
    public function render_resources($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Belief Mapper Resources', 'onegodian-members'),
            'description' => __('Helpful resources for reflection, learning, and responsible follow-up.', 'onegodian-members'),
        ), $atts, 'onegodian_belief_mapper_resources');

        return $this->panel('ogm-belief-mapper-resources', $atts['title'], $atts['description'], $this->cards(array(
            array(__('Reflection guide', 'onegodian-members'), __('Use prompts to record beliefs and open questions.', 'onegodian-members')),
            array(__('Learning path', 'onegodian-members'), __('Review recommended OneGodian lessons and community resources.', 'onegodian-members')),
            array(__('Support', 'onegodian-members'), __('Contact the OneGodian team for platform help.', 'onegodian-members')),
        )) . $this->disclaimer());
    }

    /** @param array<string, string>|string $atts */
    public function render_dashboard($atts = array()): string
    {
        $atts = is_array($atts) ? $atts : array();
        $atts = shortcode_atts(array(
            'title' => __('Belief Mapper Dashboard', 'onegodian-members'),
            'description' => __('Track Belief Mapper progress, results, resources, and certificate readiness.', 'onegodian-members'),
        ), $atts, 'onegodian_belief_mapper_dashboard');

        return $this->panel('ogm-belief-mapper-dashboard', $atts['title'], $atts['description'], $this->cards(array(
            array(__('Mapper', 'onegodian-members'), __('Complete the full guided mapper.', 'onegodian-members')),
            array(__('Results', 'onegodian-members'), __('Review saved alignment notes.', 'onegodian-members')),
            array(__('Certificate', 'onegodian-members'), __('Check completion and certificate status.', 'onegodian-members')),
        )) . $this->disclaimer());
    }

    private function panel(string $class_name, string $title, string $description, string $content): string
    {
        $this->enqueue_assets();
        return sprintf(
            '<section class="ogm-shortcode ogm-belief-panel %s"><p class="ogm-kicker">%s</p><h2>%s</h2><p class="ogm-belief-description">%s</p>%s</section>',
            esc_attr($class_name),
            esc_html__('OneGodian Belief Mapper', 'onegodian-members'),
            esc_html($title),
            wp_kses_post($description),
            $content
        );
    }

    /** @param array<int, string> $items */
    private function ordered_list(array $items): string
    {
        $html = '<ol class="ogm-belief-steps">';
        foreach ($items as $item) {
            $html .= '<li>' . esc_html($item) . '</li>';
        }
        return $html . '</ol>';
    }

    /** @param array<string, string> $items */
    private function definition_list(array $items): string
    {
        $html = '<dl class="ogm-definition-list">';
        foreach ($items as $term => $description) {
            $html .= '<div><dt>' . esc_html($term) . '</dt><dd>' . esc_html($description) . '</dd></div>';
        }
        return $html . '</dl>';
    }

    /** @param array<int, array{0:string, 1:string}> $cards */
    private function cards(array $cards): string
    {
        $html = '<div class="ogm-belief-card-grid">';
        foreach ($cards as $card) {
            $html .= '<article><h3>' . esc_html($card[0]) . '</h3><p>' . esc_html($card[1]) . '</p></article>';
        }
        return $html . '</div>';
    }

    private function disclaimer(): string
    {
        return '<p class="ogm-belief-disclaimer"><strong>' . esc_html__('Disclaimer:', 'onegodian-members') . '</strong> ' . esc_html__('Belief Mapper content is educational and reflective only. It is not legal, medical, mental-health, financial, or spiritual counseling advice and does not replace qualified professional guidance.', 'onegodian-members') . '</p>';
    }

    private function enqueue_assets(): void
    {
        if (!defined('OGM_PLUGIN_URL') || !defined('OGM_VERSION')) {
            return;
        }

        wp_enqueue_style('ogm-public', OGM_PLUGIN_URL . 'assets/css/ogm-public.css', array(), OGM_VERSION);
    }
}
