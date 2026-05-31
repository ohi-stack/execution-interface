<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Intake_CSV
{
    private ALGQ_Deal_Intake_Repository $repository;
    private ALGQ_Deal_Intake_Validator $validator;
    private ALGQ_Deal_Intake_Scorer $scorer;

    public function __construct(ALGQ_Deal_Intake_Repository $repository, ALGQ_Deal_Intake_Validator $validator, ALGQ_Deal_Intake_Scorer $scorer)
    {
        $this->repository = $repository;
        $this->validator = $validator;
        $this->scorer = $scorer;
    }

    public function export(): void
    {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('Insufficient permissions.', 'algq-deal-intake'));
        }
        check_admin_referer('algq_deal_export');

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=algq-deals-' . gmdate('Ymd-His') . '.csv');
        echo $this->to_string($this->repository->all(200));
        exit;
    }

    /**
     * @param array<int,array<string,mixed>> $deals
     */
    public function to_string(array $deals): string
    {
        $out = fopen('php://temp', 'r+');
        fputcsv($out, $this->headers());
        foreach ($deals as $deal) {
            fputcsv($out, [
                $deal['deal_id'] ?? '',
                $deal['seller_name'] ?? '',
                $deal['seller_phone'] ?? '',
                $deal['seller_email'] ?? '',
                $deal['address'] ?? '',
                $deal['asking_price'] ?? 0,
                $deal['estimated_arv'] ?? 0,
                $deal['lead_source'] ?? '',
                $deal['source_campaign'] ?? '',
                $deal['source_medium'] ?? '',
                $deal['source_referrer'] ?? '',
                $deal['source_landing_page'] ?? '',
                $deal['motivation_score'] ?? 0,
                implode('|', $deal['property_tags'] ?? []),
                $deal['status'] ?? '',
                $deal['created_at'] ?? '',
            ]);
        }
        rewind($out);
        return (string) stream_get_contents($out);
    }

    public function import(array $file): array
    {
        if (empty($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            return ['imported' => 0, 'errors' => [__('No CSV file was uploaded.', 'algq-deal-intake')]];
        }

        $handle = fopen($file['tmp_name'], 'r');
        if (!$handle) {
            return ['imported' => 0, 'errors' => [__('CSV file could not be opened.', 'algq-deal-intake')]];
        }

        $headers = fgetcsv($handle);
        if (!$headers) {
            fclose($handle);
            return ['imported' => 0, 'errors' => [__('CSV header row is required.', 'algq-deal-intake')]];
        }
        $imported = 0;
        $errors = [];
        $line = 1;

        while (($row = fgetcsv($handle)) !== false) {
            $line++;
            if (count($headers) !== count($row)) {
                $errors[] = sprintf('Line %d: column count does not match header.', $line);
                continue;
            }
            $payload = array_combine($headers, $row) ?: [];
            if (!empty($payload['property_tags'])) {
                $payload['property_tags'] = str_replace('|', ',', $payload['property_tags']);
            }
            $validation = $this->validator->validate($payload);
            if (!$validation['valid']) {
                $errors[] = sprintf('Line %d: %s', $line, implode(' ', $validation['errors']));
                continue;
            }
            $scored = $this->scorer->score($validation['data']);
            $id = $this->repository->create(array_merge($validation['data'], [
                'motivation_score' => $scored['score'],
                'motivation_signals' => $scored['signals'],
                'property_tags' => $scored['tags'],
            ]));
            if ($id) {
                $imported++;
            } else {
                $errors[] = sprintf('Line %d: insert failed.', $line);
            }
        }
        fclose($handle);

        return ['imported' => $imported, 'errors' => $errors];
    }

    /**
     * @return array<int,string>
     */
    private function headers(): array
    {
        return ['deal_id', 'seller_name', 'seller_phone', 'seller_email', 'address', 'asking_price', 'estimated_arv', 'lead_source', 'source_campaign', 'source_medium', 'source_referrer', 'source_landing_page', 'motivation_score', 'property_tags', 'status', 'created_at'];
    }
}
