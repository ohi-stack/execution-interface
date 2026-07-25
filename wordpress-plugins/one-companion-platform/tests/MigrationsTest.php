<?php
use PHPUnit\Framework\TestCase;
final class MigrationsTest extends TestCase {
	public function test_registry_is_ordered_and_matches_schema_target() {
		$versions = array_keys( OCH_Migrations::registry() );
		$sorted = $versions; sort( $sorted );
		$this->assertSame( $sorted, $versions );
		$this->assertSame( 1, max( $versions ) );
	}
	public function test_initial_migration_is_dbdelta_based_and_non_destructive() {
		$source = file_get_contents( dirname( __DIR__ ) . '/includes/class-och-migrations.php' );
		$this->assertStringContainsString( 'dbDelta', $source );
		$this->assertDoesNotMatchRegularExpression( '/DROP\s+TABLE|TRUNCATE|DELETE\s+FROM/i', $source );
	}
}
