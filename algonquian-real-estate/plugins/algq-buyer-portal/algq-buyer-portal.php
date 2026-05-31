<?php
/**
 * Plugin Name: Algonquian Buyer Portal
 * Description: Buyer registration, NDA gating, download permissions, deal package delivery, and interest submission workflows.
 * Version: 0.2.0
 * Author: Algonquian Real Estate
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Buyer_Portal
{
    private const BUYER_ROLE = 'algq_buyer';
    private const DEAL_POST_TYPE = 'algq_deal_package';
    private const INTEREST_TABLE = 'algq_buyer_interest';
    private const NDA_META_KEY = 'algq_nda_accepted_at';
    private const ACCESS_META_KEY = 'algq_allowed_deal_packages';
    private const INTEREST_STAGES = ['interested', 'requested_call', 'offer_submitted', 'assigned'];

    public function __construct()
    {
        add_action('init', [$this, 'register_deal_package_post_type']);
        add_shortcode('algq_buyer_portal', [$this, 'render_portal']);
        add_shortcode('algq_buyer_registration', [$this, 'render_registration']);
    }

    public static function activate(): void
    {
        add_role(self::BUYER_ROLE, 'Algonquian Buyer', ['read' => true]);

        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        dbDelta("CREATE TABLE {$wpdb->prefix}" . self::INTEREST_TABLE . " (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            buyer_id bigint(20) unsigned NOT NULL,
            deal_id bigint(20) unsigned NOT NULL,
            stage varchar(32) NOT NULL DEFAULT 'interested',
            message text NOT NULL,
            proof_of_funds decimal(14,2) NOT NULL DEFAULT 0,
            preferred_close_date date NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY buyer_deal (buyer_id, deal_id),
            KEY deal_id (deal_id),
            KEY stage (stage)
        ) {$wpdb->get_charset_collate()};");
    }

    public function register_deal_package_post_type(): void
    {
        register_post_type(self::DEAL_POST_TYPE, [
            'labels' => [
                'name' => 'Deal Packages',
                'singular_name' => 'Deal Package',
                'add_new_item' => 'Add Deal Package',
                'edit_item' => 'Edit Deal Package',
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
            'capability_type' => 'post',
            'menu_icon' => 'dashicons-portfolio',
        ]);
    }

    public function render_registration(): string
    {
        if (is_user_logged_in()) {
            return '<div class="algq-buyer-notice algq-buyer-notice--success">You are already registered. Visit the buyer portal to complete your profile.</div>';
        }

        $notice = '';
        if ('POST' === ($_SERVER['REQUEST_METHOD'] ?? '') && isset($_POST['algq_buyer_register_nonce'])) {
            $notice = $this->handle_registration();
        }

        ob_start();
        echo $notice; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        ?>
        <form class="algq-buyer-registration" method="post">
            <h2>Buyer Registration</h2>
            <p>Create a buyer account to request gated deal packages, accept the NDA, and submit acquisition interest.</p>
            <?php wp_nonce_field('algq_buyer_register', 'algq_buyer_register_nonce'); ?>
            <p><label>Full Name <input name="algq_name" required autocomplete="name" /></label></p>
            <p><label>Email <input name="algq_email" type="email" required autocomplete="email" /></label></p>
            <p><label>Password <input name="algq_password" type="password" required autocomplete="new-password" minlength="8" /></label></p>
            <p><label>Target Markets <input name="algq_markets" placeholder="Atlanta, Charlotte, Tampa" /></label></p>
            <p><label>Cash Available <input name="algq_cash_available" type="number" min="0" step="0.01" /></label></p>
            <p><label>Buy Box <textarea name="algq_buy_box" rows="4" placeholder="Asset classes, ARV range, condition, close timeline"></textarea></label></p>
            <p><button type="submit">Register as Buyer</button></p>
        </form>
        <?php
        return (string) ob_get_clean();
    }

    public function render_portal(): string
    {
        if (!is_user_logged_in()) {
            return $this->render_logged_out_gate();
        }

        $user_id = get_current_user_id();
        $notice = '';

        if ('POST' === ($_SERVER['REQUEST_METHOD'] ?? '')) {
            if (isset($_POST['algq_buyer_profile_nonce'])) {
                $notice = $this->handle_profile_update($user_id);
            } elseif (isset($_POST['algq_interest_nonce'])) {
                $notice = $this->handle_interest_submission($user_id);
            }
        }

        ob_start();
        echo '<div class="algq-buyer-portal">';
        echo '<h2>Buyer Portal</h2>';
        echo $notice; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo $this->render_profile_form($user_id); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

        if (!$this->has_accepted_nda($user_id)) {
            echo $this->render_nda_gate(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            echo '</div>';
            return (string) ob_get_clean();
        }

        echo $this->render_deal_packages($user_id); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo $this->render_interest_history($user_id); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo '</div>';

        return (string) ob_get_clean();
    }

    private function handle_registration(): string
    {
        if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['algq_buyer_register_nonce'] ?? '')), 'algq_buyer_register')) {
            return $this->notice('Registration could not be verified. Please try again.', 'error');
        }

        $email = sanitize_email(wp_unslash($_POST['algq_email'] ?? ''));
        $password = (string) wp_unslash($_POST['algq_password'] ?? '');
        $name = sanitize_text_field(wp_unslash($_POST['algq_name'] ?? ''));

        if (!$email || !is_email($email) || strlen($password) < 8) {
            return $this->notice('Enter a valid email and a password with at least 8 characters.', 'error');
        }

        if (email_exists($email)) {
            return $this->notice('An account already exists for that email. Please log in.', 'error');
        }

        $user_id = wp_create_user($email, $password, $email);
        if (is_wp_error($user_id)) {
            return $this->notice($user_id->get_error_message(), 'error');
        }

        $user = new WP_User($user_id);
        $user->set_role(self::BUYER_ROLE);
        wp_update_user(['ID' => $user_id, 'display_name' => $name ?: $email, 'first_name' => $name]);
        $this->save_profile_fields($user_id);

        return $this->notice('Registration received. Please log in to accept the NDA and access approved deal packages.', 'success');
    }

    private function handle_profile_update(int $user_id): string
    {
        if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['algq_buyer_profile_nonce'] ?? '')), 'algq_buyer_profile')) {
            return $this->notice('Profile update could not be verified. Please try again.', 'error');
        }

        $this->save_profile_fields($user_id);

        if (!empty($_POST['algq_nda_accepted'])) {
            update_user_meta($user_id, self::NDA_META_KEY, current_time('mysql'));
            update_user_meta($user_id, 'algq_nda_version', sanitize_text_field(wp_unslash($_POST['algq_nda_version'] ?? 'v1')));
        }

        return $this->notice('Buyer profile saved.', 'success');
    }

    private function handle_interest_submission(int $user_id): string
    {
        if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['algq_interest_nonce'] ?? '')), 'algq_buyer_interest')) {
            return $this->notice('Interest submission could not be verified. Please try again.', 'error');
        }

        $deal_id = absint($_POST['algq_deal_id'] ?? 0);
        if (!$deal_id || !$this->can_access_deal($user_id, $deal_id)) {
            return $this->notice('You do not have permission to submit interest for this deal package.', 'error');
        }

        $stage = sanitize_key(wp_unslash($_POST['algq_interest_stage'] ?? 'interested'));
        if (!in_array($stage, self::INTEREST_STAGES, true)) {
            $stage = 'interested';
        }

        global $wpdb;
        $now = current_time('mysql');
        $wpdb->replace(
            $wpdb->prefix . self::INTEREST_TABLE,
            [
                'buyer_id' => $user_id,
                'deal_id' => $deal_id,
                'stage' => $stage,
                'message' => sanitize_textarea_field(wp_unslash($_POST['algq_interest_message'] ?? '')),
                'proof_of_funds' => (float) ($_POST['algq_proof_of_funds'] ?? 0),
                'preferred_close_date' => $this->sanitize_date($_POST['algq_close_date'] ?? ''),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            ['%d', '%d', '%s', '%s', '%f', '%s', '%s', '%s']
        );

        return $this->notice('Interest submitted. Our acquisitions team can now advance the buyer workflow.', 'success');
    }

    private function save_profile_fields(int $user_id): void
    {
        update_user_meta($user_id, 'algq_markets', sanitize_text_field(wp_unslash($_POST['algq_markets'] ?? $_POST['markets'] ?? '')));
        update_user_meta($user_id, 'algq_cash_available', (float) ($_POST['algq_cash_available'] ?? $_POST['cash_available'] ?? 0));
        update_user_meta($user_id, 'algq_buy_box', sanitize_textarea_field(wp_unslash($_POST['algq_buy_box'] ?? $_POST['buy_box'] ?? '')));
        update_user_meta($user_id, 'algq_property_types', sanitize_text_field(wp_unslash($_POST['algq_property_types'] ?? $_POST['property_types'] ?? '')));
        update_user_meta($user_id, 'algq_close_timeline', sanitize_text_field(wp_unslash($_POST['algq_close_timeline'] ?? '')));
    }

    private function render_logged_out_gate(): string
    {
        ob_start();
        ?>
        <div class="algq-buyer-login">
            <h2>Buyer Portal Access</h2>
            <p>Please log in or register to access gated buyer deal packages.</p>
            <?php echo wp_login_form(['echo' => false]); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
            <?php echo do_shortcode('[algq_buyer_registration]'); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
        </div>
        <?php
        return (string) ob_get_clean();
    }

    private function render_profile_form(int $user_id): string
    {
        ob_start();
        ?>
        <form class="algq-buyer-profile" method="post">
            <h3>Buyer Profile & NDA</h3>
            <?php wp_nonce_field('algq_buyer_profile', 'algq_buyer_profile_nonce'); ?>
            <p><label>Markets <input name="algq_markets" value="<?php echo esc_attr(get_user_meta($user_id, 'algq_markets', true)); ?>" /></label></p>
            <p><label>Cash Available <input name="algq_cash_available" type="number" min="0" step="0.01" value="<?php echo esc_attr(get_user_meta($user_id, 'algq_cash_available', true)); ?>" /></label></p>
            <p><label>Buy Box <textarea name="algq_buy_box" rows="4"><?php echo esc_textarea(get_user_meta($user_id, 'algq_buy_box', true)); ?></textarea></label></p>
            <p><label>Property Types <input name="algq_property_types" value="<?php echo esc_attr(get_user_meta($user_id, 'algq_property_types', true)); ?>" /></label></p>
            <p><label>Close Timeline <input name="algq_close_timeline" value="<?php echo esc_attr(get_user_meta($user_id, 'algq_close_timeline', true)); ?>" placeholder="Cash close in 14 days" /></label></p>
            <input name="algq_nda_version" type="hidden" value="v1" />
            <p><label><input name="algq_nda_accepted" type="checkbox" value="1" <?php checked($this->has_accepted_nda($user_id)); ?> /> I accept the Algonquian NDA and confidentiality terms for non-public deal materials.</label></p>
            <p><button type="submit">Save Profile</button></p>
        </form>
        <?php
        return (string) ob_get_clean();
    }

    private function render_nda_gate(): string
    {
        return '<section class="algq-nda-gate"><h3>NDA Required</h3><p>Deal package downloads and interest submissions are locked until the buyer profile includes NDA acceptance.</p></section>';
    }

    private function render_deal_packages(int $user_id): string
    {
        $packages = get_posts([
            'post_type' => self::DEAL_POST_TYPE,
            'post_status' => 'publish',
            'numberposts' => 20,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        ob_start();
        echo '<section class="algq-deal-packages"><h3>Deal Package Delivery</h3>';
        if (!$packages) {
            echo '<p>No deal packages are currently published. Approved packages will appear here with secure download links.</p>';
        }

        foreach ($packages as $package) {
            $can_access = $this->can_access_deal($user_id, (int) $package->ID);
            echo '<article class="algq-deal-package">';
            echo '<h4>' . esc_html(get_the_title($package)) . '</h4>';
            echo '<div class="algq-deal-summary">' . wp_kses_post(wpautop($package->post_content)) . '</div>';
            echo '<p><strong>Status:</strong> ' . esc_html($can_access ? 'Download approved' : 'Awaiting permission') . '</p>';

            if ($can_access) {
                echo $this->render_downloads((int) $package->ID); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                echo $this->render_interest_form((int) $package->ID); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            } else {
                echo '<p class="algq-download-locked">Request access from the acquisitions team to unlock the package files and interest workflow.</p>';
            }
            echo '</article>';
        }
        echo '</section>';
        return (string) ob_get_clean();
    }

    private function render_downloads(int $deal_id): string
    {
        $downloads = array_filter(array_map('trim', explode("\n", (string) get_post_meta($deal_id, 'algq_download_urls', true))));
        if (!$downloads) {
            return '<p class="algq-downloads-empty">Download links can be added with the <code>algq_download_urls</code> custom field, one URL per line.</p>';
        }

        $output = '<ul class="algq-secure-downloads">';
        foreach ($downloads as $index => $download) {
            $output .= '<li><a href="' . esc_url($download) . '" target="_blank" rel="noopener">Download package file ' . esc_html((string) ($index + 1)) . '</a></li>';
        }
        $output .= '</ul>';

        return $output;
    }

    private function render_interest_form(int $deal_id): string
    {
        ob_start();
        ?>
        <form class="algq-interest-form" method="post">
            <h5>Submit Interest</h5>
            <?php wp_nonce_field('algq_buyer_interest', 'algq_interest_nonce'); ?>
            <input name="algq_deal_id" type="hidden" value="<?php echo esc_attr((string) $deal_id); ?>" />
            <p><label>Workflow Stage
                <select name="algq_interest_stage">
                    <option value="interested">Interested</option>
                    <option value="requested_call">Requested Call</option>
                    <option value="offer_submitted">Offer Submitted</option>
                    <option value="assigned">Assigned</option>
                </select>
            </label></p>
            <p><label>Proof of Funds <input name="algq_proof_of_funds" type="number" min="0" step="0.01" /></label></p>
            <p><label>Preferred Close Date <input name="algq_close_date" type="date" /></label></p>
            <p><label>Message <textarea name="algq_interest_message" rows="3" placeholder="Questions, offer terms, access requests, or closing notes"></textarea></label></p>
            <p><button type="submit">Submit Interest</button></p>
        </form>
        <?php
        return (string) ob_get_clean();
    }

    private function render_interest_history(int $user_id): string
    {
        global $wpdb;
        $rows = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->prefix}" . self::INTEREST_TABLE . ' WHERE buyer_id = %d ORDER BY updated_at DESC LIMIT 20', $user_id));

        ob_start();
        echo '<section class="algq-interest-history"><h3>Interest Submission Workflow</h3>';
        if (!$rows) {
            echo '<p>No interest has been submitted yet. Use an approved deal package to enter the workflow.</p>';
        } else {
            echo '<table><thead><tr><th>Deal</th><th>Stage</th><th>Proof of Funds</th><th>Updated</th></tr></thead><tbody>';
            foreach ($rows as $row) {
                echo '<tr><td>' . esc_html(get_the_title((int) $row->deal_id)) . '</td><td>' . esc_html($this->format_stage((string) $row->stage)) . '</td><td>' . esc_html(number_format((float) $row->proof_of_funds, 2)) . '</td><td>' . esc_html((string) $row->updated_at) . '</td></tr>';
            }
            echo '</tbody></table>';
        }
        echo '</section>';
        return (string) ob_get_clean();
    }

    private function can_access_deal(int $user_id, int $deal_id): bool
    {
        if (!$this->has_accepted_nda($user_id)) {
            return false;
        }

        $allowed = get_post_meta($deal_id, 'algq_allowed_buyers', true);
        $user_allowed = get_user_meta($user_id, self::ACCESS_META_KEY, true);
        $allowed_ids = $this->parse_id_list($allowed);
        $user_allowed_ids = $this->parse_id_list($user_allowed);

        return !$allowed_ids || in_array($user_id, $allowed_ids, true) || in_array($deal_id, $user_allowed_ids, true) || current_user_can('manage_options');
    }

    private function has_accepted_nda(int $user_id): bool
    {
        return '' !== (string) get_user_meta($user_id, self::NDA_META_KEY, true) || 'yes' === get_user_meta($user_id, 'algq_nda_accepted', true);
    }

    private function parse_id_list($value): array
    {
        if (is_array($value)) {
            return array_map('absint', $value);
        }

        return array_filter(array_map('absint', preg_split('/[\s,]+/', (string) $value)));
    }

    private function sanitize_date($value): ?string
    {
        $date = sanitize_text_field(wp_unslash($value));
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return $date;
        }

        return null;
    }

    private function format_stage(string $stage): string
    {
        return ucwords(str_replace('_', ' ', $stage));
    }

    private function notice(string $message, string $type): string
    {
        return '<div class="algq-buyer-notice algq-buyer-notice--' . esc_attr($type) . '">' . esc_html($message) . '</div>';
    }
}

register_activation_hook(__FILE__, ['ALGQ_Buyer_Portal', 'activate']);
new ALGQ_Buyer_Portal();
