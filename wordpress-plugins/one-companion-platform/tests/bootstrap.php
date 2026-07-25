<?php
define( 'ABSPATH', dirname( __DIR__ ) . '/' );
define( 'ARRAY_A', 'ARRAY_A' );
$GLOBALS['och_test_caps'] = array();
function user_can( $user_id, $capability ) { return ! empty( $GLOBALS['och_test_caps'][ $user_id ][ $capability ] ); }
function get_current_user_id() { return 1; }
function __( $text ) { return $text; }
function absint( $value ) { return abs( (int) $value ); }
class WP_Error { public $code; public function __construct( $code ) { $this->code = $code; } }
require_once dirname( __DIR__ ) . '/includes/class-och-capabilities.php';
require_once dirname( __DIR__ ) . '/includes/class-och-repository.php';
require_once dirname( __DIR__ ) . '/includes/class-och-authorization.php';
require_once dirname( __DIR__ ) . '/includes/class-och-migrations.php';
