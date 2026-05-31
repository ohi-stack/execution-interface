<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_PDF_Signature_Renderer
{
    public function render_html(array $data): string
    {
        $payload = $data['payload'] ?? [];
        $title = sanitize_text_field($data['title'] ?? 'Algonquian Real Estate Document');
        $document_type = sanitize_text_field($data['document_type'] ?? 'purchase_agreement');
        $recipient = sanitize_text_field($data['recipient_name'] ?? 'Recipient');
        $property = sanitize_text_field($payload['property_address'] ?? $data['property_address'] ?? 'Property address pending');
        $terms = sanitize_textarea_field($payload['terms'] ?? $data['terms'] ?? 'Execution terms pending final approval.');
        $generated_at = current_time('mysql');

        ob_start();
        ?>
        <article class="algq-document">
            <header>
                <p><strong><?php esc_html_e('Algonquian Real Estate', 'algq-pdf-signature'); ?></strong></p>
                <h1><?php echo esc_html($title); ?></h1>
                <p><?php echo esc_html(ucwords(str_replace('_', ' ', $document_type))); ?> · <?php echo esc_html($generated_at); ?></p>
            </header>
            <section>
                <h2><?php esc_html_e('Parties', 'algq-pdf-signature'); ?></h2>
                <p><?php echo esc_html($recipient); ?> <?php esc_html_e('is requested to review and execute this document.', 'algq-pdf-signature'); ?></p>
            </section>
            <section>
                <h2><?php esc_html_e('Property', 'algq-pdf-signature'); ?></h2>
                <p><?php echo esc_html($property); ?></p>
            </section>
            <section>
                <h2><?php esc_html_e('Terms', 'algq-pdf-signature'); ?></h2>
                <p><?php echo nl2br(esc_html($terms)); ?></p>
            </section>
            <section>
                <h2><?php esc_html_e('Execution', 'algq-pdf-signature'); ?></h2>
                <p><?php esc_html_e('Electronic signatures are captured with signer name, timestamp, IP metadata, and an immutable signature hash.', 'algq-pdf-signature'); ?></p>
                <p><?php esc_html_e('Signer:', 'algq-pdf-signature'); ?> ____________________________</p>
                <p><?php esc_html_e('Date:', 'algq-pdf-signature'); ?> ____________________________</p>
            </section>
        </article>
        <?php
        return trim((string) ob_get_clean());
    }

    public function render_pdf_binary(array $document): string
    {
        $lines = $this->document_lines($document);
        $content = "BT\n/F1 12 Tf\n72 740 Td\n";
        foreach ($lines as $index => $line) {
            if ($index > 0) {
                $content .= "0 -18 Td\n";
            }
            $content .= '(' . $this->escape_pdf_text($line) . ") Tj\n";
        }
        $content .= "ET\n";

        $objects = [];
        $objects[] = '<< /Type /Catalog /Pages 2 0 R >>';
        $objects[] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
        $objects[] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>';
        $objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
        $objects[] = '<< /Length ' . strlen($content) . " >>\nstream\n" . $content . "endstream";

        $pdf = "%PDF-1.4\n";
        $offsets = [0];
        foreach ($objects as $number => $object) {
            $offsets[] = strlen($pdf);
            $pdf .= ($number + 1) . " 0 obj\n" . $object . "\nendobj\n";
        }

        $xref_offset = strlen($pdf);
        $pdf .= "xref\n0 " . (count($objects) + 1) . "\n";
        $pdf .= "0000000000 65535 f \n";
        for ($i = 1; $i <= count($objects); $i++) {
            $pdf .= sprintf('%010d 00000 n ', $offsets[$i]) . "\n";
        }
        $pdf .= "trailer\n<< /Size " . (count($objects) + 1) . " /Root 1 0 R >>\nstartxref\n{$xref_offset}\n%%EOF";

        return $pdf;
    }

    public function checksum(string $pdf_binary): string
    {
        return hash('sha256', $pdf_binary);
    }

    /**
     * @return array<int,string>
     */
    private function document_lines(array $document): array
    {
        $payload = $document['source_payload'] ?? $document['payload'] ?? [];
        return array_filter([
            'Algonquian Real Estate',
            (string) ($document['title'] ?? 'Document'),
            'Document UID: ' . (string) ($document['document_uid'] ?? 'Pending'),
            'Type: ' . ucwords(str_replace('_', ' ', (string) ($document['document_type'] ?? 'document'))),
            'Recipient: ' . (string) ($document['recipient_name'] ?? ''),
            'Email: ' . (string) ($document['recipient_email'] ?? ''),
            'Property: ' . (string) ($payload['property_address'] ?? 'Property address pending'),
            'Terms: ' . (string) ($payload['terms'] ?? 'Execution terms pending final approval.'),
            'Status: ' . (string) ($document['status'] ?? 'draft'),
            'Execution Status: ' . (string) ($document['execution_status'] ?? 'not_started'),
            'Signature Hash: ' . (string) ($document['signature_hash'] ?? ''),
        ]);
    }

    private function escape_pdf_text(string $text): string
    {
        $text = wp_strip_all_tags($text);
        $text = substr($text, 0, 140);
        return str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $text);
    }
}
