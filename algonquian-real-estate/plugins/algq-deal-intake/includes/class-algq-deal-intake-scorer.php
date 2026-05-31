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
        $timeline_scores = ['asap' => 35, '30_days' => 25, '90_days' => 12, '6_months' => 5, 'unknown' => 0];
        $score += $timeline_scores[$timeline] ?? 0;
        $signals['timeline'] = $timeline;
        if ('asap' === $timeline) {
            $tags[] = 'urgent-timeline';
        }

        $repairs = $data['repairs_needed'] ?? 'unknown';
        $repair_scores = ['major' => 20, 'cosmetic' => 10, 'none' => 0, 'unknown' => 0];
        $score += $repair_scores[$repairs] ?? 0;
        $signals['repairs_needed'] = $repairs;
        if ('major' === $repairs) {
            $tags[] = 'heavy-rehab';
        } elseif ('cosmetic' === $repairs) {
            $tags[] = 'cosmetic-rehab';
        }

        $occupancy = $data['occupancy'] ?? 'unknown';
        if (in_array($occupancy, ['vacant', 'tenant'], true)) {
            $score += 10;
            $tags[] = 'tenant' === $occupancy ? 'tenant-occupied' : 'vacant';
        }
        $signals['occupancy'] = $occupancy;

        $asking_price = (float) ($data['asking_price'] ?? 0);
        $estimated_arv = (float) ($data['estimated_arv'] ?? 0);
        if ($asking_price > 0 && $estimated_arv > 0) {
            $price_to_arv = round(($asking_price / $estimated_arv) * 100, 2);
            $signals['price_to_arv_percent'] = $price_to_arv;
            if ($price_to_arv <= 65) {
                $score += 12;
                $tags[] = 'deep-discount';
            } elseif ($price_to_arv <= 75) {
                $score += 6;
                $tags[] = 'margin-watch';
            }
        }

        $reason = strtolower((string) ($data['motivation_reason'] ?? ''));
        $keywords = ['probate', 'foreclosure', 'divorce', 'tax', 'relocation', 'inherited', 'tired landlord', 'vacant', 'code violation', 'behind payments', 'estate'];
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
