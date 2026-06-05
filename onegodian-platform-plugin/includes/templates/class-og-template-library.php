<?php
/**
 * Reusable OneGodian premium page section library.
 *
 * @package OneGodian_Platform
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class OG_Template_Library {
	public static function page( $title, $subtitle, $shortcode = '', $variant = 'standard' ) {
		return self::hero( $title, $subtitle, $variant ) . self::feature_grid() . self::opportunity_panel() . ( $shortcode ? '<div class="og-generated-shortcode">' . $shortcode . '</div>' : '' ) . self::cta_section() . self::compliance_footer();
	}

	public static function hero( $title, $subtitle, $variant = 'standard' ) {
		return '<section class="og-hero og-hero--' . esc_attr( $variant ) . '"><div class="og-container"><p class="og-kicker">OneGodian Platform</p><h1>' . esc_html( $title ) . '</h1><p class="og-lede">' . esc_html( $subtitle ) . '</p><div class="og-actions"><a class="og-btn og-btn--gold" href="#support">Support the Mission</a><a class="og-btn og-btn--outline" href="#learn">Learn More</a></div></div></section>';
	}

	public static function heading_section( $eyebrow, $heading, $copy ) {
		return '<section class="og-section og-heading-section"><div class="og-container og-centered"><p class="og-kicker">' . esc_html( $eyebrow ) . '</p><h2>' . esc_html( $heading ) . '</h2><p>' . esc_html( $copy ) . '</p></div></section>';
	}

	public static function feature_grid() {
		$cards = array(
			array( 'Infrastructure', 'Premium pages, overlays, and runtime standards for OneGodian experiences.' ),
			array( 'Compatibility', 'Shortcodes, WooCommerce checks, resources, and contributor flows remain available.' ),
			array( 'Runtime', 'Manifest, health, tools, stats, and connector status are exposed through REST.' ),
		);
		$html = '<section class="og-section"><div class="og-container"><div class="og-card-grid og-card-grid--three">';
		foreach ( $cards as $card ) {
			$html .= '<article class="og-card"><h3>' . esc_html( $card[0] ) . '</h3><p>' . esc_html( $card[1] ) . '</p></article>';
		}
		return $html . '</div></div></section>';
	}

	public static function video_section( $title = 'Founder Video', $copy = 'Embed founder, course, presentation, or runtime media here.' ) {
		return '<section class="og-section og-video-section"><div class="og-container"><div class="og-video-frame"><span>▶</span></div><div><h2>' . esc_html( $title ) . '</h2><p>' . esc_html( $copy ) . '</p></div></div></section>';
	}

	public static function opportunity_panel() {
		return '<section class="og-section"><div class="og-container"><div class="og-opportunity-panel"><p class="og-kicker">Opportunity</p><h2>Build with a unified OneGodian standard.</h2><p>Generated pages use the same hero, cards, calls to action, and compliance language instead of plain WordPress content.</p></div></div></section>';
	}

	public static function support_grid() {
		return '<section class="og-section" id="support"><div class="og-container"><div class="og-card-grid og-card-grid--four"><article class="og-card"><h3>Contribute</h3></article><article class="og-card"><h3>Become a Member</h3></article><article class="og-card"><h3>Share Resources</h3></article><article class="og-card"><h3>Connect Systems</h3></article></div></div></section>';
	}

	public static function cta_section( $title = 'Establish A Home For OneGodian™', $copy = 'Join, support, and connect through a premium OneGodian runtime experience.' ) {
		return '<section class="og-section og-cta"><div class="og-container og-centered"><h2>' . esc_html( $title ) . '</h2><p>' . esc_html( $copy ) . '</p><div class="og-actions og-actions--center"><a class="og-btn og-btn--gold" href="#contact">Get Connected</a><a class="og-btn og-btn--outline" href="#docs">View Documentation</a></div></div></section>';
	}

	public static function compliance_footer() {
		return '<footer class="og-compliance"><div class="og-container"><p><strong>Compliance Notice:</strong> OneGodian materials are informational and do not constitute legal, financial, tax, medical, or investment advice. Contributions, memberships, and connector integrations remain subject to applicable platform terms and local requirements.</p></div></footer>';
	}
}
