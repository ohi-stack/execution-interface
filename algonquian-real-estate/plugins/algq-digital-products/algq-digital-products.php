<?php
/**
 * Plugin Name: Algonquian Digital Products
 * Description: Product library dashboard for contract packs, spreadsheets, calculators, checklists, training, and plugin-library access cards.
 * Version: 0.2.0
 * Author: Algonquian Real Estate
 * Requires Plugins: algq-core
 * Text Domain: algq-digital-products
 */

if (!defined('ABSPATH')) {
    exit;
}


function algq_digital_products_core_available(): bool
{
    if (function_exists('algq_core')) {
        return true;
    }

    add_action('admin_notices', static function (): void {
        echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian Digital Products requires the Algonquian Core plugin to be active.', 'algq-digital-products') . '</p></div>';
    });

    return false;
}

add_action('plugins_loaded', static function (): void {
    if (!algq_digital_products_core_available()) {
        return;
    }

    add_shortcode('algq_product_library', function (): string {
        $products = ['Contract Packs', 'Spreadsheets', 'Calculators', 'Checklists', 'Training'];
        ob_start();
        echo '<div class="algq-product-library"><h2>Product Library</h2><ul>';
        foreach ($products as $product) {
            echo '<li><strong>' . esc_html($product) . '</strong><br><span>WooCommerce secure download, license tracking, and access-control hooks ready for integration.</span></li>';
        }
        echo '</ul></div>';
        return (string) ob_get_clean();
    });
});
final class ALGQ_Digital_Products
{
    /**
     * @return array<int,array<string,string>>
     */
    private function library_items(): array
    {
        return [
            ['title' => 'Contract Packs', 'type' => 'Document Pack', 'status' => 'WooCommerce gated', 'description' => 'Purchase, assignment, seller-financing, and due-diligence contract bundles.'],
            ['title' => 'Spreadsheets', 'type' => 'Financial Tools', 'status' => 'License tracked', 'description' => 'Acquisition models, rehab budgets, cash-flow sheets, and capital tracking workbooks.'],
            ['title' => 'Calculators', 'type' => 'Interactive Tool', 'status' => 'Member access', 'description' => 'MAO, amortization, seller income, and offer comparison calculators.'],
            ['title' => 'Checklists', 'type' => 'Operations', 'status' => 'Download ready', 'description' => 'Closing, inspection, lender, onboarding, and asset-management checklists.'],
            ['title' => 'Training', 'type' => 'Education', 'status' => 'Course mapped', 'description' => 'Wholesale, underwriting, creative finance, buyer management, and automation modules.'],
        ];
    }

    public function register(): void
    {
        add_shortcode('algq_product_library', [$this, 'render_product_library']);
        add_shortcode('algq_plugin_library', [$this, 'render_plugin_library']);
    }

    public function render_product_library(): string
    {
        ob_start();
        $this->render_styles();
        ?>
        <section class="algq-library-ui" aria-label="<?php esc_attr_e('Product Library', 'algq-digital-products'); ?>">
            <div class="algq-library-hero">
                <p><?php esc_html_e('Plugin Library UI', 'algq-digital-products'); ?></p>
                <h2><?php esc_html_e('Product Library', 'algq-digital-products'); ?></h2>
                <span><?php esc_html_e('WooCommerce downloads, licensing, and access-control hooks are ready for integration.', 'algq-digital-products'); ?></span>
            </div>
            <div class="algq-library-grid">
                <?php foreach ($this->library_items() as $item) : ?>
                    <article class="algq-library-card">
                        <span><?php echo esc_html($item['type']); ?></span>
                        <h3><?php echo esc_html($item['title']); ?></h3>
                        <p><?php echo esc_html($item['description']); ?></p>
                        <strong><?php echo esc_html($item['status']); ?></strong>
                    </article>
                <?php endforeach; ?>
            </div>
        </section>
        <?php
        return (string) ob_get_clean();
    }

    public function render_plugin_library(): string
    {
        $plugins = [
            ['name' => 'Deal Intake', 'shortcode' => '[algq_deal_intake]', 'status' => 'Lead capture'],
            ['name' => 'MAO Engine', 'shortcode' => '[algq_mao_engine]', 'status' => 'Underwriting'],
            ['name' => 'Offer Generator', 'shortcode' => '[algq_offer_generator]', 'status' => 'Documents + PDF'],
            ['name' => 'PDF & Signature', 'shortcode' => '[algq_signature]', 'status' => 'Execution'],
            ['name' => 'Command Center', 'shortcode' => '[algq_command_center]', 'status' => 'Metrics'],
            ['name' => 'Marketplace', 'shortcode' => '[algq_marketplace]', 'status' => 'Distribution'],
        ];

        ob_start();
        $this->render_styles();
        ?>
        <section class="algq-library-ui algq-plugin-library" aria-label="<?php esc_attr_e('Plugin Library', 'algq-digital-products'); ?>">
            <div class="algq-library-hero">
                <p><?php esc_html_e('Module Launcher', 'algq-digital-products'); ?></p>
                <h2><?php esc_html_e('Plugin Library', 'algq-digital-products'); ?></h2>
                <span><?php esc_html_e('Central UI for shortcode discovery, module status, and operator handoff.', 'algq-digital-products'); ?></span>
            </div>
            <div class="algq-library-grid">
                <?php foreach ($plugins as $plugin) : ?>
                    <article class="algq-library-card">
                        <span><?php echo esc_html($plugin['status']); ?></span>
                        <h3><?php echo esc_html($plugin['name']); ?></h3>
                        <code><?php echo esc_html($plugin['shortcode']); ?></code>
                    </article>
                <?php endforeach; ?>
            </div>
        </section>
        <?php
        return (string) ob_get_clean();
    }

    private function render_styles(): void
    {
        ?>
        <style>
            .algq-library-ui{border:1px solid #d7c9a5;border-radius:22px;padding:24px;background:#fffdf7;color:#1f2937}.algq-library-hero{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:12px;margin-bottom:18px}.algq-library-hero p{margin:0;text-transform:uppercase;letter-spacing:.16em;font-size:12px;color:#8a6b1f}.algq-library-hero h2{margin:0;font-size:30px}.algq-library-hero span{max-width:440px}.algq-library-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px}.algq-library-card{border:1px solid #eadfbd;border-radius:18px;padding:18px;background:#fff}.algq-library-card span{font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#7c5d14}.algq-library-card h3{margin:.35rem 0}.algq-library-card strong,.algq-library-card code{display:inline-block;margin-top:10px;border-radius:999px;background:#f7ecd0;padding:6px 10px;color:#5d420d}
        </style>
        <?php
    }
}

(new ALGQ_Digital_Products())->register();
