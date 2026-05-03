<?php

defined('ABSPATH') || exit;

class Onegodian_Capital_Admin_Controller {
    public static function register_menu(): void {
        add_menu_page(
            'ONEGODIAN Capital',
            'Capital Portal',
            'manage_onegodian_capital',
            'onegodian-capital',
            [self::class, 'dashboard'],
            'dashicons-bank',
            3
        );

        add_submenu_page('onegodian-capital', 'Dashboard', 'Dashboard', 'manage_onegodian_capital', 'onegodian-capital', [self::class, 'dashboard']);
        add_submenu_page('onegodian-capital', 'Offerings', 'Offerings', 'issue_onegodian_instruments', 'onegodian-capital-offerings', [self::class, 'offerings']);
        add_submenu_page('onegodian-capital', 'Disclosures', 'Disclosures', 'manage_onegodian_disclosures', 'onegodian-capital-disclosures', [self::class, 'disclosures']);
        add_submenu_page('onegodian-capital', 'Certificates', 'Certificates', 'issue_onegodian_instruments', 'onegodian-capital-certificates', [self::class, 'certificates']);
        add_submenu_page('onegodian-capital', 'Ledger', 'Ledger', 'view_onegodian_ledger', 'onegodian-capital-ledger', [self::class, 'ledger']);
        add_submenu_page('onegodian-capital', 'Investors', 'Investors', 'manage_onegodian_capital', 'onegodian-capital-investors', [self::class, 'investors']);
        add_submenu_page('onegodian-capital', 'Readiness Checklist', 'Readiness Checklist', 'manage_onegodian_capital', 'onegodian-capital-readiness', [self::class, 'readiness']);
        add_submenu_page('onegodian-capital', 'Settings', 'Settings', 'manage_onegodian_capital', 'onegodian-capital-settings', ['Onegodian_Capital_Settings', 'render_settings_page']);
    }

    public static function table_exists(string $table): bool {
        global $wpdb;

        return $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table)) === $table;
    }

    public static function count_table(string $table): int {
        global $wpdb;

        if (!self::table_exists($table)) {
            return 0;
        }

        return (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table}");
    }

    public static function dashboard(): void {
        global $wpdb;

        $instruments = self::count_table($wpdb->prefix . 'onegodian_capital_instruments');
        $certificates = self::count_table($wpdb->prefix . 'onegodian_capital_certificates');
        $ledger = self::count_table($wpdb->prefix . 'onegodian_capital_ledger');
        $disclosures = self::count_table($wpdb->prefix . 'onegodian_capital_disclosure_acceptances');
        $published_offerings = wp_count_posts('onegodian_offering');

        echo '<div class="wrap ogc-admin-wrap"><h1>ONEGODIAN Capital Portal — Admin</h1>';
        self::legal_notice();
        echo '<div class="og-admin-grid">';
        self::stat_card('Published Offerings', isset($published_offerings->publish) ? (int) $published_offerings->publish : 0);
        self::stat_card('Instruments', $instruments);
        self::stat_card('Certificates', $certificates);
        self::stat_card('Ledger Entries', $ledger);
        self::stat_card('Disclosure Acceptances', $disclosures);
        echo '</div><div class="og-admin-actions">';
        echo '<a href="' . esc_url(admin_url('edit.php?post_type=onegodian_offering')) . '" class="button button-primary">Manage Offerings</a> ';
        echo '<a href="' . esc_url(admin_url('admin.php?page=onegodian-capital-certificates')) . '" class="button">View Certificates</a> ';
        echo '<a href="' . esc_url(admin_url('admin.php?page=onegodian-capital-disclosures')) . '" class="button">Review Disclosures</a> ';
        echo '<a href="' . esc_url(admin_url('admin.php?page=onegodian-capital-ledger')) . '" class="button">Open Ledger</a></div>';
        echo '<div class="ogc-dashboard-grid">';
        echo Onegodian_Capital_Widgets::render_readiness_checklist();
        echo Onegodian_Capital_Widgets::render_shortcode_reference();
        echo Onegodian_Capital_Widgets::render_help_panel();
        echo '</div></div>';
    }

    private static function stat_card(string $label, int $value): void {
        echo '<div class="ogc-admin-card"><h3>' . esc_html($label) . '</h3><p class="ogc-admin-stat">' . esc_html((string) $value) . '</p></div>';
    }

    private static function legal_notice(): void {
        echo '<div class="ogc-admin-warning"><strong>Legal review required:</strong> The ONEGODIAN Capital Portal is software infrastructure for managing digital records related to private capital instruments. It does not itself create, approve, or validate any securities offering. All notes, bonds, repayment terms, investor eligibility rules, disclosures, exemptions, and offering documents must be reviewed by qualified legal counsel before public use.</div>';
    }

    public static function offerings(): void { /* trimmed for brevity in generation */
        $query = new WP_Query(['post_type' => 'onegodian_offering', 'post_status' => ['publish', 'draft', 'pending', 'private'], 'posts_per_page' => 100]);
        echo '<div class="wrap ogc-admin-wrap"><h1>Offerings</h1>'; self::legal_notice();
        echo '<p><a href="' . esc_url(admin_url('post-new.php?post_type=onegodian_offering')) . '" class="button button-primary">Add New Capital Offering</a></p>';
        echo '<table class="widefat striped ogc-admin-table"><thead><tr><th>Name</th><th>Instrument Type</th><th>Status</th><th>Disclosure Version</th><th>Minimum</th><th>Maximum</th><th>Actions</th></tr></thead><tbody>';
        if ($query->have_posts()) {
            while ($query->have_posts()) { $query->the_post(); $id = get_the_ID();
                $type = get_post_meta($id, '_onegodian_capital_instrument_type', true);
                $status = get_post_meta($id, '_onegodian_capital_status', true);
                $disclosure = get_post_meta($id, '_onegodian_capital_disclosure_packet_version', true);
                $minimum = get_post_meta($id, '_onegodian_capital_minimum_purchase', true);
                $maximum = get_post_meta($id, '_onegodian_capital_maximum_purchase', true);
                echo '<tr><td><strong>' . esc_html(get_the_title()) . '</strong></td><td>' . esc_html($type ?: '—') . '</td><td>' . esc_html($status ?: get_post_status()) . '</td><td>' . esc_html($disclosure ?: '—') . '</td><td>' . esc_html($minimum ?: '—') . '</td><td>' . esc_html($maximum ?: '—') . '</td><td><a href="' . esc_url(get_edit_post_link($id)) . '">Edit</a></td></tr>';
            }
            wp_reset_postdata();
        } else {
            echo '<tr><td colspan="7">No capital offerings found.</td></tr>';
        }
        echo '</tbody></table></div>';
    }

    public static function disclosures(): void { global $wpdb; $table = $wpdb->prefix . 'onegodian_capital_disclosure_acceptances';
        echo '<div class="wrap ogc-admin-wrap"><h1>Disclosure Review</h1><div class="ogc-admin-warning"><strong>Disclosure approval gate:</strong> All disclosures must be reviewed and approved before investor access, payment workflows, or instrument issuance.</div><div class="ogc-workflow-strip">';
        foreach (['Draft', 'Internal Review', 'Legal Review', 'Approval', 'Publish', 'Investor Acknowledgement', 'Recorded & Audited'] as $step) { echo '<div class="ogc-workflow-step">' . esc_html($step) . '</div>'; }
        echo '</div>'; if (!self::table_exists($table)) { echo '<p>Disclosure acceptance table not found.</p></div>'; return; }
        $rows = $wpdb->get_results("SELECT * FROM {$table} ORDER BY created_at DESC LIMIT 100");
        echo '<table class="widefat striped ogc-admin-table"><thead><tr><th>ID</th><th>User</th><th>Offering</th><th>Disclosure</th><th>Accepted At</th></tr></thead><tbody>';
        if ($rows) { foreach ($rows as $row) { echo '<tr><td>' . esc_html((string) ($row->id ?? '—')) . '</td><td>' . esc_html((string) ($row->user_id ?? '—')) . '</td><td>' . esc_html((string) ($row->offering_id ?? '—')) . '</td><td>' . esc_html((string) ($row->disclosure_id ?? '—')) . '</td><td>' . esc_html((string) ($row->created_at ?? '—')) . '</td></tr>'; } } else { echo '<tr><td colspan="5">No disclosure acceptances recorded.</td></tr>'; }
        echo '</tbody></table></div>';
    }

    public static function certificates(): void { global $wpdb; $table = $wpdb->prefix . 'onegodian_capital_certificates';
        echo '<div class="wrap ogc-admin-wrap"><h1>Certificates</h1><div class="ogc-admin-warning"><strong>Certificate issuance control:</strong> Certificate records must be tied to approved disclosures, ledger entries, and instrument records before investor-facing use.</div>';
        if (!self::table_exists($table)) { echo '<p>Certificate table not found.</p></div>'; return; }
        $rows = $wpdb->get_results("SELECT * FROM {$table} ORDER BY created_at DESC LIMIT 100");
        echo '<table class="widefat striped ogc-admin-table"><thead><tr><th>Certificate ID</th><th>Instrument</th><th>User</th><th>Status</th><th>Verification Hash</th><th>Date</th></tr></thead><tbody>';
        if ($rows) { foreach ($rows as $row) { echo '<tr><td>' . esc_html((string) ($row->certificate_id ?? '—')) . '</td><td>' . esc_html((string) ($row->instrument_id ?? '—')) . '</td><td>' . esc_html((string) ($row->user_id ?? '—')) . '</td><td>' . esc_html((string) ($row->status ?? '—')) . '</td><td><code>' . esc_html((string) ($row->verification_hash ?? '—')) . '</code></td><td>' . esc_html((string) ($row->created_at ?? '—')) . '</td></tr>'; } } else { echo '<tr><td colspan="6">No certificates recorded.</td></tr>'; }
        echo '</tbody></table></div>';
    }

    public static function ledger(): void { global $wpdb; $table = $wpdb->prefix . 'onegodian_capital_ledger';
        echo '<div class="wrap ogc-admin-wrap"><h1>Ledger</h1><div class="ogc-admin-warning"><strong>Audit layer:</strong> Ledger records must be preserved for review, reconciliation, export, and backup testing.</div>';
        if (!self::table_exists($table)) { echo '<p>Ledger table not found.</p></div>'; return; }
        $rows = $wpdb->get_results("SELECT * FROM {$table} ORDER BY created_at DESC LIMIT 100");
        echo '<table class="widefat striped ogc-admin-table"><thead><tr><th>Type</th><th>Amount</th><th>Status</th><th>Instrument</th><th>User</th><th>Date</th></tr></thead><tbody>';
        if ($rows) { foreach ($rows as $row) { echo '<tr><td>' . esc_html((string) ($row->type ?? '—')) . '</td><td>' . esc_html((string) ($row->amount ?? '—')) . '</td><td>' . esc_html((string) ($row->status ?? '—')) . '</td><td>' . esc_html((string) ($row->instrument_id ?? '—')) . '</td><td>' . esc_html((string) ($row->user_id ?? '—')) . '</td><td>' . esc_html((string) ($row->created_at ?? '—')) . '</td></tr>'; } } else { echo '<tr><td colspan="6">No ledger entries recorded.</td></tr>'; }
        echo '</tbody></table></div>';
    }

    public static function investors(): void {
        $users = get_users(['number' => 200, 'orderby' => 'registered', 'order' => 'DESC']);
        echo '<div class="wrap ogc-admin-wrap"><h1>Investors</h1><div class="ogc-admin-warning"><strong>Investor eligibility required:</strong> A user account alone does not establish investor eligibility or approval.</div><table class="widefat striped ogc-admin-table"><thead><tr><th>Name</th><th>Email</th><th>Registered</th><th>Roles</th></tr></thead><tbody>';
        foreach ($users as $user) {
            echo '<tr><td>' . esc_html($user->display_name) . '</td><td>' . esc_html($user->user_email) . '</td><td>' . esc_html($user->user_registered) . '</td><td>' . esc_html(implode(', ', $user->roles)) . '</td></tr>';
        }
        echo '</tbody></table></div>';
    }

    public static function readiness(): void {
        echo '<div class="wrap ogc-admin-wrap"><h1>Production Readiness Checklist</h1><div class="ogc-admin-warning"><strong>No live activation:</strong> Public offering checkout, investor onboarding, live payment processing, and certificate issuance tied to paid orders must remain inactive until readiness review is complete.</div>';
        echo Onegodian_Capital_Widgets::render_readiness_checklist();
        echo '</div>';
    }
}
