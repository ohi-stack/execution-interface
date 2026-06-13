<?php
/**
 * Plugin Name: Algonquian Deal Intake
 * Description: Seller lead intake and admin dashboard for Algonquian Real Estate, LLC.
 * Version: 1.1.0
 * Author: Algonquian Real Estate, LLC
 * Text Domain: algq-deal-intake
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Intake {
    const VERSION = '1.1.0';
    const TABLE = 'algq_deal_intake_leads';

    public static function init() {
        register_activation_hook(__FILE__, array(__CLASS__, 'activate'));
        add_action('admin_menu', array(__CLASS__, 'admin_menu'));
        add_action('admin_enqueue_scripts', array(__CLASS__, 'admin_assets'));
        add_action('wp_enqueue_scripts', array(__CLASS__, 'public_assets'));
        add_action('admin_post_algq_deal_intake_save', array(__CLASS__, 'handle_save'));
        add_action('admin_post_algq_deal_intake_status', array(__CLASS__, 'handle_status'));
        add_action('admin_post_nopriv_algq_deal_intake_public_submit', array(__CLASS__, 'handle_public_submit'));
        add_action('admin_post_algq_deal_intake_public_submit', array(__CLASS__, 'handle_public_submit'));
        add_shortcode('algq_deal_intake_admin', array(__CLASS__, 'admin_shortcode'));
        add_shortcode('algq_sell_property_form', array(__CLASS__, 'public_form_shortcode'));
        add_shortcode('algq_fsbo_contact_form', array(__CLASS__, 'public_form_shortcode'));
        add_shortcode('algq_property_evaluation_form', array(__CLASS__, 'public_form_shortcode'));
        add_shortcode('algq_seller_financing_inquiry', array(__CLASS__, 'public_form_shortcode'));
        add_shortcode('algq_inherited_property_form', array(__CLASS__, 'public_form_shortcode'));
        add_shortcode('algq_vacant_property_form', array(__CLASS__, 'public_form_shortcode'));
    }

    public static function table_name() {
        global $wpdb;
        return $wpdb->prefix . self::TABLE;
    }

    public static function activate() {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset_collate = $wpdb->get_charset_collate();
        $table = self::table_name();
        $sql = "CREATE TABLE {$table} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            status varchar(20) NOT NULL DEFAULT 'new',
            seller_name varchar(190) NOT NULL DEFAULT '',
            seller_email varchar(190) NOT NULL DEFAULT '',
            seller_phone varchar(80) NOT NULL DEFAULT '',
            property_address text NOT NULL,
            property_city varchar(120) NOT NULL DEFAULT '',
            property_state varchar(40) NOT NULL DEFAULT '',
            property_zip varchar(30) NOT NULL DEFAULT '',
            property_type varchar(120) NOT NULL DEFAULT '',
            bedrooms varchar(20) NOT NULL DEFAULT '',
            bathrooms varchar(20) NOT NULL DEFAULT '',
            asking_price decimal(14,2) NULL,
            estimated_value decimal(14,2) NULL,
            mortgage_balance decimal(14,2) NULL,
            timeline varchar(120) NOT NULL DEFAULT '',
            motivation text NOT NULL,
            notes longtext NOT NULL,
            source varchar(120) NOT NULL DEFAULT '',
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY status (status),
            KEY created_at (created_at)
        ) {$charset_collate};";
        dbDelta($sql);
    }

    public static function admin_menu() {
        add_menu_page(__('ARE Deal Intake', 'algq-deal-intake'), __('ARE Deal Intake', 'algq-deal-intake'), 'manage_options', 'algq-deal-intake', array(__CLASS__, 'render_admin_page'), 'dashicons-building', 26);
    }

    public static function admin_assets($hook) {
        if ('toplevel_page_algq-deal-intake' !== $hook) {
            return;
        }
        wp_enqueue_style('algq-deal-intake-admin', plugin_dir_url(__FILE__) . 'assets/css/admin.css', array(), self::VERSION);
        wp_enqueue_script('algq-deal-intake-admin', plugin_dir_url(__FILE__) . 'assets/js/admin.js', array(), self::VERSION, true);
    }

    public static function public_assets() {
        wp_enqueue_style('algq-deal-intake-admin', plugin_dir_url(__FILE__) . 'assets/css/admin.css', array(), self::VERSION);
    }

    public static function allowed_statuses() {
        return array('new', 'reviewing', 'converted', 'archived');
    }

    public static function status_label($status) {
        $labels = array('new' => 'New', 'reviewing' => 'Reviewing', 'converted' => 'Converted', 'archived' => 'Archived');
        return isset($labels[$status]) ? $labels[$status] : $labels['new'];
    }

    public static function sanitize_money($value) {
        return '' === $value ? null : floatval(preg_replace('/[^0-9.\-]/', '', (string) $value));
    }

    public static function sanitize_lead($input) {
        $status = isset($input['status']) ? sanitize_key($input['status']) : 'new';
        if (!in_array($status, self::allowed_statuses(), true)) {
            $status = 'new';
        }
        return array(
            'status' => $status,
            'seller_name' => sanitize_text_field($input['seller_name'] ?? ''),
            'seller_email' => sanitize_email($input['seller_email'] ?? ''),
            'seller_phone' => sanitize_text_field($input['seller_phone'] ?? ''),
            'property_address' => sanitize_textarea_field($input['property_address'] ?? ''),
            'property_city' => sanitize_text_field($input['property_city'] ?? ''),
            'property_state' => sanitize_text_field($input['property_state'] ?? ''),
            'property_zip' => sanitize_text_field($input['property_zip'] ?? ''),
            'property_type' => sanitize_text_field($input['property_type'] ?? ''),
            'bedrooms' => sanitize_text_field($input['bedrooms'] ?? ''),
            'bathrooms' => sanitize_text_field($input['bathrooms'] ?? ''),
            'asking_price' => self::sanitize_money($input['asking_price'] ?? ''),
            'estimated_value' => self::sanitize_money($input['estimated_value'] ?? ''),
            'mortgage_balance' => self::sanitize_money($input['mortgage_balance'] ?? ''),
            'timeline' => sanitize_text_field($input['timeline'] ?? ''),
            'motivation' => sanitize_textarea_field($input['motivation'] ?? ''),
            'notes' => wp_kses_post($input['notes'] ?? ''),
            'source' => sanitize_text_field($input['source'] ?? 'Website'),
        );
    }

    public static function handle_save() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('Insufficient permissions.', 'algq-deal-intake'));
        }
        check_admin_referer('algq_deal_intake_save', 'algq_nonce');
        global $wpdb;
        $data = self::sanitize_lead(wp_unslash($_POST));
        $now = current_time('mysql');
        $id = absint($_POST['lead_id'] ?? 0);
        $formats = array('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%f','%f','%f','%s','%s','%s','%s');
        if ($id) {
            $data['updated_at'] = $now;
            $wpdb->update(self::table_name(), $data, array('id' => $id), $formats, array('%d'));
        } else {
            $data['created_at'] = $now;
            $data['updated_at'] = $now;
            $wpdb->insert(self::table_name(), $data, array_merge($formats, array('%s','%s')));
        }
        wp_safe_redirect(admin_url('admin.php?page=algq-deal-intake&algq_notice=saved'));
        exit;
    }

    public static function handle_status() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('Insufficient permissions.', 'algq-deal-intake'));
        }
        check_admin_referer('algq_deal_intake_status', 'algq_nonce');
        $id = absint($_POST['lead_id'] ?? 0);
        $status = sanitize_key($_POST['status'] ?? 'new');
        if ($id && in_array($status, self::allowed_statuses(), true)) {
            global $wpdb;
            $wpdb->update(self::table_name(), array('status' => $status, 'updated_at' => current_time('mysql')), array('id' => $id), array('%s','%s'), array('%d'));
        }
        wp_safe_redirect(admin_url('admin.php?page=algq-deal-intake&algq_notice=status'));
        exit;
    }

    public static function handle_public_submit() {
        check_admin_referer('algq_deal_intake_public_submit', 'algq_nonce');
        global $wpdb;
        $data = self::sanitize_lead(wp_unslash($_POST));
        $data['status'] = 'new';
        $data['created_at'] = current_time('mysql');
        $data['updated_at'] = current_time('mysql');
        $wpdb->insert(self::table_name(), $data);
        wp_safe_redirect(esc_url_raw(add_query_arg('algq_submitted', '1', wp_get_referer() ?: home_url('/'))));
        exit;
    }

    public static function get_counts() {
        global $wpdb;
        $counts = array_fill_keys(self::allowed_statuses(), 0);
        $rows = $wpdb->get_results("SELECT status, COUNT(*) AS total FROM " . self::table_name() . " GROUP BY status");
        foreach ((array) $rows as $row) {
            if (isset($counts[$row->status])) {
                $counts[$row->status] = absint($row->total);
            }
        }
        return $counts;
    }

    public static function get_leads() {
        global $wpdb;
        return $wpdb->get_results("SELECT * FROM " . self::table_name() . " ORDER BY created_at DESC LIMIT 200");
    }

    public static function get_lead($id) {
        if (!$id) {
            return null;
        }
        global $wpdb;
        return $wpdb->get_row($wpdb->prepare("SELECT * FROM " . self::table_name() . " WHERE id = %d", $id));
    }

    public static function lead_value($lead, $field) {
        return $lead && isset($lead->{$field}) ? $lead->{$field} : '';
    }

    public static function render_admin_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        echo self::render_dashboard();
    }

    public static function admin_shortcode() {
        if (!current_user_can('manage_options')) {
            return '<p>' . esc_html__('You do not have permission to view deal intake.', 'algq-deal-intake') . '</p>';
        }
        return self::render_dashboard();
    }

    public static function render_dashboard() {
        $counts = self::get_counts();
        $leads = self::get_leads();
        $editing = self::get_lead(absint($_GET['edit_lead'] ?? 0));
        ob_start();
        ?>
        <div class="algq-admin-wrap">
            <header class="algq-hero">
                <div>
                    <p class="algq-eyebrow"><?php echo esc_html__('Algonquian Real Estate, LLC', 'algq-deal-intake'); ?></p>
                    <h1><?php echo esc_html__('Deal Intake Dashboard', 'algq-deal-intake'); ?></h1>
                    <p class="algq-motto"><?php echo esc_html__('Faith. Focus. Loyalty. Legacy.', 'algq-deal-intake'); ?></p>
                </div>
                <a class="algq-button algq-button-gold" href="#algq-lead-form"><?php echo esc_html__('Add Seller Lead', 'algq-deal-intake'); ?></a>
            </header>
            <section class="algq-kpis" aria-label="<?php echo esc_attr__('Lead status summary', 'algq-deal-intake'); ?>">
                <?php foreach (self::allowed_statuses() as $status) : ?>
                    <article class="algq-kpi-card">
                        <span class="algq-status-badge algq-status-<?php echo esc_attr($status); ?>"><?php echo esc_html(self::status_label($status)); ?></span>
                        <strong><?php echo esc_html(number_format_i18n($counts[$status])); ?></strong>
                        <p><?php echo esc_html(self::status_label($status) . ('new' === $status ? ' Leads' : '')); ?></p>
                    </article>
                <?php endforeach; ?>
            </section>
            <section class="algq-panel">
                <div class="algq-panel-head"><h2><?php echo esc_html__('Seller Lead Pipeline', 'algq-deal-intake'); ?></h2></div>
                <?php if (empty($leads)) : ?>
                    <div class="algq-empty-state"><h3><?php echo esc_html__('No seller leads yet.', 'algq-deal-intake'); ?></h3><p><?php echo esc_html__('New website submissions and manually entered opportunities will appear here.', 'algq-deal-intake'); ?></p></div>
                <?php else : ?>
                    <div class="algq-table-wrap"><table class="algq-table"><thead><tr><th><?php echo esc_html__('Seller', 'algq-deal-intake'); ?></th><th><?php echo esc_html__('Property', 'algq-deal-intake'); ?></th><th><?php echo esc_html__('Status', 'algq-deal-intake'); ?></th><th><?php echo esc_html__('Source', 'algq-deal-intake'); ?></th><th><?php echo esc_html__('Actions', 'algq-deal-intake'); ?></th></tr></thead><tbody>
                    <?php foreach ($leads as $lead) : ?>
                        <tr>
                            <td><strong><?php echo esc_html($lead->seller_name); ?></strong><br><span><?php echo esc_html($lead->seller_email); ?> · <?php echo esc_html($lead->seller_phone); ?></span></td>
                            <td><?php echo esc_html($lead->property_address); ?><br><span><?php echo esc_html(trim($lead->property_city . ', ' . $lead->property_state . ' ' . $lead->property_zip)); ?></span></td>
                            <td><span class="algq-status-badge algq-status-<?php echo esc_attr($lead->status); ?>"><?php echo esc_html(self::status_label($lead->status)); ?></span></td>
                            <td><?php echo esc_html($lead->source); ?></td>
                            <td class="algq-actions">
                                <button type="button" class="algq-button algq-button-light" data-algq-view="<?php echo esc_attr(absint($lead->id)); ?>"><?php echo esc_html__('View', 'algq-deal-intake'); ?></button>
                                <a class="algq-button algq-button-light" href="<?php echo esc_url(add_query_arg(array('page' => 'algq-deal-intake', 'edit_lead' => absint($lead->id)), admin_url('admin.php')) . '#algq-lead-form'); ?>"><?php echo esc_html__('Edit', 'algq-deal-intake'); ?></a>
                                <?php self::status_form($lead->id, 'converted', __('Convert to Pipeline', 'algq-deal-intake')); ?>
                                <?php self::status_form($lead->id, 'archived', __('Archive', 'algq-deal-intake')); ?>
                            </td>
                        </tr>
                        <tr class="algq-detail-row" id="algq-detail-<?php echo esc_attr(absint($lead->id)); ?>"><td colspan="5"><strong><?php echo esc_html__('Motivation:', 'algq-deal-intake'); ?></strong> <?php echo esc_html($lead->motivation); ?><br><strong><?php echo esc_html__('Notes:', 'algq-deal-intake'); ?></strong> <?php echo wp_kses_post($lead->notes); ?></td></tr>
                    <?php endforeach; ?>
                    </tbody></table></div>
                <?php endif; ?>
            </section>
            <?php echo self::lead_form($editing); ?>
        </div>
        <?php
        return ob_get_clean();
    }

    public static function status_form($id, $status, $label) {
        ?>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="algq-inline-form">
            <input type="hidden" name="action" value="algq_deal_intake_status">
            <input type="hidden" name="lead_id" value="<?php echo esc_attr(absint($id)); ?>">
            <input type="hidden" name="status" value="<?php echo esc_attr($status); ?>">
            <?php wp_nonce_field('algq_deal_intake_status', 'algq_nonce'); ?>
            <button type="submit" class="algq-button <?php echo 'archived' === $status ? 'algq-button-danger' : 'algq-button-navy'; ?>"><?php echo esc_html($label); ?></button>
        </form>
        <?php
    }

    public static function lead_form($lead = null) {
        ob_start();
        ?>
        <section class="algq-panel algq-form-panel" id="algq-lead-form">
            <div class="algq-panel-head"><h2><?php echo esc_html($lead ? __('Edit Seller Lead', 'algq-deal-intake') : __('Seller Lead Intake', 'algq-deal-intake')); ?></h2><p><?php echo esc_html__('Institutional intake for acquisition opportunities.', 'algq-deal-intake'); ?></p></div>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="algq-intake-form">
                <input type="hidden" name="action" value="algq_deal_intake_save">
                <input type="hidden" name="lead_id" value="<?php echo esc_attr(absint(self::lead_value($lead, 'id'))); ?>">
                <?php wp_nonce_field('algq_deal_intake_save', 'algq_nonce'); ?>
                <fieldset><legend><?php echo esc_html__('Seller Contact', 'algq-deal-intake'); ?></legend><div class="algq-grid"><label><?php echo esc_html__('Name', 'algq-deal-intake'); ?><input name="seller_name" type="text" value="<?php echo esc_attr(self::lead_value($lead, 'seller_name')); ?>"></label><label><?php echo esc_html__('Email', 'algq-deal-intake'); ?><input name="seller_email" type="email" value="<?php echo esc_attr(self::lead_value($lead, 'seller_email')); ?>"></label><label><?php echo esc_html__('Phone', 'algq-deal-intake'); ?><input name="seller_phone" type="text" value="<?php echo esc_attr(self::lead_value($lead, 'seller_phone')); ?>"></label><label><?php echo esc_html__('Lead Source', 'algq-deal-intake'); ?><input name="source" type="text" value="<?php echo esc_attr(self::lead_value($lead, 'source') ?: 'Website'); ?>"></label></div></fieldset>
                <fieldset><legend><?php echo esc_html__('Property Details', 'algq-deal-intake'); ?></legend><div class="algq-grid"><label class="algq-span-2"><?php echo esc_html__('Property Address', 'algq-deal-intake'); ?><textarea name="property_address" rows="2"><?php echo esc_textarea(self::lead_value($lead, 'property_address')); ?></textarea></label><label><?php echo esc_html__('City', 'algq-deal-intake'); ?><input name="property_city" type="text" value="<?php echo esc_attr(self::lead_value($lead, 'property_city')); ?>"></label><label><?php echo esc_html__('State', 'algq-deal-intake'); ?><input name="property_state" type="text" value="<?php echo esc_attr(self::lead_value($lead, 'property_state')); ?>"></label><label><?php echo esc_html__('ZIP', 'algq-deal-intake'); ?><input name="property_zip" type="text" value="<?php echo esc_attr(self::lead_value($lead, 'property_zip')); ?>"></label><label><?php echo esc_html__('Property Type', 'algq-deal-intake'); ?><input name="property_type" type="text" value="<?php echo esc_attr(self::lead_value($lead, 'property_type')); ?>"></label><label><?php echo esc_html__('Bedrooms', 'algq-deal-intake'); ?><input name="bedrooms" type="text" value="<?php echo esc_attr(self::lead_value($lead, 'bedrooms')); ?>"></label><label><?php echo esc_html__('Bathrooms', 'algq-deal-intake'); ?><input name="bathrooms" type="text" value="<?php echo esc_attr(self::lead_value($lead, 'bathrooms')); ?>"></label></div></fieldset>
                <fieldset><legend><?php echo esc_html__('Deal Context', 'algq-deal-intake'); ?></legend><div class="algq-grid"><label><?php echo esc_html__('Asking Price', 'algq-deal-intake'); ?><input name="asking_price" type="text" value="<?php echo esc_attr(self::lead_value($lead, 'asking_price')); ?>"></label><label><?php echo esc_html__('Estimated Value', 'algq-deal-intake'); ?><input name="estimated_value" type="text" value="<?php echo esc_attr(self::lead_value($lead, 'estimated_value')); ?>"></label><label><?php echo esc_html__('Mortgage Balance', 'algq-deal-intake'); ?><input name="mortgage_balance" type="text" value="<?php echo esc_attr(self::lead_value($lead, 'mortgage_balance')); ?>"></label><label><?php echo esc_html__('Timeline', 'algq-deal-intake'); ?><input name="timeline" type="text" value="<?php echo esc_attr(self::lead_value($lead, 'timeline')); ?>"></label><label class="algq-span-2"><?php echo esc_html__('Motivation', 'algq-deal-intake'); ?><textarea name="motivation" rows="3"><?php echo esc_textarea(self::lead_value($lead, 'motivation')); ?></textarea></label><label class="algq-span-2"><?php echo esc_html__('Notes', 'algq-deal-intake'); ?><textarea name="notes" rows="4"><?php echo esc_textarea(self::lead_value($lead, 'notes')); ?></textarea></label></div></fieldset>
                <button class="algq-button algq-button-gold" type="submit"><?php echo esc_html($lead ? __('Update Lead', 'algq-deal-intake') : __('Save Lead', 'algq-deal-intake')); ?></button>
            </form>
        </section>
        <?php
        return ob_get_clean();
    }

    public static function public_form_shortcode() {
        ob_start();
        ?>
        <div class="algq-public-intake algq-admin-wrap"><?php if (isset($_GET['algq_submitted'])) : ?><div class="algq-empty-state"><strong><?php echo esc_html__('Thank you. Your property information has been received.', 'algq-deal-intake'); ?></strong></div><?php endif; ?><form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="algq-intake-form"><input type="hidden" name="action" value="algq_deal_intake_public_submit"><?php wp_nonce_field('algq_deal_intake_public_submit', 'algq_nonce'); ?><fieldset><legend><?php echo esc_html__('Tell us about your property', 'algq-deal-intake'); ?></legend><div class="algq-grid"><label><?php echo esc_html__('Name', 'algq-deal-intake'); ?><input name="seller_name" required></label><label><?php echo esc_html__('Email', 'algq-deal-intake'); ?><input name="seller_email" type="email"></label><label><?php echo esc_html__('Phone', 'algq-deal-intake'); ?><input name="seller_phone"></label><label class="algq-span-2"><?php echo esc_html__('Property Address', 'algq-deal-intake'); ?><textarea name="property_address" rows="2" required></textarea></label><label><?php echo esc_html__('City', 'algq-deal-intake'); ?><input name="property_city"></label><label><?php echo esc_html__('State', 'algq-deal-intake'); ?><input name="property_state"></label><label><?php echo esc_html__('ZIP', 'algq-deal-intake'); ?><input name="property_zip"></label><label><?php echo esc_html__('Timeline', 'algq-deal-intake'); ?><input name="timeline"></label><label class="algq-span-2"><?php echo esc_html__('How can we help?', 'algq-deal-intake'); ?><textarea name="motivation" rows="4"></textarea></label></div></fieldset><button class="algq-button algq-button-gold" type="submit"><?php echo esc_html__('Submit Property', 'algq-deal-intake'); ?></button></form></div>
        <?php
        return ob_get_clean();
    }
}
ALGQ_Deal_Intake::init();
