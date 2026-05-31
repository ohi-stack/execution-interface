<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Offer_PDF_Engine
{
    public function render(array $document): string
    {
        if (class_exists('ALGQ_PDF_Signature_Renderer')) {
            $renderer = new ALGQ_PDF_Signature_Renderer();
            return $renderer->render_pdf_binary([
                'title' => $document['title'] ?? 'Offer Document',
                'document_uid' => $document['document_uid'] ?? '',
                'document_type' => $document['document_type'] ?? 'offer',
                'recipient_name' => $document['merge_payload']['seller_name'] ?? '',
                'recipient_email' => $document['merge_payload']['seller_email'] ?? '',
                'source_payload' => $document['merge_payload'] ?? [],
                'status' => $document['status'] ?? 'draft',
                'execution_status' => 'not_started',
            ]);
        }

        return $this->fallback_pdf($document);
    }

    public function checksum(string $binary): string
    {
        return hash('sha256', $binary);
    }

    private function fallback_pdf(array $document): string
    {
        $title = wp_strip_all_tags((string) ($document['title'] ?? 'Offer Document'));
        $body = wp_strip_all_tags((string) ($document['rendered_html'] ?? ''));
        $content = "BT\n/F1 12 Tf\n72 740 Td\n(" . $this->escape($title) . ") Tj\n0 -24 Td\n(" . $this->escape(substr($body, 0, 900)) . ") Tj\nET\n";
        $objects = [
            '<< /Type /Catalog /Pages 2 0 R >>',
            '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
            '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
            '<< /Length ' . strlen($content) . " >>\nstream\n" . $content . "endstream",
        ];
        $pdf = "%PDF-1.4\n";
        $offsets = [0];
        foreach ($objects as $number => $object) {
            $offsets[] = strlen($pdf);
            $pdf .= ($number + 1) . " 0 obj\n" . $object . "\nendobj\n";
        }
        $xref = strlen($pdf);
        $pdf .= "xref\n0 " . (count($objects) + 1) . "\n0000000000 65535 f \n";
        for ($i = 1; $i <= count($objects); $i++) {
            $pdf .= sprintf('%010d 00000 n ', $offsets[$i]) . "\n";
        }
        return $pdf . "trailer\n<< /Size " . (count($objects) + 1) . " /Root 1 0 R >>\nstartxref\n{$xref}\n%%EOF";
    }

    private function escape(string $text): string
    {
        return str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $text);
    }
}
