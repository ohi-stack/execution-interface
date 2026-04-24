<?php
/**
 * Lead form.
 *
 * @package enterprise-theme-v1-1
 */
?>
<form id="og-lead-form" class="og-card" method="post">
	<label><?php esc_html_e( 'Name', 'enterprise-theme-v1-1' ); ?><input type="text" name="name" required></label>
	<label><?php esc_html_e( 'Email', 'enterprise-theme-v1-1' ); ?><input type="email" name="email" required></label>
	<label><?php esc_html_e( 'Company', 'enterprise-theme-v1-1' ); ?><input type="text" name="company"></label>
	<label><?php esc_html_e( 'Budget', 'enterprise-theme-v1-1' ); ?><input type="text" name="budget"></label>
	<label><?php esc_html_e( 'Timeline', 'enterprise-theme-v1-1' ); ?><input type="text" name="timeline"></label>
	<label><?php esc_html_e( 'Project Type', 'enterprise-theme-v1-1' ); ?><input type="text" name="project_type"></label>
	<label><?php esc_html_e( 'Message', 'enterprise-theme-v1-1' ); ?><textarea name="message"></textarea></label>
	<button class="og-button" type="submit"><?php esc_html_e( 'Submit', 'enterprise-theme-v1-1' ); ?></button>
</form>
