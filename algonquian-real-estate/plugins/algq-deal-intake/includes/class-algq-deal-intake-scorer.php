<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Intake_Scorer
{
    /**
     * @return array{score:int,signals:array<string,mixed>,tags:array<int,string>}
     */
    public function score(array $data): array
    {
        $score = 20;
        $signals = [];
        $tags = $data['property_tags'] ?? [];

        $timeline = $data['timeline'] ?? 'unknown';
        $timeline_scores = ['asap' => 35, '30_days' => 25, '90_days' => 12, 'unknown' => 0];
        $score += $timeline_scores[$timeline] ?? 0;
        $signals['timeline'] = $timeline;

        $repairs = $data['repairs_needed'] ?? 'unknown';
        $repair_scores = ['major' => 20, 'cosmetic' => 10, 'none' => 0, 'unknown' => 0];
        $score += $repair_scores[$repairs] ?? 0;
        $signals['repairs_needed'] = $repairs;

        $occupancy = $data['occupancy'] ?? 'unknown';
        if (in_array($occupancy, ['vacant', 'tenant'], true)) {
            $score += 10;
        }
        $signals['occupancy'] = $occupancy;

        $reason = strtolower((string) ($data['motivation_reason'] ?? ''));
        $keywords = ['probate', 'foreclosure', 'divorce', 'tax', 'relocation', 'inherited', 'tired landlord', 'vacant'];
        $matched = [];
        foreach ($keywords as $keyword) {
            if (false !== strpos($reason, $keyword)) {
                $score += 8;
                $matched[] = $keyword;
                $tags[] = str_replace(' ', '-', $keyword);
            }
        }
        $signals['reason_keywords'] = array_values(array_unique($matched));
        $signals['motivation_reason'] = $data['motivation_reason'] ?? '';

        $score = max(0, min(100, $score));
        if ($score >= 75) {
            $tags[] = 'high-motivation';
        } elseif ($score >= 50) {
            $tags[] = 'medium-motivation';
        } else {
            $tags[] = 'low-motivation';
        }

        return [
            'score' => $score,
            'signals' => $signals,
            'tags' => array_values(array_unique(array_filter(array_map('sanitize_key', $tags)))),
        ];
    }
}
