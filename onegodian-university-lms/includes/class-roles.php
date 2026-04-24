<?php
if (! defined('ABSPATH')) {
    exit;
}
class OG_LMS_Roles
{
    public static function register(): void
    {
        add_role('og_student', 'OG Student', ['read' => true]);

        add_role('og_instructor', 'OG Instructor', [
            'read' => true,
            'upload_files' => true,
            'edit_posts' => true,
            'manage_og_courses' => true,
            'grade_og_assignments' => true,
            'manage_og_enrollments' => true,
            'view_og_reports' => true,
            'issue_og_certificates' => true,
        ]);
    }
}
