<?php
/**
 * Plugin Name: Algonquian Tenant Management
 * Description: Dedicated tenant, lease, rent, maintenance, notices, documents, and Connecticut workflow operations for Algonquian Real Estate, LLC.
 * Version: 1.0.0
 * Author: Algonquian Real Estate, LLC
 * Text Domain: algq-tenant-management
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Tenant_Management {
    const VERSION = '1.0.0';
    const CAPABILITY = 'manage_algq_tenants';
    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('init', array($this, 'register_shortcodes'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_public_assets'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('admin_menu', array($this, 'register_admin_menu'));
        add_action('admin_post_algq_tm_save_application', array($this, 'handle_application'));
        add_action('admin_post_nopriv_algq_tm_save_application', array($this, 'handle_application'));
        add_action('admin_post_algq_tm_save_maintenance', array($this, 'handle_maintenance'));
        add_action('admin_post_nopriv_algq_tm_save_maintenance', array($this, 'handle_maintenance'));
    }

    public static function activate() {
        self::create_tables();
        self::add_roles_and_caps();
        self::create_pages();
        flush_rewrite_rules();
    }

    public static function deactivate() {
        flush_rewrite_rules();
    }

    public static function uninstall_cleanup() {
        delete_option('algq_tm_version');
    }

    private static function table($name) {
        global $wpdb;
        return $wpdb->prefix . 'algq_tm_' . $name;
    }

    private static function create_tables() {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();
        $sql = array();
        $sql[] = "CREATE TABLE " . self::table('tenants') . " (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id BIGINT UNSIGNED NULL,
            first_name VARCHAR(120) NOT NULL,
            last_name VARCHAR(120) NOT NULL,
            email VARCHAR(190) NOT NULL,
            phone VARCHAR(80) NULL,
            property_address TEXT NULL,
            application_status VARCHAR(40) NOT NULL DEFAULT 'new',
            created_at DATETIME NOT NULL,
            updated_at DATETIME NULL,
            PRIMARY KEY (id), KEY email (email), KEY status (application_status)
        ) $charset;";
        $sql[] = "CREATE TABLE " . self::table('leases') . " (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            tenant_id BIGINT UNSIGNED NOT NULL,
            property_address TEXT NOT NULL,
            lease_start DATE NULL,
            lease_end DATE NULL,
            rent_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
            security_deposit DECIMAL(12,2) NOT NULL DEFAULT 0,
            status VARCHAR(40) NOT NULL DEFAULT 'draft',
            created_at DATETIME NOT NULL,
            PRIMARY KEY (id), KEY tenant_id (tenant_id), KEY status (status)
        ) $charset;";
        $sql[] = "CREATE TABLE " . self::table('rent_ledger') . " (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            tenant_id BIGINT UNSIGNED NOT NULL,
            lease_id BIGINT UNSIGNED NULL,
            due_date DATE NULL,
            paid_date DATE NULL,
            charge_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
            paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
            balance DECIMAL(12,2) NOT NULL DEFAULT 0,
            status VARCHAR(40) NOT NULL DEFAULT 'due',
            notes TEXT NULL,
            created_at DATETIME NOT NULL,
            PRIMARY KEY (id), KEY tenant_id (tenant_id), KEY status (status)
        ) $charset;";
        $sql[] = "CREATE TABLE " . self::table('maintenance_tickets') . " (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            tenant_id BIGINT UNSIGNED NULL,
            name VARCHAR(190) NOT NULL,
            email VARCHAR(190) NOT NULL,
            property_address TEXT NULL,
            category VARCHAR(80) NULL,
            priority VARCHAR(40) NOT NULL DEFAULT 'normal',
            description LONGTEXT NOT NULL,
            status VARCHAR(40) NOT NULL DEFAULT 'open',
            created_at DATETIME NOT NULL,
            updated_at DATETIME NULL,
            PRIMARY KEY (id), KEY status (status), KEY priority (priority)
        ) $charset;";
        $sql[] = "CREATE TABLE " . self::table('documents') . " (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            tenant_id BIGINT UNSIGNED NULL,
            title VARCHAR(190) NOT NULL,
            document_type VARCHAR(80) NOT NULL,
            file_url TEXT NULL,
            requires_review TINYINT(1) NOT NULL DEFAULT 1,
            created_at DATETIME NOT NULL,
            PRIMARY KEY (id), KEY tenant_id (tenant_id), KEY document_type (document_type)
        ) $charset;";
        $sql[] = "CREATE TABLE " . self::table('notices') . " (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            tenant_id BIGINT UNSIGNED NULL,
            notice_type VARCHAR(80) NOT NULL,
            title VARCHAR(190) NOT NULL,
            body LONGTEXT NULL,
            status VARCHAR(40) NOT NULL DEFAULT 'draft',
            created_at DATETIME NOT NULL,
            PRIMARY KEY (id), KEY tenant_id (tenant_id), KEY notice_type (notice_type)
        ) $charset;";
        $sql[] = "CREATE TABLE " . self::table('inspections') . " (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            tenant_id BIGINT UNSIGNED NULL,
            lease_id BIGINT UNSIGNED NULL,
            inspection_type VARCHAR(40) NOT NULL,
            scheduled_date DATE NULL,
            condition_notes LONGTEXT NULL,
            status VARCHAR(40) NOT NULL DEFAULT 'scheduled',
            created_at DATETIME NOT NULL,
            PRIMARY KEY (id), KEY tenant_id (tenant_id), KEY inspection_type (inspection_type)
        ) $charset;";
        foreach ($sql as $statement) { dbDelta($statement); }
        update_option('algq_tm_version', self::VERSION);
    }

    private static function add_roles_and_caps() {
        add_role('algq_tenant', __('ARE Tenant', 'algq-tenant-management'), array('read' => true));
        $roles = array('administrator', 'editor', 'property_manager');
        foreach ($roles as $role_name) {
            $role = get_role($role_name);
            if ($role) { $role->add_cap(self::CAPABILITY); }
        }
    }

    private static function create_pages() {
        $pages = array(
            'tenants' => array('Tenants', '[algq_tenant_center]'),
            'tenants/apply' => array('Tenant Application', '[algq_tenant_application]'),
            'tenants/pay-rent' => array('Pay Rent', '[algq_rent_payment]'),
            'tenants/maintenance' => array('Maintenance Request', '[algq_maintenance_request]'),
            'tenants/forms' => array('Tenant Forms', '[algq_tenant_forms]'),
            'tenants/portal' => array('Tenant Portal', '[algq_tenant_portal]'),
            'tenants/dashboard' => array('Tenant Dashboard', '[algq_tenant_dashboard]'),
            'tenants/documents' => array('Tenant Documents', '[algq_tenant_documents]'),
            'tenants/lease' => array('Lease Management', '[algq_lease_management]'),
            'tenants/inspection' => array('Move-In / Move-Out Inspection', '[algq_move_in_out_inspection]'),
        );
        foreach ($pages as $path => $page) {
            if (get_page_by_path($path)) { continue; }
            $parent_id = 0;
            if (false !== strpos($path, '/')) {
                $parent_path = dirname($path);
                $parent = get_page_by_path($parent_path);
                if (!$parent && isset($pages[$parent_path])) {
                    $parent_id = wp_insert_post(array('post_title' => $pages[$parent_path][0], 'post_name' => basename($parent_path), 'post_content' => $pages[$parent_path][1], 'post_status' => 'publish', 'post_type' => 'page'));
                } elseif ($parent) {
                    $parent_id = (int) $parent->ID;
                }
            }
            wp_insert_post(array('post_title' => $page[0], 'post_name' => basename($path), 'post_parent' => $parent_id, 'post_content' => $page[1], 'post_status' => 'publish', 'post_type' => 'page'));
        }
    }

    public function register_shortcodes() {
        $map = array(
            'algq_tenant_center' => 'tenant_center', 'algq_tenant_application' => 'tenant_application', 'algq_rent_payment' => 'rent_payment',
            'algq_maintenance_request' => 'maintenance_request', 'algq_tenant_forms' => 'tenant_forms', 'algq_tenant_portal' => 'tenant_dashboard',
            'algq_tenant_dashboard' => 'tenant_dashboard', 'algq_lease_management' => 'lease_management', 'algq_rent_ledger' => 'rent_ledger',
            'algq_maintenance_tickets' => 'maintenance_tickets', 'algq_tenant_documents' => 'tenant_documents', 'algq_move_in_out_inspection' => 'inspection'
        );
        foreach ($map as $tag => $method) { add_shortcode($tag, array($this, $method)); }
    }

    public function enqueue_public_assets() { wp_enqueue_style('algq-tm', plugin_dir_url(__FILE__) . 'assets/css/algq-tenant-management.css', array(), self::VERSION); wp_enqueue_script('algq-tm', plugin_dir_url(__FILE__) . 'assets/js/algq-tenant-management.js', array(), self::VERSION, true); }
    public function enqueue_admin_assets($hook) { if (false !== strpos((string) $hook, 'algq-tenant-management')) { $this->enqueue_public_assets(); } }
    private function can_manage() { return current_user_can(self::CAPABILITY) || current_user_can('manage_options'); }

    public function register_admin_menu() {
        add_menu_page(__('Algonquian Tenant Management', 'algq-tenant-management'), __('ARE Tenants', 'algq-tenant-management'), self::CAPABILITY, 'algq-tenant-management', array($this, 'admin_dashboard'), 'dashicons-building', 26);
    }

    public function admin_dashboard() {
        if (!$this->can_manage()) { wp_die(esc_html__('You do not have permission to access tenant operations.', 'algq-tenant-management')); }
        echo '<div class="wrap algq-tm algq-tm-admin"><h1>' . esc_html__('Algonquian Tenant Management', 'algq-tenant-management') . '</h1>' . $this->admin_dashboard_markup() . '</div>';
    }

    private function kpis() {
        global $wpdb;
        return array(
            __('Tenant Count', 'algq-tenant-management') => (int) $wpdb->get_var('SELECT COUNT(*) FROM ' . self::table('tenants')),
            __('Active Leases', 'algq-tenant-management') => (int) $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM ' . self::table('leases') . ' WHERE status = %s', 'active')),
            __('Rent Due', 'algq-tenant-management') => '$' . number_format((float) $wpdb->get_var($wpdb->prepare('SELECT COALESCE(SUM(balance),0) FROM ' . self::table('rent_ledger') . ' WHERE status IN (%s,%s)', 'due', 'late')), 2),
            __('Open Maintenance', 'algq-tenant-management') => (int) $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM ' . self::table('maintenance_tickets') . ' WHERE status = %s', 'open')),
        );
    }

    private function admin_dashboard_markup() {
        $actions = array(__('View', 'algq-tenant-management'), __('Edit', 'algq-tenant-management'), __('Approve', 'algq-tenant-management'), __('Archive', 'algq-tenant-management'), __('Generate Notice', 'algq-tenant-management'), __('Record Payment', 'algq-tenant-management'));
        ob_start(); ?>
        <section class="algq-hero"><p><?php echo esc_html__('Institutional tenant operations for Algonquian Real Estate, LLC.', 'algq-tenant-management'); ?></p></section>
        <section class="algq-kpis"><?php foreach ($this->kpis() as $label => $value) : ?><article><span><?php echo esc_html($label); ?></span><strong><?php echo esc_html($value); ?></strong></article><?php endforeach; ?></section>
        <section class="algq-grid">
            <?php foreach (array('Recent Applications', 'Active Tenants', 'Maintenance Tickets', 'Rent Ledger', 'Notices', 'Document Vault') as $title) : ?>
                <article class="algq-card"><h2><?php echo esc_html__($title, 'algq-tenant-management'); ?></h2><?php echo $this->placeholder_table($title, $actions); ?></article>
            <?php endforeach; ?>
        </section><?php return ob_get_clean();
    }

    private function placeholder_table($context, $actions) {
        ob_start(); ?><table class="algq-table"><thead><tr><th><?php esc_html_e('Record', 'algq-tenant-management'); ?></th><th><?php esc_html_e('Status', 'algq-tenant-management'); ?></th><th><?php esc_html_e('Actions', 'algq-tenant-management'); ?></th></tr></thead><tbody><tr><td><?php echo esc_html($context); ?></td><td><?php esc_html_e('Ready', 'algq-tenant-management'); ?></td><td><?php foreach ($actions as $action) : ?><button type="button"><?php echo esc_html($action); ?></button> <?php endforeach; ?></td></tr></tbody></table><?php return ob_get_clean();
    }

    public function tenant_center() { return '<div class="algq-tm"><h2>' . esc_html__('Tenant Center', 'algq-tenant-management') . '</h2>' . $this->portal_links() . '</div>'; }
    private function portal_links() { $links = array('/tenants/apply'=>'Apply','/tenants/pay-rent'=>'Pay Rent','/tenants/maintenance'=>'Maintenance','/tenants/forms'=>'Forms','/tenants/portal'=>'Portal','/tenants/documents'=>'Documents','/tenants/lease'=>'Lease','/tenants/inspection'=>'Inspection'); $out='<div class="algq-actions">'; foreach($links as $url=>$label){$out.='<a href="'.esc_url(home_url($url)).'">'.esc_html($label).'</a>'; } return $out.'</div>'; }
    public function tenant_dashboard() { ob_start(); ?><div class="algq-tm algq-portal"><h2><?php esc_html_e('Tenant Portal Dashboard', 'algq-tenant-management'); ?></h2><div class="algq-grid"><section class="algq-card"><h3><?php esc_html_e('Lease Summary', 'algq-tenant-management'); ?></h3><p><?php esc_html_e('View current lease terms and renewal milestones.', 'algq-tenant-management'); ?></p></section><section class="algq-card"><h3><?php esc_html_e('Rent Balance', 'algq-tenant-management'); ?></h3><p>$0.00</p><a class="algq-button" href="<?php echo esc_url(home_url('/tenants/pay-rent')); ?>"><?php esc_html_e('Payment Placeholder', 'algq-tenant-management'); ?></a></section><section class="algq-card"><h3><?php esc_html_e('Maintenance', 'algq-tenant-management'); ?></h3><?php echo $this->maintenance_request(); ?></section><section class="algq-card"><h3><?php esc_html_e('Documents & Notices', 'algq-tenant-management'); ?></h3><?php echo $this->tenant_documents(); ?><p><?php esc_html_e('Review notices from property management.', 'algq-tenant-management'); ?></p></section><section class="algq-card"><h3><?php esc_html_e('Inspections', 'algq-tenant-management'); ?></h3><?php echo $this->inspection(); ?></section><section class="algq-card"><h3><?php esc_html_e('Contact Property Management', 'algq-tenant-management'); ?></h3><p><?php esc_html_e('Algonquian Real Estate, LLC property management team.', 'algq-tenant-management'); ?></p></section></div></div><?php return ob_get_clean(); }
    public function tenant_application() { return $this->form('algq_tm_save_application', __('Tenant Application', 'algq-tenant-management'), array('first_name','last_name','email','phone','property_address')); }
    public function maintenance_request() { return $this->form('algq_tm_save_maintenance', __('Maintenance Request', 'algq-tenant-management'), array('name','email','property_address','category','description')); }
    private function form($action, $title, $fields) { ob_start(); ?><form class="algq-form" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>"><h3><?php echo esc_html($title); ?></h3><input type="hidden" name="action" value="<?php echo esc_attr($action); ?>"><?php wp_nonce_field($action, '_algq_nonce'); ?><?php foreach ($fields as $field) : ?><label><?php echo esc_html(ucwords(str_replace('_', ' ', $field))); ?><?php if ('description' === $field) : ?><textarea name="<?php echo esc_attr($field); ?>"></textarea><?php else : ?><input name="<?php echo esc_attr($field); ?>" type="text"><?php endif; ?></label><?php endforeach; ?><button class="algq-button" type="submit"><?php esc_html_e('Submit Securely', 'algq-tenant-management'); ?></button></form><?php return ob_get_clean(); }
    public function rent_payment() { return '<div class="algq-tm algq-card"><h2>' . esc_html__('Online Payments Integration', 'algq-tenant-management') . '</h2><p>' . esc_html__('Payment processor connection placeholder. Configure an approved provider before collecting payments.', 'algq-tenant-management') . '</p></div>'; }
    public function tenant_forms() { $forms = array('Tenant application','Income verification','Residential lease','Security deposit handling','Maintenance request','Late notice','Lease renewal notice','Non-renewal notice','Move-in/move-out inspection'); $out='<div class="algq-tm algq-card"><h2>'.esc_html__('Connecticut Compliance Form Templates', 'algq-tenant-management').'</h2><p>'.esc_html__('Templates require review before use and are not legal advice.', 'algq-tenant-management').'</p><ul>'; foreach($forms as $form){$out.='<li>'.esc_html($form).' — '.esc_html__('template requiring review', 'algq-tenant-management').'</li>'; } return $out.'</ul></div>'; }
    public function lease_management() { return '<div class="algq-tm algq-card"><h2>' . esc_html__('Lease Management', 'algq-tenant-management') . '</h2><p>' . esc_html__('Track lease dates, rent, deposits, renewals, and tenant records.', 'algq-tenant-management') . '</p></div>'; }
    public function rent_ledger() { return '<div class="algq-tm algq-card"><h2>' . esc_html__('Rent Ledger', 'algq-tenant-management') . '</h2><p>' . esc_html__('Charges, payments, balances, late status, and notes.', 'algq-tenant-management') . '</p></div>'; }
    public function maintenance_tickets() { return '<div class="algq-tm algq-card"><h2>' . esc_html__('Maintenance Tickets', 'algq-tenant-management') . '</h2><p>' . esc_html__('Open, prioritize, update, and archive property maintenance requests.', 'algq-tenant-management') . '</p></div>'; }
    public function tenant_documents() { return '<div class="algq-documents"><p>' . esc_html__('Document Vault: lease packets, notices, inspection PDFs, and compliance templates appear here after upload.', 'algq-tenant-management') . '</p></div>'; }
    public function inspection() { return '<div class="algq-inspection"><p>' . esc_html__('Access move-in and move-out inspection checklists and condition documentation.', 'algq-tenant-management') . '</p></div>'; }

    public function handle_application() {
        if (!isset($_POST['_algq_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_algq_nonce'])), 'algq_tm_save_application')) { wp_die(esc_html__('Security check failed.', 'algq-tenant-management')); }
        global $wpdb;
        $wpdb->insert(self::table('tenants'), array('first_name'=>sanitize_text_field(wp_unslash($_POST['first_name'] ?? '')), 'last_name'=>sanitize_text_field(wp_unslash($_POST['last_name'] ?? '')), 'email'=>sanitize_email(wp_unslash($_POST['email'] ?? '')), 'phone'=>sanitize_text_field(wp_unslash($_POST['phone'] ?? '')), 'property_address'=>sanitize_textarea_field(wp_unslash($_POST['property_address'] ?? '')), 'created_at'=>current_time('mysql')), array('%s','%s','%s','%s','%s','%s'));
        wp_safe_redirect(add_query_arg('algq_tm', 'application-received', wp_get_referer() ?: home_url('/tenants'))); exit;
    }
    public function handle_maintenance() {
        if (!isset($_POST['_algq_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_algq_nonce'])), 'algq_tm_save_maintenance')) { wp_die(esc_html__('Security check failed.', 'algq-tenant-management')); }
        global $wpdb;
        $wpdb->insert(self::table('maintenance_tickets'), array('name'=>sanitize_text_field(wp_unslash($_POST['name'] ?? '')), 'email'=>sanitize_email(wp_unslash($_POST['email'] ?? '')), 'property_address'=>sanitize_textarea_field(wp_unslash($_POST['property_address'] ?? '')), 'category'=>sanitize_text_field(wp_unslash($_POST['category'] ?? '')), 'description'=>sanitize_textarea_field(wp_unslash($_POST['description'] ?? '')), 'created_at'=>current_time('mysql')), array('%s','%s','%s','%s','%s','%s'));
        wp_safe_redirect(add_query_arg('algq_tm', 'maintenance-received', wp_get_referer() ?: home_url('/tenants/maintenance'))); exit;
    }
}

register_activation_hook(__FILE__, array('ALGQ_Tenant_Management', 'activate'));
register_deactivation_hook(__FILE__, array('ALGQ_Tenant_Management', 'deactivate'));
ALGQ_Tenant_Management::instance();
