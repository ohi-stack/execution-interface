const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pluginFile = fs.readFileSync(path.join(root, 'plugin', 'algq-offer-generator.php'), 'utf8');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const template = fs.readFileSync(path.join(root, 'plugin', 'templates', 'offer-generator.php'), 'utf8');

assert.match(pluginFile, /add_shortcode\(\s*'algq_offer_generator'/, 'shortcode must be registered');
assert.match(template, /data-algq-offer-generator/, 'template must render the Offer Generator interface');
assert.match(readme, /\[algq_offer_generator\]/, 'README must document the shortcode');
assert.match(readme, /\[vc_column_text\]\s*\n\[algq_offer_generator\]\s*\n\[\/vc_column_text\]/, 'README must show valid WPBakery usage');
assert.doesNotMatch(readme, /\[\/vc_column\]/, 'README must not use invalid WPBakery closing tags');

console.log('offer generator shortcode structure passed');
