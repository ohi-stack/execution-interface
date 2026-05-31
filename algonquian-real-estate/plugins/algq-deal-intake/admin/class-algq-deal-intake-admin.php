<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Intake_Admin
{
    private ALGQ_Deal_Intake_Repository $repository;
    private ALGQ_Deal_Intake_CSV $csv;

    public function __construct(ALGQ_Deal_Intake_Repository $repository, ALGQ_Deal_Intake_CSV $csv)
    {
        $this->repository = $repository;
        $this->csv = $csv;
    }

    public function register(): void
    {
        add_action('admin_menu', [$this, 'register_admin_page']);
        add_action('admin_post_algq_deal_export', [$this->csv, 'export']);
        add_action('admin_post_algq_deal_import', [$this, 'handle_import']);
    }

    public function register_admin_page(): void
    {
        add_menu_page('Algonquian Deals', 'Algonquian Deals', 'manage_options', 'algq-deals', [$this, 'render_admin_page'], 'dashicons-building', 26);
    }

    public function handle_import(): void
    {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('Insufficient permissions.', 'algq-deal-intake'));
        }
        check_admin_referer('algq_deal_import');
        $result = $this->csv->import($_FILES['algq_deal_csv'] ?? []);
        set_transient('algq_deal_import_result_' . get_current_user_id(), $result, 60);
        wp_safe_redirect(admin_url('admin.php?page=algq-deals'));
        exit;
    }

    public function render_admin_page(): void
    {
        $result = get_transient('algq_deal_import_result_' . get_current_user_id());
        delete_transient('algq_deal_import_result_' . get_current_user_id());
        $rows = $this->repository->all(100);
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Algonquian Deal Intake', 'algq-deal-intake'); ?></h1>
            <?php if (is_array($result)) : ?>
                <div class="notice notice-info"><p><?php echo esc_html(sprintf('Imported %d deals.', (int) $result['imported'])); ?></p></div>
                <?php if (!empty($result['errors'])) : ?><div class="notice notice-warning"><p><?php echo esc_html(implode(' ', $result['errors'])); ?></p></div><?php endif; ?>
            <?php endif; ?>

            <h2><?php esc_html_e('CSV Workflows', 'algq-deal-intake'); ?></h2>
            <p><a class="button button-primary" href="<?php echo esc_url(wp_nonce_url(admin_url('admin-post.php?action=algq_deal_export'), 'algq_deal_export')); ?>"><?php esc_html_e('Export CSV', 'algq-deal-intake'); ?></a></p>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" enctype="multipart/form-data">
                <?php wp_nonce_field('algq_deal_import'); ?>
                <input type="hidden" name="action" value="algq_deal_import" />
                <input type="file" name="algq_deal_csv" accept=".csv,text/csv" required />
                <button class="button" type="submit"><?php esc_html_e('Import CSV', 'algq-deal-intake'); ?></button>
            </form>

            <h2><?php esc_html_e('Recent Deals', 'algq-deal-intake'); ?></h2>
            <table class="widefat striped">
                <thead><tr><th><?php esc_html_e('Deal ID', 'algq-deal-intake'); ?></th><th><?php esc_html_e('Seller', 'algq-deal-intake'); ?></th><th><?php esc_html_e('Phone', 'algq-deal-intake'); ?></th><th><?php esc_html_e('Address', 'algq-deal-intake'); ?></th><th><?php esc_html_e('Source', 'algq-deal-intake'); ?></th><th><?php esc_html_e('Campaign', 'algq-deal-intake'); ?></th><th><?php esc_html_e('Score', 'algq-deal-intake'); ?></th><th><?php esc_html_e('Tags', 'algq-deal-intake'); ?></th><th><?php esc_html_e('Status', 'algq-deal-intake'); ?></th><th><?php esc_html_e('Created', 'algq-deal-intake'); ?></th></tr></thead>
                <tbody>
                <?php foreach ($rows as $row) : ?>
                    <tr>
                        <td><?php echo esc_html($row['deal_id']); ?></td>
                        <td><?php echo esc_html($row['seller_name']); ?></td>
                        <td><?php echo esc_html($row['seller_phone']); ?></td>
                        <td><?php echo esc_html($row['address']); ?></td>
                        <td><?php echo esc_html($row['lead_source']); ?></td>
                        <td><?php echo esc_html($row['source_campaign'] ?? ''); ?></td>
                        <td><?php echo esc_html((string) $row['motivation_score']); ?></td>
                        <td><?php echo esc_html(implode(', ', $row['property_tags'])); ?></td>
                        <td><?php echo esc_html($row['status']); ?></td>
                        <td><?php echo esc_html($row['created_at']); ?></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
    }
}
