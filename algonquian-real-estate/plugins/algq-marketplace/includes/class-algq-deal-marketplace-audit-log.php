<?php
/**
 * Audit logging for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Audit_Log
{
    private ALGQ_Deal_Marketplace_Repository $repository;

    public function __construct(ALGQ_Deal_Marketplace_Repository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param array<string, mixed> $context
     */
    public function record(string $action, string $object_type = '', int $object_id = 0, array $context = []): int
    {
        return $this->repository->insert_audit_log($action, $object_type, $object_id, $context);
    }
}
