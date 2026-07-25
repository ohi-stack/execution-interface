<?php
use PHPUnit\Framework\TestCase;
final class CapabilitiesTest extends TestCase {
	public function test_every_role_has_a_documented_nonempty_set() {
		$matrix = OCH_Capabilities::matrix();
		$this->assertCount( 13, $matrix );
		foreach ( $matrix as $capabilities ) {
			$this->assertNotEmpty( $capabilities );
			$this->assertEmpty( array_diff( $capabilities, OCH_Capabilities::ALL ) );
		}
	}
	public function test_only_platform_administrator_has_every_capability() {
		$this->assertSame( OCH_Capabilities::ALL, OCH_Capabilities::matrix()['och_administrator'] );
		$this->assertNotContains( 'och_manage_platform_settings', OCH_Capabilities::matrix()['och_manager'] );
	}
}
