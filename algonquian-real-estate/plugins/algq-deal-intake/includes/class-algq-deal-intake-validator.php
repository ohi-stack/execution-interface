<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Intake_Validator
{
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
            'condition_notes' => sanitize_textarea_field(wp_unslash($input['condition_notes'] ?? '')),
            'lead_source' => sanitize_key(wp_unslash($input['lead_source'] ?? 'website')),
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

        $allowed_statuses = ['new', 'qualified', 'nurture', 'underwriting', 'rejected'];
        if (!in_array($data['status'], $allowed_statuses, true)) {
            $data['status'] = 'new';
        }

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
}
