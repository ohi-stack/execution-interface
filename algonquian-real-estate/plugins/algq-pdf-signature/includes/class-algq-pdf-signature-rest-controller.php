<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_PDF_Signature_REST_Controller
{
    private ALGQ_PDF_Signature_Repository $repository;
    private ALGQ_PDF_Signature_Renderer $renderer;

    public function __construct(ALGQ_PDF_Signature_Repository $repository, ALGQ_PDF_Signature_Renderer $renderer)
    {
        $this->repository = $repository;
        $this->renderer = $renderer;
    }

    public function register_routes(): void
    {
        register_rest_route('algq/v1', '/documents', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'index'],
                'permission_callback' => [$this, 'can_manage'],
            ],
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'create'],
                'permission_callback' => [$this, 'can_manage'],
            ],
        ]);

        register_rest_route('algq/v1', '/documents/(?P<id>\d+)', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [$this, 'show'],
            'permission_callback' => [$this, 'can_manage'],
        ]);

        register_rest_route('algq/v1', '/documents/(?P<id>\d+)/pdf', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [$this, 'download_pdf'],
            'permission_callback' => [$this, 'can_manage'],
        ]);

        register_rest_route('algq/v1', '/documents/(?P<id>\d+)/send', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [$this, 'send'],
            'permission_callback' => [$this, 'can_manage'],
        ]);

        register_rest_route('algq/v1', '/documents/(?P<id>\d+)/archive', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [$this, 'archive'],
            'permission_callback' => [$this, 'can_manage'],
        ]);

        register_rest_route('algq/v1', '/documents/(?P<id>\d+)/void', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [$this, 'void'],
            'permission_callback' => [$this, 'can_manage'],
        ]);

        register_rest_route('algq/v1', '/documents/(?P<uid>[A-Za-z0-9-]+)/sign', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [$this, 'public_sign'],
            'permission_callback' => '__return_true',
        ]);
    }

    public function index(WP_REST_Request $request): WP_REST_Response
    {
        return rest_ensure_response($this->repository->all((int) ($request->get_param('limit') ?: 50), [
            'status' => $request->get_param('status'),
            'execution_status' => $request->get_param('execution_status'),
            'document_type' => $request->get_param('document_type'),
            'related_deal_id' => $request->get_param('related_deal_id'),
        ]));
    }

    public function show(WP_REST_Request $request)
    {
        $document = $this->repository->find((int) $request['id']);
        if (!$document) {
            return new WP_Error('algq_document_not_found', __('Document not found.', 'algq-pdf-signature'), ['status' => 404]);
        }
        $document['events'] = $this->repository->events((int) $document['id']);
        return rest_ensure_response($document);
    }

    public function create(WP_REST_Request $request)
    {
        $data = $request->get_json_params() ?: $request->get_params();
        $validation = $this->validate_document($data);
        if (!$validation['valid']) {
            return new WP_Error('algq_document_invalid', __('Document validation failed.', 'algq-pdf-signature'), ['status' => 400, 'errors' => $validation['errors']]);
        }

        $html = $this->renderer->render_html($validation['data']);
        $pdf = $this->renderer->render_pdf_binary(array_merge($validation['data'], ['rendered_html' => $html]));
        $id = $this->repository->create_document($validation['data'], $html, $this->renderer->checksum($pdf));

        if (!$id) {
            return new WP_Error('algq_document_insert_failed', __('Document could not be saved.', 'algq-pdf-signature'), ['status' => 500]);
        }

        return new WP_REST_Response($this->repository->find($id), 201);
    }

    public function download_pdf(WP_REST_Request $request)
    {
        $document = $this->repository->find((int) $request['id']);
        if (!$document) {
            return new WP_Error('algq_document_not_found', __('Document not found.', 'algq-pdf-signature'), ['status' => 404]);
        }

        return new WP_REST_Response(base64_encode($this->renderer->render_pdf_binary($document)), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . sanitize_file_name($document['document_uid']) . '.pdf"',
            'X-Algq-Document-Checksum' => $this->renderer->checksum($this->renderer->render_pdf_binary($document)),
        ]);
    }

    public function send(WP_REST_Request $request)
    {
        $document = $this->repository->find((int) $request['id']);
        if (!$document) {
            return new WP_Error('algq_document_not_found', __('Document not found.', 'algq-pdf-signature'), ['status' => 404]);
        }

        $this->repository->mark_sent((int) $document['id'], wp_get_current_user()->user_login);
        return rest_ensure_response($this->repository->find((int) $document['id']));
    }

    public function archive(WP_REST_Request $request)
    {
        $document = $this->repository->find((int) $request['id']);
        if (!$document) {
            return new WP_Error('algq_document_not_found', __('Document not found.', 'algq-pdf-signature'), ['status' => 404]);
        }

        $this->repository->archive((int) $document['id'], wp_get_current_user()->user_login);
        return rest_ensure_response($this->repository->find((int) $document['id']));
    }

    public function void(WP_REST_Request $request)
    {
        $document = $this->repository->find((int) $request['id']);
        if (!$document) {
            return new WP_Error('algq_document_not_found', __('Document not found.', 'algq-pdf-signature'), ['status' => 404]);
        }

        $params = $request->get_json_params() ?: $request->get_params();
        $this->repository->void((int) $document['id'], wp_get_current_user()->user_login, sanitize_textarea_field($params['reason'] ?? ''));
        return rest_ensure_response($this->repository->find((int) $document['id']));
    }

    public function public_sign(WP_REST_Request $request)
    {
        $document = $this->repository->find_by_uid((string) $request['uid']);
        if (!$document) {
            return new WP_Error('algq_document_not_found', __('Document not found.', 'algq-pdf-signature'), ['status' => 404]);
        }

        if (in_array($document['status'], ['signed', 'archived', 'voided', 'expired'], true)) {
            return new WP_Error('algq_document_not_signable', __('Document is not open for signature.', 'algq-pdf-signature'), ['status' => 409]);
        }

        $params = $request->get_json_params() ?: $request->get_params();
        $signer = sanitize_text_field($params['signer_name'] ?? '');
        $signature = sanitize_textarea_field($params['signature'] ?? '');
        if ('' === $signer || '' === $signature) {
            return new WP_Error('algq_signature_invalid', __('Signer name and signature are required.', 'algq-pdf-signature'), ['status' => 400]);
        }

        $ip = sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? '');
        $this->repository->sign_document((int) $document['id'], $signer, $signature, $ip);
        return rest_ensure_response($this->repository->find((int) $document['id']));
    }

    public function can_manage(): bool
    {
        return current_user_can('manage_options');
    }

    private function validate_document(array $data): array
    {
        $errors = [];
        foreach (['title', 'recipient_name', 'recipient_email'] as $field) {
            if (empty($data[$field])) {
                $errors[$field] = __('This field is required.', 'algq-pdf-signature');
            }
        }
        if (!empty($data['recipient_email']) && !is_email($data['recipient_email'])) {
            $errors['recipient_email'] = __('Enter a valid email address.', 'algq-pdf-signature');
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'data' => [
                'title' => sanitize_text_field($data['title'] ?? ''),
                'document_type' => sanitize_key($data['document_type'] ?? 'purchase_agreement'),
                'related_deal_id' => sanitize_text_field($data['related_deal_id'] ?? ''),
                'recipient_name' => sanitize_text_field($data['recipient_name'] ?? ''),
                'recipient_email' => sanitize_email($data['recipient_email'] ?? ''),
                'payload' => is_array($data['payload'] ?? null) ? $data['payload'] : [],
                'expires_at' => sanitize_text_field($data['expires_at'] ?? ''),
            ],
        ];
    }
}
