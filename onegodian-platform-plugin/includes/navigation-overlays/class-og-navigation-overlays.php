<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class OG_Navigation_Overlays {
	public function __construct() {
		add_shortcode( 'onegodian_ecosystem_overlay', array( $this, 'ecosystem_overlay' ) );
		add_shortcode( 'onegodian_omos_overlay', array( $this, 'omos_overlay' ) );
		add_shortcode( 'onegodian_capital_overlay', array( $this, 'capital_overlay' ) );
		add_shortcode( 'onegodian_mobile_overlay', array( $this, 'mobile_overlay' ) );
	}

	public function ecosystem_overlay() {
		return $this->overlay( 'Ecosystem Overlay', array( 'Explore' => array( 'Home', 'Mission', 'Timeline' ), 'Learn' => array( 'University', 'Belief Mapper', 'Resources' ), 'Platforms' => array( 'OMOS', 'OHI', 'Capital' ), 'Contribute' => array( 'Membership', 'Support', 'Contact' ) ), 'ecosystem' );
	}

	public function omos_overlay() {
		return $this->overlay( 'OMOS Overlay', array( 'Core' => array( 'Runtime', 'Manifest', 'Health' ), 'Systems' => array( 'Tools', 'Stats', 'Patterns' ), 'Infrastructure' => array( 'Connectors', 'App Bridge', 'Navigation' ), 'Developers' => array( 'REST API', 'Docs', 'Status' ) ), 'omos' );
	}

	public function capital_overlay() {
		return $this->overlay( 'Capital Overlay', array( 'Funding' => array( 'Contribute', 'Sponsorship', 'Support' ), 'Platforms' => array( 'Marketplace', 'Membership', 'Products' ), 'Operations' => array( 'Dashboard', 'Runtime', 'Reports' ), 'Compliance' => array( 'Disclosure', 'Terms', 'Notices' ) ), 'capital' );
	}

	public function mobile_overlay() {
		return $this->overlay( 'Mobile Overlay', array( 'Explore' => array( 'Home', 'Mission', 'OMOS' ), 'Learn' => array( 'Resources', 'Belief Mapper', 'Docs' ), 'Act' => array( 'Join', 'Support', 'Contact' ) ), 'mobile' );
	}

	private function overlay( $title, array $columns, $modifier ) {
		$html = '<nav class="og-nav-overlay og-nav-overlay--' . esc_attr( $modifier ) . '" aria-label="' . esc_attr( $title ) . '"><div class="og-container"><p class="og-kicker">OneGodian Navigation</p><h2>' . esc_html( $title ) . '</h2><div class="og-overlay-grid">';
		foreach ( $columns as $column => $items ) {
			$html .= '<section class="og-overlay-column"><h3>' . esc_html( $column ) . '</h3><ul>';
			foreach ( $items as $item ) {
				$html .= '<li><a href="#' . esc_attr( sanitize_title( $item ) ) . '">' . esc_html( $item ) . '</a></li>';
			}
			$html .= '</ul></section>';
		}
		return $html . '</div></div></nav>';
	}
}
