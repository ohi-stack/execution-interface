<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Core_REST_Controller
{
    public const NAMESPACE = 'algq/v1';

    public function register_routes(): void
    {
        register_rest_route(self::NAMESPACE, '/status', [
            'methods' => 'GET',
            'permission_callback' => '__return_true',
            'callback' => [$this, 'status'],
        ]);

        register_rest_route(self::NAMESPACE, '/license/validate', [
            'methods' => 'POST',
            'permission_callback' => [$this, 'can_manage_licenses'],
            'callback' => [$this, 'validate_license'],
            'args' => [
                'license_key' => ['required' => true, 'type' => 'string'],
                'product_slug' => ['required' => true, 'type' => 'string'],
            ],
        ]);
    }

    public function status(): WP_REST_Response
    {
        return new WP_REST_Response([
            'name' => 'Algonquian Core',
            'version' => ALGQ_CORE_VERSION,
            'namespace' => self::NAMESPACE,
            'roles' => array_keys(ALGQ_Core_Activator::ROLES),
            'integrations' => algq_core()->integrations()->providers(),
        ]);
    }

    public function validate_license(WP_REST_Request $request): WP_REST_Response
    {
        return new WP_REST_Response(algq_core()->licensing()->validate(
            sanitize_text_field($request->get_param('license_key')),
            sanitize_key($request->get_param('product_slug'))
        ));
    }

    public function can_manage_licenses(): bool
    {
        return current_user_can('algq_manage_licenses') || current_user_can('manage_options');
    }
}
