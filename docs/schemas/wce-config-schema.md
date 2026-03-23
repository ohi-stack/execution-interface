# WCE v0.1 Configuration Schemas

## Global Engine Config

```json
{
  "$id": "wce-config",
  "type": "object",
  "required": ["tenantId", "modules"],
  "properties": {
    "tenantId": { "type": "string" },
    "modules": {
      "type": "object",
      "required": ["keyvault", "rpcRouter", "policy", "audit", "telemetry"],
      "properties": {
        "keyvault": { "type": "object" },
        "evmAdapter": { "type": "object" },
        "registry": { "type": "object" },
        "verify": { "type": "object" },
        "rpcRouter": { "type": "object" },
        "policy": { "type": "object" },
        "audit": { "type": "object" },
        "telemetry": { "type": "object" }
      }
    }
  }
}
```

## Policy Schema

```json
{
  "$id": "policy-config",
  "type": "object",
  "required": ["defaultOutcome", "defaultReasonCode", "rules"],
  "properties": {
    "defaultOutcome": { "enum": ["ALLOW", "DENY", "REQUIRE_CONFIRMATION"] },
    "defaultReasonCode": { "type": "string" },
    "rules": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "outcome", "reasonCode", "condition"],
        "properties": {
          "id": { "type": "string" },
          "outcome": { "enum": ["ALLOW", "DENY", "REQUIRE_CONFIRMATION"] },
          "reasonCode": { "type": "string" },
          "condition": {
            "type": "object",
            "properties": {
              "chainId": { "type": "number" },
              "action": { "enum": ["SEND", "APPROVE"] },
              "destinationIn": { "type": "array", "items": { "type": "string" } },
              "maxAmount": { "type": "string" }
            }
          }
        }
      }
    }
  }
}
```
