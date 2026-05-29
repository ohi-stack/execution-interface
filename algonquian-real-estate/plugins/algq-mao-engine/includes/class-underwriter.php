<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Underwriter
{
    public function analyze(float $arv, float $rehab, float $assignment_fee): array
    {
        $mao = max(0, ($arv * 0.70) - $rehab - $assignment_fee);
        $profit_spread = max(0, $arv - $rehab - $assignment_fee - $mao);
        $risk_score = $this->risk_score($arv, $rehab, $profit_spread);

        return [
            'mao' => round($mao, 2),
            'profit_spread' => round($profit_spread, 2),
            'risk_score' => $risk_score,
        ];
    }

    private function risk_score(float $arv, float $rehab, float $profit_spread): string
    {
        if ($arv <= 0 || $rehab / max($arv, 1) > 0.35) {
            return 'High';
        }

        if ($profit_spread / max($arv, 1) < 0.15) {
            return 'Medium';
        }

        return 'Low';
    }
}
