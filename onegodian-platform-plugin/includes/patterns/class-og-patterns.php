<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class OG_Patterns {
	private $categories = array( 'onegodian', 'omos', 'ohi', 'capital', 'onegodian-time' );

	public function __construct() {
		add_action( 'init', array( $this, 'register' ) );
	}

	public function register() {
		if ( ! function_exists( 'register_block_pattern_category' ) || ! function_exists( 'register_block_pattern' ) ) {
			return;
		}
		foreach ( $this->categories as $category ) {
			register_block_pattern_category( $category, array( 'label' => ucwords( str_replace( '-', ' ', $category ) ) ) );
		}
		$patterns = array(
			'premium-hero'       => array( 'Hero Patterns', 'Premium Hero', OG_Template_Library::hero( 'Establish A Home For OneGodian™', 'A premium OneGodian page hero with gold accents, purple glow, and dual CTA buttons.', 'premium' ) ),
			'contributor-hero'   => array( 'Hero Patterns', 'Contributor Hero', OG_Template_Library::hero( 'Contribute to OneGodian', 'Join the contributor ecosystem with a unified mission standard.', 'contributor' ) ),
			'capital-hero'       => array( 'Hero Patterns', 'Capital Hero', OG_Template_Library::hero( 'OneGodian Capital', 'Funding, platforms, operations, and compliance in one premium interface.', 'capital' ) ),
			'omos-hero'          => array( 'Hero Patterns', 'OMOS Hero', OG_Template_Library::hero( 'OMOS Runtime', 'Core systems and infrastructure for the OneGodian operating standard.', 'omos' ) ),
			'belief-mapper-hero' => array( 'Hero Patterns', 'Belief Mapper Hero', OG_Template_Library::hero( 'Belief Mapper', 'Guide reflection through a premium OneGodian experience.', 'belief-mapper' ) ),
			'contributor-cta'    => array( 'CTA Patterns', 'Contributor CTA', OG_Template_Library::cta_section( 'Become a Contributor', 'Bring skills, resources, and aligned action to the ecosystem.' ) ),
			'support-cta'        => array( 'CTA Patterns', 'Support CTA', OG_Template_Library::cta_section( 'Support OneGodian', 'Help sustain premium infrastructure and mission delivery.' ) ),
			'membership-cta'     => array( 'CTA Patterns', 'Membership CTA', OG_Template_Library::cta_section( 'Become a Member', 'Access member resources, certificates, and platform benefits.' ) ),
			'contact-cta'        => array( 'CTA Patterns', 'Contact CTA', OG_Template_Library::cta_section( 'Contact OneGodian', 'Connect with the team through the official app bridge.' ) ),
			'three-card-grid'    => array( 'Card Patterns', 'Three Card Grid', OG_Template_Library::feature_grid() ),
			'four-card-grid'     => array( 'Card Patterns', 'Four Card Grid', OG_Template_Library::support_grid() ),
			'feature-cards'      => array( 'Card Patterns', 'Feature Cards', OG_Template_Library::feature_grid() ),
			'glass-cards'        => array( 'Card Patterns', 'Glass Cards', OG_Template_Library::support_grid() ),
			'video-hero'         => array( 'Media Patterns', 'Video Hero', OG_Template_Library::video_section( 'Video Hero', 'Premium media section for hero video content.' ) ),
			'founder-video'      => array( 'Media Patterns', 'Founder Video', OG_Template_Library::video_section( 'Founder Video', 'Introduce the mission through founder media.' ) ),
			'course-video'       => array( 'Media Patterns', 'Course Video', OG_Template_Library::video_section( 'Course Video', 'Present lessons and university resources.' ) ),
			'presentation-video' => array( 'Media Patterns', 'Presentation Video', OG_Template_Library::video_section( 'Presentation Video', 'Host premium presentation content.' ) ),
			'disclosure-notice'  => array( 'Compliance Patterns', 'Disclosure Notice', OG_Template_Library::compliance_footer() ),
			'contribution-notice'=> array( 'Compliance Patterns', 'Contribution Notice', OG_Template_Library::compliance_footer() ),
			'compliance-notice'  => array( 'Compliance Patterns', 'Compliance Notice', OG_Template_Library::compliance_footer() ),
			'legal-disclaimer'   => array( 'Compliance Patterns', 'Legal Disclaimer', OG_Template_Library::compliance_footer() ),
		);
		foreach ( $patterns as $slug => $pattern ) {
			register_block_pattern( 'onegodian/' . $slug, array( 'title' => $pattern[1], 'description' => $pattern[0], 'categories' => array( 'onegodian' ), 'content' => $pattern[2] ) );
		}
	}
}
