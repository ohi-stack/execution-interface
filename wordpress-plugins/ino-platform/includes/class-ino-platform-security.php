<?php
if (!defined('ABSPATH')) {
    exit;
}

final class INO_Platform_Security {
    public static function ancestry_guard($user_id) {
        return (bool) get_user_meta($user_id, 'ino_ancestry_review_complete', true);
    }

    public static function sanitize_payload($payload) {
        return map_deep($payload, 'sanitize_text_field');
    }
}
