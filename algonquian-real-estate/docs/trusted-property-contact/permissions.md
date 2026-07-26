# Roles and permissions

Activation adds stewardship manager, property coordinator, field inspector, authorized vendor, and stewardship client roles. Administrators receive all module capabilities.

Staff routes require the narrow capability for the action. Client access is resolved from the signed-in WordPress user to a stewardship client and then to that client's property. Vendor accounts do not inherit client, sensitive-data, authorization, incident, or expense capabilities.

Sensitive access instructions require `algq_view_sensitive_property_data` in addition to record access. Authorization changes require `algq_manage_authorizations` and expense recording requires `algq_record_expenses`.
