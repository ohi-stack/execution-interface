<?php
/**
 * Admin UI for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Admin
{
    private ALGQ_Deal_Marketplace_Renderer $renderer;
    private ALGQ_Deal_Marketplace_Security $security;
    private ALGQ_Deal_Marketplace_Cache $cache;

    public function __construct(ALGQ_Deal_Marketplace_Renderer $renderer, ALGQ_Deal_Marketplace_Security $security, ALGQ_Deal_Marketplace_Cache $cache)
    {
        $this->renderer = $renderer;
        $this->security = $security;
        $this->cache = $cache;
    }

    public function register_hooks(): void
    {
        if (!is_admin()) {
            return;
        }

        add_action('admin_menu', [$this, 'register_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_post_algq_deal_marketplace_clear_cache', [$this, 'handle_clear_cache']);
    }

    public function register_menu(): void
    {
        add_menu_page(
            __('Deal Marketplace', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN),
            __('Deal Marketplace', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN),
            'algq_manage_deal_marketplace',
            'algq-deal-marketplace',
            [$this, 'render_page'],
            'dashicons-store',
            57
        );
    }

    public function register_settings(): void
    {
        register_setting('algq_deal_marketplace', 'algq_deal_marketplace_options', [
            'type' => 'array',
            'sanitize_callback' => [$this, 'sanitize_options'],
            'default' => [
                'access_mode' => 'private',
                'caching_enabled' => '1',
                'default_cache_ttl' => (string) ALGQ_Deal_Marketplace_Cache::TTL_LISTINGS,
                'delete_data_on_uninstall' => '0',
            ],
        ]);
    }

    /**
     * @param mixed $options
     * @return array<string, string>
     */
    public function sanitize_options($options): array
    {
        $existing = function_exists('get_option') ? get_option('algq_deal_marketplace_options', []) : [];
        $existing = is_array($existing) ? $existing : [];

        if (!is_array($options)) {
            $options = [];
        }

        $ttl = absint($options['default_cache_ttl'] ?? $existing['default_cache_ttl'] ?? ALGQ_Deal_Marketplace_Cache::TTL_LISTINGS);

        if ($ttl < 30) {
            $ttl = 30;
        }

        if ($ttl > DAY_IN_SECONDS) {
            $ttl = DAY_IN_SECONDS;
        }

        return [
            'access_mode' => $this->security->sanitize_allowed($options['access_mode'] ?? '', ['private', 'members', 'public'], 'private'),
            'cleanup_on_uninstall' => !empty($options['cleanup_on_uninstall']) ? '1' : '0',
            'access_mode' => $this->security->sanitize_allowed($options['access_mode'] ?? $existing['access_mode'] ?? '', ['private', 'members', 'public'], 'private'),
            'caching_enabled' => !empty($options['caching_enabled']) ? '1' : '0',
            'default_cache_ttl' => (string) $ttl,
            'delete_data_on_uninstall' => !empty($options['delete_data_on_uninstall']) ? '1' : '0',
        ];
    }

    public function handle_clear_cache(): void
    {
        if (!$this->security->can_manage()) {
            wp_die(esc_html__('You do not have permission to clear marketplace cache.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN));
        }

        check_admin_referer(ALGQ_Deal_Marketplace_Security::NONCE_ACTION, ALGQ_Deal_Marketplace_Security::NONCE_NAME);

        $this->cache->flush_marketplace();

        wp_safe_redirect(add_query_arg(
            [
                'page' => 'algq-deal-marketplace',
                'algq_cache_cleared' => '1',
            ],
            admin_url('admin.php')
        ));
            wp_die(esc_html__('You do not have permission to clear marketplace cache.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN), '', ['response' => 403]);
        }

        check_admin_referer('algq_deal_marketplace_clear_cache');
        $this->cache->flush_marketplace();

        wp_safe_redirect(add_query_arg('algq_deal_marketplace_cache_cleared', '1', wp_get_referer() ?: admin_url('admin.php?page=algq-deal-marketplace')));
        $this->cache->flush_group();

        wp_safe_redirect(add_query_arg('algq_cache_cleared', '1', wp_get_referer() ?: admin_url('admin.php?page=algq-deal-marketplace')));
        exit;
    }

    public function render_page(): void
    {
        if (!$this->security->can_manage()) {
            wp_die(esc_html__('You do not have permission to manage the deal marketplace.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN));
        }

        if (isset($_GET['algq_cache_cleared'])) {
            echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('Marketplace cache cleared.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN) . '</p></div>';
        }

        $this->renderer->render_admin_page();
        $this->render_cache_settings();
    }

    private function render_cache_settings(): void
    {
        $options = get_option('algq_deal_marketplace_options', []);
        $options = is_array($options) ? $options : [];
        $enabled = !isset($options['caching_enabled']) || '0' !== (string) $options['caching_enabled'];
        $ttl = absint($options['default_cache_ttl'] ?? ALGQ_Deal_Marketplace_Cache::TTL_LISTINGS);
        ?>
        <div class="wrap algq-marketplace-cache-settings">
            <h2><?php echo esc_html__('Marketplace cache settings', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></h2>
            <form method="post" action="options.php">
                <?php settings_fields('algq_deal_marketplace'); ?>
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row"><?php echo esc_html__('Enable caching', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></th>
                        <td>
                            <label>
                                <input type="checkbox" name="algq_deal_marketplace_options[caching_enabled]" value="1" <?php checked($enabled); ?> />
                                <?php echo esc_html__('Cache marketplace listings, dashboards, NDA status, settings, and summary metrics.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="algq-default-cache-ttl"><?php echo esc_html__('Default cache TTL', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></label></th>
                        <td>
                            <input id="algq-default-cache-ttl" type="number" min="30" max="86400" step="30" name="algq_deal_marketplace_options[default_cache_ttl]" value="<?php echo esc_attr((string) $ttl); ?>" />
                            <p class="description"><?php echo esc_html__('Time to keep listing cache entries, in seconds. Dashboard summaries use 120 seconds, settings use 1800 seconds, and NDA status uses 600 seconds.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><?php echo esc_html__('Uninstall behavior', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></th>
                        <td>
                            <label>
                                <input type="checkbox" name="algq_deal_marketplace_options[delete_data_on_uninstall]" value="1" <?php checked(!empty($options['delete_data_on_uninstall']) && '1' === (string) $options['delete_data_on_uninstall']); ?> />
                                <?php echo esc_html__('Delete marketplace tables and generated options during uninstall. Leave unchecked for non-destructive release-safe uninstalls.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?>
                            </label>
                        </td>
                    </tr>
                </table>
                <?php submit_button(__('Save cache settings', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN)); ?>
            </form>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="algq_deal_marketplace_clear_cache" />
                <?php wp_nonce_field('algq_deal_marketplace_clear_cache'); ?>
                <?php submit_button(__('Clear Marketplace Cache', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN), 'secondary'); ?>
            </form>
        </div>
        <?php
    }
}
