<?php
/**
 * Plugin Name: Algonquian Document Library
 * Description: Institutional document library aligned to entity, lender, acquisition, financial controls, risk management, and property management categories.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Document_Library
{
    private const POST_TYPE = 'algq_document';
    private const TAXONOMY = 'algq_doc_category';

    private const CATEGORIES = [
        'entity-documents' => [
            'label' => 'Entity documents',
            'description' => 'Formation records, operating agreements, governance resolutions, EIN letters, registered-agent records, and entity compliance files.',
        ],
        'lender-documents' => [
            'label' => 'Lender documents',
            'description' => 'Term sheets, proof-of-funds letters, commitment letters, loan packages, draw schedules, lender requirements, and funding correspondence.',
        ],
        'acquisition-forms' => [
            'label' => 'Acquisition forms',
            'description' => 'LOIs, purchase agreements, seller disclosures, due-diligence checklists, assignment contracts, and closing intake forms.',
        ],
        'financial-controls' => [
            'label' => 'Financial controls',
            'description' => 'Approval matrices, wire instructions, budget controls, payment logs, reconciliation checklists, and audit-support records.',
        ],
        'risk-management' => [
            'label' => 'Risk management',
            'description' => 'Insurance binders, risk reviews, compliance notes, inspection exceptions, mitigation plans, and legal review artifacts.',
        ],
        'property-management-forms' => [
            'label' => 'Property management forms',
            'description' => 'Tenant forms, maintenance requests, vendor onboarding, lease administration, inspection reports, and turnover checklists.',
        ],
    ];

    public function __construct()
    {
        add_action('init', [$this, 'register_content_types']);
        add_shortcode('algq_document_library', [$this, 'render_library']);
    }

    public static function activate(): void
    {
        $plugin = new self();
        $plugin->register_content_types();
        $plugin->seed_categories();
        flush_rewrite_rules();
    }

    public static function deactivate(): void
    {
        flush_rewrite_rules();
    }

    public function register_content_types(): void
    {
        register_post_type(self::POST_TYPE, [
            'labels' => [
                'name' => 'Documents',
                'singular_name' => 'Document',
                'add_new_item' => 'Add New Document',
                'edit_item' => 'Edit Document',
                'view_item' => 'View Document',
                'search_items' => 'Search Documents',
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'menu_icon' => 'dashicons-media-document',
            'supports' => ['title', 'editor', 'author', 'custom-fields', 'revisions'],
            'capability_type' => 'post',
            'has_archive' => false,
            'rewrite' => false,
        ]);

        register_taxonomy(self::TAXONOMY, [self::POST_TYPE], [
            'labels' => [
                'name' => 'Document Categories',
                'singular_name' => 'Document Category',
                'search_items' => 'Search Document Categories',
                'all_items' => 'All Document Categories',
                'edit_item' => 'Edit Document Category',
                'update_item' => 'Update Document Category',
                'add_new_item' => 'Add New Document Category',
                'new_item_name' => 'New Document Category',
            ],
            'hierarchical' => true,
            'public' => false,
            'show_ui' => true,
            'show_admin_column' => true,
            'show_in_rest' => true,
            'rewrite' => false,
        ]);
    }

    public function render_library(): string
    {
        $this->seed_categories();

        ob_start();
        echo '<div class="algq-document-library">';
        echo '<h2>Institutional Document Library</h2>';
        echo '<p>Organize operating records, deal files, controls, and property forms under the Algonquian institutional documentation categories.</p>';

        foreach (self::CATEGORIES as $slug => $category) {
            $this->render_category_section($slug, $category['label'], $category['description']);
        }

        echo '</div>';
        return (string) ob_get_clean();
    }

    private function seed_categories(): void
    {
        foreach (self::CATEGORIES as $slug => $category) {
            if (!term_exists($slug, self::TAXONOMY)) {
                wp_insert_term($category['label'], self::TAXONOMY, [
                    'slug' => $slug,
                    'description' => $category['description'],
                ]);
            }
        }
    }

    private function render_category_section(string $slug, string $label, string $description): void
    {
        $documents = new WP_Query([
            'post_type' => self::POST_TYPE,
            'post_status' => 'publish',
            'posts_per_page' => 5,
            'orderby' => 'modified',
            'order' => 'DESC',
            'tax_query' => [
                [
                    'taxonomy' => self::TAXONOMY,
                    'field' => 'slug',
                    'terms' => $slug,
                ],
            ],
        ]);

        echo '<section class="algq-document-category algq-document-category-' . esc_attr($slug) . '">';
        echo '<h3>' . esc_html($label) . '</h3>';
        echo '<p>' . esc_html($description) . '</p>';

        if ($documents->have_posts()) {
            echo '<ul>';
            while ($documents->have_posts()) {
                $documents->the_post();
                echo '<li><strong>' . esc_html(get_the_title()) . '</strong><br><span>Last updated ' . esc_html(get_the_modified_date()) . '</span></li>';
            }
            echo '</ul>';
            wp_reset_postdata();
        } else {
            echo '<p><em>No documents published in this category yet.</em></p>';
        }

        echo '</section>';
    }
}

register_activation_hook(__FILE__, ['ALGQ_Document_Library', 'activate']);
register_deactivation_hook(__FILE__, ['ALGQ_Document_Library', 'deactivate']);
new ALGQ_Document_Library();
