<?php

if (! defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

global $wpdb;

$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}algq_mao_calculations");
delete_option('algq_mao_engine_version');
