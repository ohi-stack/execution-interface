<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Intake_Validator
{
    private const ALLOWED_STATUSES = ['new', 'qualified', 'nurture', 'underwriting', 'rejected', 'contracted', 'closed'];
    private const ALLOWED_TIMELINES = ['asap', '30_days', '90_days', '6_months', 'unknown'];
    private const ALLOWED_OCCUPANCIES = ['owner', 'tenant', 'vacant', 'unknown'];
    private const ALLOWED_REPAIRS = ['none', 'cosmetic', 'major', 'unknown'];

    /**
     * @return array{valid:bool,errors:array<string,string>,data:array<string,mixed>}
     */
    public function validate(array $input): array
    {
        $data = [
            'seller_name' => sanitize_text_field(wp_unslash($input['seller_name'] ?? '')),
            'seller_phone' => sanitize_text_field(wp_unslash($input['seller_phone'] ?? '')),
            'seller_email' => sanitize_email(wp_unslash($input['seller_email'] ?? '')),
            'address' => sanitize_textarea_field(wp_unslash($input['address'] ?? '')),
            'asking_price' => $this->sanitize_money($input['asking_price'] ?? 0),
            'estimated_arv' => $this->sanitize_money($input['estimated_arv'] ?? 0),
            'condition_notes' => sanitize_textarea_field(wp_unslash($input['condition_notes'] ?? '')),
            'lead_source' => sanitize_key(wp_unslash($input['lead_source'] ?? 'website')),
            'source_campaign' => sanitize_text_field(wp_unslash($input['source_campaign'] ?? '')),
            'source_medium' => sanitize_key(wp_unslash($input['source_medium'] ?? '')),
            'source_referrer' => esc_url_raw(wp_unslash($input['source_referrer'] ?? '')),
            'source_landing_page' => esc_url_raw(wp_unslash($input['source_landing_page'] ?? '')),
            'timeline' => sanitize_key(wp_unslash($input['timeline'] ?? 'unknown')),
            'motivation_reason' => sanitize_text_field(wp_unslash($input['motivation_reason'] ?? '')),
            'occupancy' => sanitize_key(wp_unslash($input['occupancy'] ?? 'unknown')),
            'repairs_needed' => sanitize_key(wp_unslash($input['repairs_needed'] ?? 'unknown')),
            'property_tags' => $this->sanitize_tags($input['property_tags'] ?? []),
            'status' => sanitize_key(wp_unslash($input['status'] ?? 'new')),
        ];

        $errors = [];
        if ('' === $data['seller_name']) {
            $errors['seller_name'] = __('Seller name is required.', 'algq-deal-intake');
        }
        if ('' === $data['seller_phone']) {
            $errors['seller_phone'] = __('Seller phone is required.', 'algq-deal-intake');
        }
        if ('' === $data['address']) {
            $errors['address'] = __('Property address is required.', 'algq-deal-intake');
        }
        if ('' !== $data['seller_email'] && !is_email($data['seller_email'])) {
            $errors['seller_email'] = __('Seller email must be valid.', 'algq-deal-intake');
        }
        if ($data['asking_price'] < 0) {
            $errors['asking_price'] = __('Asking price cannot be negative.', 'algq-deal-intake');
        }
        if ($data['estimated_arv'] < 0) {
            $errors['estimated_arv'] = __('Estimated ARV cannot be negative.', 'algq-deal-intake');
        }
        if ('' === $data['lead_source']) {
            $data['lead_source'] = 'website';
        }

        $this->coerce_to_allowed($data, 'timeline', self::ALLOWED_TIMELINES, 'unknown');
        $this->coerce_to_allowed($data, 'occupancy', self::ALLOWED_OCCUPANCIES, 'unknown');
        $this->coerce_to_allowed($data, 'repairs_needed', self::ALLOWED_REPAIRS, 'unknown');
        $this->coerce_to_allowed($data, 'status', self::ALLOWED_STATUSES, 'new');

        return [
            'valid' => [] === $errors,
            'errors' => $errors,
            'data' => $data,
        ];
    }

    private function sanitize_money($value): float
    {
        $clean = is_string($value) ? preg_replace('/[^0-9.\-]/', '', wp_unslash($value)) : $value;
        return round((float) $clean, 2);
    }

    /**
     * @return array<int,string>
     */
    private function sanitize_tags($value): array
    {
        if (is_string($value)) {
            $value = explode(',', wp_unslash($value));
        }
        if (!is_array($value)) {
            return [];
        }

        $tags = array_map(static fn($tag): string => sanitize_key(trim((string) wp_unslash($tag))), $value);
        $tags = array_filter($tags, static fn($tag): bool => '' !== $tag);
        return array_values(array_unique($tags));
    }

    /**
     * @param array<string,mixed> $data
     * @param array<int,string> $allowed
     */
    private function coerce_to_allowed(array &$data, string $field, array $allowed, string $fallback): void
    {
        if (!in_array($data[$field], $allowed, true)) {
            $data[$field] = $fallback;
        }
    }
}
