# PLUGIN INTEGRATION MAP

## Public Lead Flow

Seller Page
↓
Deal Intake
↓
Pipeline CRM
↓
Offer Generator
↓
Document Library
↓
Funding Tracker
↓
Buyer Portal
↓
Command Center Reporting

## Lead Sources

- Sell Your Property
- FSBO
- Seller Financing
- Inherited Property
- Vacant Property

## Deal Intake Responsibilities

- Create seller lead
- Create property record
- Generate deal ID
- Assign lead source

## Pipeline CRM Responsibilities

- Lead Captured
- Contact Attempted
- Seller Conversation
- Underwriting
- Offer Sent
- Under Contract
- Closed

## Offer Generator

- LOI
- Cash Offer
- Seller Financing Proposal
- Purchase Agreement

## Document Library

- Generated Documents
- Seller Guides
- Internal Templates

## Funding Tracker

- Capital Requirements
- Private Lenders
- Seller Financing
- Joint Ventures

## Buyer Portal

- Deal Distribution
- Buyer Registration
- NDA Gate

## Command Center

- Lead Reporting
- Offer Reporting
- Contract Reporting
- Acquisition Metrics
- Funding Metrics

## Algonquian Tenant Management

- Dedicated plugin: `algonquian-real-estate/plugins/algq-tenant-management/algq-tenant-management.php`.
- Platform bridge: `algonquian-real-estate/plugins/algq-platform/includes/tenant-management-integration.php`.
- When the dedicated plugin is active, the platform tenant module links to `/tenants`.
- When it is inactive, the platform bridge preserves fallback tenant-module shortcode behavior with `[algq_platform_tenant_fallback]`.
