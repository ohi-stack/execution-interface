const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const plugin = (slug, file = `${slug}.php`) => fs.readFileSync(path.join(root, 'plugins', slug, file), 'utf8');
const readme = (slug) => fs.readFileSync(path.join(root, 'plugins', slug, 'README.md'), 'utf8');

const expectations = [
  ['algq-offer-generator', 'algq-offer-generator.php', [/algq_offer_versions/, /purchase_agreement/, /seller_financing/, /render_template/, /merge_fields/, /\/offers/]],
  ['algq-buyer-portal', 'algq-buyer-portal.php', [/algq_buyer_deal_packages/, /algq_buyer_interest/, /NDA/, /Submit Interest/, /\/buyer\/packages/]],
  ['algq-funding-tracker', 'algq-funding-tracker.php', [/algq_lenders/, /algq_capital_commitments/, /algq_deal_lender_map/, /algq_lender_relationships/, /\/funding\/status/]],
  ['algq-automation-engine', 'algq-automation-engine.php', [/algq_automation_rules/, /algq_automation_runs/, /send_email/, /generate_document/, /closeout_workflow/]],
  ['algq-pdf-signature', 'algq-pdf-signature.php', [/algq_documents/, /algq_signature_requests/, /request_signature/, /execution_status/, /\/signatures\/request/]],
  ['algq-document-library', 'algq-document-library.php', [/entity_documents/, /lender_documents/, /acquisition_forms/, /financial_controls/, /risk_management/, /property_management_forms/]],
  ['algq-command-center', 'algq-command-center.php', [/pipeline_value/, /deal_counts/, /funding_status_items/, /buyer_activity/, /\/command-center\/report/]],
  ['algq-digital-products', 'algq-digital-products.php', [/algq_plugin_licenses/, /algq_protected_downloads/, /Stripe/, /woocommerce_product_data_tabs/, /subscription_tier/]],
  ['algq-are-marketplace', 'algq-are-marketplace.php', [/algq_marketplace_listings/, /algq_investor_access/, /algq_deal_syndication/, /algq_premium_listings/, /\/marketplace\/listings/]],
];

for (const [slug, file, patterns] of expectations) {
  const source = plugin(slug, file);
  for (const pattern of patterns) {
    assert.match(source, pattern, `${slug} must include ${pattern}`);
  }
  assert.doesNotMatch(readme(slug), /Planned v\d/i, `${slug} README must not describe the module as planned`);
}

const catalog = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
assert.match(catalog, /algq-are-marketplace/, 'catalog must include ARE Marketplace');
assert.match(catalog, /algq-digital-products/, 'catalog must include monetization module');
assert.doesNotMatch(catalog, /\| Planned \|/, 'catalog must not mark production task modules as planned');

console.log('production module structure passed');
