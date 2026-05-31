<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Offer_Signature_Engine
{
    public function request_signature(array $document): array
    {
        if (class_exists('ALGQ_PDF_Signature_Repository') && class_exists('ALGQ_PDF_Signature_Renderer')) {
            $repository = new ALGQ_PDF_Signature_Repository();
            $renderer = new ALGQ_PDF_Signature_Renderer();
            $payload = $document['merge_payload'] ?? [];
            $id = $repository->create_document([
                'title' => $document['title'] ?? 'Offer Document',
                'document_type' => $document['document_type'] ?? 'offer',
                'related_deal_id' => $document['deal_id'] ?? '',
                'recipient_name' => $payload['seller_name'] ?? 'Seller',
                'recipient_email' => $payload['seller_email'] ?? '',
                'status' => 'sent',
                'payload' => $payload,
            ], (string) ($document['rendered_html'] ?? ''));

            if ($id) {
                $created = $repository->find((int) $id);
                if ($created) {
                    $pdf = $renderer->render_pdf_binary($created);
                    return [
                        'signature_id' => (int) $id,
                        'signature_uid' => (string) $created['document_uid'],
                        'pdf_checksum' => $renderer->checksum($pdf),
                        'status' => 'sent',
                    ];
                }
            }
        }

        return [
            'signature_id' => 0,
            'signature_uid' => 'LOCAL-' . strtoupper(wp_generate_password(10, false, false)),
            'pdf_checksum' => '',
            'status' => 'queued',
        ];
    }
}
