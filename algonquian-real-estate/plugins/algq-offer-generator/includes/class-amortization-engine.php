<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Amortization_Engine
{
    public function schedule(float $price, float $annual_rate, int $term_months): array
    {
        $monthly_rate = ($annual_rate / 100) / 12;
        $payment = $monthly_rate > 0 ? $price * ($monthly_rate * ((1 + $monthly_rate) ** $term_months)) / (((1 + $monthly_rate) ** $term_months) - 1) : $price / max($term_months, 1);
        $balance = $price;
        $schedule = [];

        for ($month = 1; $month <= $term_months; $month++) {
            $interest = $balance * $monthly_rate;
            $principal = min($payment - $interest, $balance);
            $balance = max(0, $balance - $principal);
            $schedule[] = [
                'month' => $month,
                'payment' => round($payment, 2),
                'principal' => round($principal, 2),
                'interest' => round($interest, 2),
                'balance' => round($balance, 2),
            ];
        }

        return [
            'payment' => round($payment, 2),
            'seller_total_income' => round($payment * $term_months, 2),
            'schedule' => $schedule,
        ];
    }
}
