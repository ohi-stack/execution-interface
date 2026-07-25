<?php
defined( 'ABSPATH' ) || exit;

final class OCH_Migrations {
	const OPTION = 'och_schema_version';
	public static function registry() { return array( 1 => array( __CLASS__, 'migration_1' ) ); }
	public static function run() {
		$current = (int) get_option( self::OPTION, 0 );
		foreach ( self::registry() as $version => $migration ) {
			if ( $version <= $current ) { continue; }
			try {
				call_user_func( $migration );
				update_option( self::OPTION, $version, false );
				$current = $version;
			} catch ( Throwable $error ) {
				update_option( 'och_last_migration_error', array( 'version' => $version, 'message' => sanitize_text_field( $error->getMessage() ), 'time' => time() ), false );
				error_log( sprintf( 'OCH migration %d failed: %s', $version, sanitize_text_field( $error->getMessage() ) ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
				break;
			}
		}
		return $current;
	}

	public static function migration_1() {
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		$c = $wpdb->get_charset_collate(); $p = $wpdb->prefix . 'och_';
		$common = 'id bigint unsigned NOT NULL AUTO_INCREMENT, created_at datetime NOT NULL, updated_at datetime NOT NULL, PRIMARY KEY (id)';
		$sql = array(
			"CREATE TABLE {$p}clients (id bigint unsigned NOT NULL AUTO_INCREMENT,user_id bigint unsigned NOT NULL,manager_user_id bigint unsigned NULL,coordinator_user_id bigint unsigned NULL,status varchar(24) NOT NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id),KEY user_id(user_id)) $c;",
			"CREATE TABLE {$p}family_authorizations (id bigint unsigned NOT NULL AUTO_INCREMENT,client_id bigint unsigned NOT NULL,user_id bigint unsigned NOT NULL,expires_at datetime NULL,revoked_at datetime NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id),UNIQUE KEY client_user(client_id,user_id)) $c;",
			"CREATE TABLE {$p}provider_profiles (id bigint unsigned NOT NULL AUTO_INCREMENT,user_id bigint unsigned NOT NULL,status varchar(24) NOT NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id),UNIQUE KEY user_id(user_id)) $c;",
			"CREATE TABLE {$p}availability (id bigint unsigned NOT NULL AUTO_INCREMENT,provider_id bigint unsigned NOT NULL,starts_at datetime NOT NULL,ends_at datetime NOT NULL,status varchar(24) NOT NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id),KEY provider_id(provider_id)) $c;",
			"CREATE TABLE {$p}bookings (id bigint unsigned NOT NULL AUTO_INCREMENT,client_id bigint unsigned NOT NULL,provider_id bigint unsigned NULL,owner_user_id bigint unsigned NOT NULL,status varchar(24) NOT NULL,starts_at datetime NOT NULL,ends_at datetime NOT NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id),KEY client_id(client_id),KEY provider_id(provider_id)) $c;",
			"CREATE TABLE {$p}care_plans (id bigint unsigned NOT NULL AUTO_INCREMENT,client_id bigint unsigned NOT NULL,owner_user_id bigint unsigned NOT NULL,status varchar(24) NOT NULL,current_revision_id bigint unsigned NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id),KEY client_id(client_id)) $c;",
			"CREATE TABLE {$p}care_plan_revisions (id bigint unsigned NOT NULL AUTO_INCREMENT,care_plan_id bigint unsigned NOT NULL,revision_no int unsigned NOT NULL,content longtext NOT NULL,approved_by bigint unsigned NULL,approved_at datetime NULL,created_at datetime NOT NULL,PRIMARY KEY(id),UNIQUE KEY plan_revision(care_plan_id,revision_no)) $c;",
			"CREATE TABLE {$p}visits (id bigint unsigned NOT NULL AUTO_INCREMENT,client_id bigint unsigned NOT NULL,booking_id bigint unsigned NOT NULL,provider_id bigint unsigned NOT NULL,owner_user_id bigint unsigned NOT NULL,status varchar(24) NOT NULL,notes longtext NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id),KEY client_id(client_id)) $c;",
			"CREATE TABLE {$p}time_entries (id bigint unsigned NOT NULL AUTO_INCREMENT,visit_id bigint unsigned NOT NULL,user_id bigint unsigned NOT NULL,clock_in datetime NULL,clock_out datetime NULL,status varchar(24) NOT NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id),KEY visit_id(visit_id)) $c;",
			"CREATE TABLE {$p}mileage_expenses (id bigint unsigned NOT NULL AUTO_INCREMENT,visit_id bigint unsigned NULL,user_id bigint unsigned NOT NULL,miles decimal(10,2) NULL,amount decimal(12,2) NULL,status varchar(24) NOT NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id)) $c;",
			"CREATE TABLE {$p}incidents (id bigint unsigned NOT NULL AUTO_INCREMENT,client_id bigint unsigned NOT NULL,owner_user_id bigint unsigned NOT NULL,status varchar(24) NOT NULL,details longtext NOT NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id),KEY client_id(client_id)) $c;",
			"CREATE TABLE {$p}documents (id bigint unsigned NOT NULL AUTO_INCREMENT,client_id bigint unsigned NULL,owner_user_id bigint unsigned NOT NULL,storage_key varchar(255) NOT NULL,mime_type varchar(100) NOT NULL,status varchar(24) NOT NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id),KEY client_id(client_id)) $c;",
			"CREATE TABLE {$p}messages (id bigint unsigned NOT NULL AUTO_INCREMENT,client_id bigint unsigned NULL,owner_user_id bigint unsigned NOT NULL,recipient_user_id bigint unsigned NOT NULL,body longtext NOT NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id)) $c;",
			"CREATE TABLE {$p}notifications (id bigint unsigned NOT NULL AUTO_INCREMENT,user_id bigint unsigned NOT NULL,event_type varchar(64) NOT NULL,payload longtext NULL,read_at datetime NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id)) $c;",
			"CREATE TABLE {$p}payments (id bigint unsigned NOT NULL AUTO_INCREMENT,client_id bigint unsigned NOT NULL,owner_user_id bigint unsigned NOT NULL,external_reference varchar(191) NULL,amount decimal(12,2) NOT NULL,status varchar(24) NOT NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id),KEY client_id(client_id)) $c;",
			"CREATE TABLE {$p}training_assignments (id bigint unsigned NOT NULL AUTO_INCREMENT,client_id bigint unsigned NULL,owner_user_id bigint unsigned NOT NULL,user_id bigint unsigned NOT NULL,course_key varchar(191) NOT NULL,status varchar(24) NOT NULL,created_at datetime NOT NULL,updated_at datetime NOT NULL,PRIMARY KEY(id)) $c;",
			"CREATE TABLE {$p}audit_events (id bigint unsigned NOT NULL AUTO_INCREMENT,actor_user_id bigint unsigned NULL,event_type varchar(64) NOT NULL,object_type varchar(64) NULL,object_id bigint unsigned NULL,ip_hash char(64) NULL,metadata longtext NULL,created_at datetime NOT NULL,PRIMARY KEY(id),KEY object_lookup(object_type,object_id),KEY event_type(event_type)) $c;",
		);
		foreach ( $sql as $statement ) { dbDelta( $statement ); }
	}
}
