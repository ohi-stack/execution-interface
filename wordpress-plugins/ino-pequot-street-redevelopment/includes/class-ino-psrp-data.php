<?php
if (!defined('ABSPATH')) {
    exit;
}

class INO_PSRP_Data {
    public function manifest() {
        return array(
            'module' => 'ino-pequot-street-redevelopment',
            'version' => INO_PSRP_VERSION,
            'brand' => array('navy' => '#071A33', 'cream' => '#F7F0DF', 'gold' => '#C9A227', 'white' => '#FFFFFF', 'deep_red' => '#7A1E22'),
            'records' => array('parcels', 'surveys', 'documents', 'timeline', 'legal_notices'),
            'forms_bridge' => array('interest', 'survey', 'document_intake', 'legal_notice_acknowledgement'),
            'status' => 'scaffold-ready',
        );
    }

    public function pages() {
        return array(
            'overview' => 'Project Overview', 'history' => 'Neighborhood History', 'housing' => 'Housing & Affordability', 'preservation' => 'Preservation Strategy',
            'parcels' => 'Parcel Inventory', 'gis' => 'GIS & Map Room', 'surveys' => 'Resident Surveys', 'documents' => 'Document Library',
            'timeline' => 'Project Timeline', 'legal-notices' => 'Legal Notices', 'easements' => 'Easement & Title Discipline', 'community' => 'Community Meetings',
            'forms' => 'OneGodian Forms Bridge', 'media' => 'Image & Video Gallery', 'faq' => 'FAQ', 'contact' => 'Contact & Intake',
        );
    }

    public function legal_language() {
        return 'All easement, access, title, boundary, utility, covenant, restriction, and notice references are administrative placeholders only. Nothing in this module conveys, waives, merges, extinguishes, confirms, insures, or adjudicates real property rights. Final language must be reviewed against recorded instruments, survey evidence, municipal requirements, title commitments, and counsel-approved notices before publication or reliance.';
    }
}
