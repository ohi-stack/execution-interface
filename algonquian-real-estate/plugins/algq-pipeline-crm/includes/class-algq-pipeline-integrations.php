<?php
/**
 * Integration hooks for adjacent Algonquian plugins.
 *
 * @package Algonquian_Pipeline_CRM
 */

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Pipeline_Integrations
{
    private ALGQ_Pipeline_Database $database;
    private ALGQ_Pipeline_Activity $activity;

    public function __construct(ALGQ_Pipeline_Database $database, ALGQ_Pipeline_Activity $activity)
    {
        $this->database = $database;
        $this->activity = $activity;
    }

    public function register_hooks(): void
    {
        add_action('algq_deal_intake_created', [$this, 'handle_intake_created'], 10, 2);
        add_action('algq_mao_underwriting_saved', [$this, 'handle_underwriting_saved'], 10, 2);
        add_action('algq_offer_generated', [$this, 'handle_offer_generated'], 10, 2);
        add_action('algq_buyer_assigned', [$this, 'handle_buyer_assigned'], 10, 2);
        add_action('algq_funding_status_updated', [$this, 'handle_funding_status_updated'], 10, 2);
    }

    public function handle_intake_created($external_id, $payload = []): void
    {
        $data = is_array($payload) ? $payload : [];
        $data['external_id'] = (string) $external_id;
        $data['stage_key'] = 'lead_captured';
        $data['source'] = 'deal_intake';
        $deal_id = $this->database->create_deal($data);

        if ($deal_id > 0) {
            $deal = $this->database->get_deal($deal_id);
            $this->activity->log($deal_id, 'deal_created', __('Deal created from intake.', 'algq-pipeline-crm'));
            do_action('algq_pipeline_deal_created', $deal_id, $deal);
        }
    }

    public function handle_underwriting_saved($deal_id, $payload = []): void
    {
        $deal_id = absint($deal_id);
        if ($deal_id < 1) {
            return;
        }

        if (is_array($payload) && isset($payload['estimated_arv'])) {
            $this->database->update_deal($deal_id, ['estimated_arv' => $payload['estimated_arv']]);
        }
        $this->activity->log($deal_id, 'underwriting_updated', __('Underwriting updated.', 'algq-pipeline-crm'));
    }

    public function handle_offer_generated($deal_id): void
    {
        $deal_id = absint($deal_id);
        if ($deal_id > 0) {
            $this->activity->log($deal_id, 'offer_generated', __('Offer generated.', 'algq-pipeline-crm'));
        }
    }

    public function handle_buyer_assigned($deal_id, $buyer_id = 0): void
    {
        $deal_id = absint($deal_id);
        if ($deal_id > 0) {
            $this->activity->log($deal_id, 'buyer_assigned', __('Buyer assigned.', 'algq-pipeline-crm'), '', (string) absint($buyer_id));
        }
    }

    public function handle_funding_status_updated($deal_id, $status = ''): void
    {
        $deal_id = absint($deal_id);
        if ($deal_id > 0) {
            $this->activity->log($deal_id, 'funding_status_updated', __('Funding status updated.', 'algq-pipeline-crm'), '', sanitize_text_field((string) $status));
        }
    }
}
