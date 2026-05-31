const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pluginDir = path.join(root, 'plugins', 'algq-pipeline-crm');
const pluginFile = fs.readFileSync(path.join(pluginDir, 'algq-pipeline-crm.php'), 'utf8');
const readme = fs.readFileSync(path.join(pluginDir, 'README.md'), 'utf8');
const clientScript = fs.readFileSync(path.join(pluginDir, 'assets', 'js', 'pipeline-crm.js'), 'utf8');
const stylesheet = fs.readFileSync(path.join(pluginDir, 'assets', 'css', 'pipeline-crm.css'), 'utf8');

assert.match(pluginFile, /add_shortcode\('algq_pipeline_crm'/, 'pipeline shortcode must be registered');
assert.match(pluginFile, /algq_pipeline_deals/, 'pipeline table must persist stage and assignment state');
assert.match(pluginFile, /algq_pipeline_activity/, 'activity table must persist audit history');
assert.match(pluginFile, /algq_pipeline_notes/, 'notes table must persist deal notes');
assert.match(pluginFile, /wp_ajax_algq_pipeline_move_deal/, 'AJAX stage movement must be registered');
assert.match(pluginFile, /wp_ajax_algq_pipeline_add_note/, 'AJAX note capture must be registered');
assert.match(pluginFile, /wp_ajax_algq_pipeline_assign_deal/, 'AJAX assignment updates must be registered');
assert.match(pluginFile, /register_rest_route\('algq\/v1', '\/pipeline'/, 'REST pipeline listing route must be registered');
assert.match(clientScript, /dragstart/, 'client script must support drag start');
assert.match(clientScript, /algq_pipeline_move_deal/, 'client script must post stage moves');
assert.match(stylesheet, /\.algq-kanban/, 'stylesheet must define Kanban layout');
assert.match(readme, /\[algq_pipeline_crm\]/, 'README must document the shortcode');
assert.match(readme, /Activity logging/, 'README must document activity logging');

console.log('pipeline CRM structure passed');
