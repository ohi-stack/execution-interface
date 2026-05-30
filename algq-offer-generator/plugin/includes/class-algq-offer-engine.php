<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Offer_Engine
{
    /**
     * @param array<string, mixed> $input
     * @return array<string, mixed>
     */
    public function generate(array $input): array
    {
        $purchase_price = max(0, (float) ($input['purchase_price'] ?? 0));
        $down_payment = min($purchase_price, max(0, (float) ($input['down_payment'] ?? 0)));
        $financed_amount = max(0, $purchase_price - $down_payment);
        $annual_rate = max(0, (float) ($input['annual_rate'] ?? 0));
        $term_months = max(1, (int) ($input['term_months'] ?? 1));
        $monthly_rate = ($annual_rate / 100) / 12;
        $monthly_payment = $monthly_rate > 0
            ? $financed_amount * ($monthly_rate * ((1 + $monthly_rate) ** $term_months)) / (((1 + $monthly_rate) ** $term_months) - 1)
            : $financed_amount / $term_months;

        $total_payments = $monthly_payment * $term_months;
        $seller_total = $down_payment + $total_payments;

        return [
            'document_type' => (string) ($input['document_type'] ?? 'Letter of Intent'),
            'property_address' => (string) ($input['property_address'] ?? ''),
            'seller_name' => (string) ($input['seller_name'] ?? ''),
            'buyer_entity' => (string) ($input['buyer_entity'] ?? ''),
            'purchase_price' => round($purchase_price, 2),
            'down_payment' => round($down_payment, 2),
            'financed_amount' => round($financed_amount, 2),
            'annual_rate' => round($annual_rate, 3),
            'term_months' => $term_months,
            'monthly_payment' => round($monthly_payment, 2),
            'seller_total_income' => round($seller_total, 2),
            'total_interest' => round(max(0, $total_payments - $financed_amount), 2),
            'closing_date' => (string) ($input['closing_date'] ?? ''),
        ];
    }
}
