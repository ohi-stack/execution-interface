<?php
use PHPUnit\Framework\TestCase;
class AuthorizationRepository extends OCH_Repository {
	public $context = array( 'client_id' => 9, 'owner_user_id' => 2 );
	public $family = false; public $provider = false; public $scope = false;
	public function __construct() {}
	public function authorization_context( $type, $id ) { return $this->context; }
	public function family_is_authorized( $user_id, $client_id ) { return $this->family; }
	public function provider_is_assigned( $user_id, $client_id ) { return $this->provider; }
	public function staff_has_scope( $user_id, $client_id ) { return $this->scope; }
}
final class AuthorizationTest extends TestCase {
	protected function setUp(): void { $GLOBALS['och_test_caps'] = array( 1 => array( 'och_view_client_profile' => true ) ); }
	public function test_capability_is_always_required() { $repo = new AuthorizationRepository(); $this->assertFalse( ( new OCH_Authorization( $repo ) )->can( 1, 'och_manage_payments', 'clients', 9 ) ); }
	public function test_unrelated_record_is_denied() { $repo = new AuthorizationRepository(); $this->assertFalse( ( new OCH_Authorization( $repo ) )->can( 1, 'och_view_client_profile', 'clients', 9 ) ); }
	public function test_owner_family_provider_and_staff_relationships_allow_access() {
		foreach ( array( 'family', 'provider', 'scope' ) as $relationship ) { $repo = new AuthorizationRepository(); $repo->{$relationship} = true; $this->assertTrue( ( new OCH_Authorization( $repo ) )->can( 1, 'och_view_client_profile', 'clients', 9 ) ); }
		$repo = new AuthorizationRepository(); $repo->context['owner_user_id'] = 1; $this->assertTrue( ( new OCH_Authorization( $repo ) )->can( 1, 'och_view_client_profile', 'clients', 9 ) );
	}
	public function test_administrator_override_still_requires_requested_capability() { $GLOBALS['och_test_caps'][1]['och_manage_platform_settings'] = true; $repo = new AuthorizationRepository(); $this->assertTrue( ( new OCH_Authorization( $repo ) )->can( 1, 'och_view_client_profile', 'clients', 9 ) ); }
}
